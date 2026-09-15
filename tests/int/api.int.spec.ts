import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('fetches services with required fields and featured services for home page', async () => {
    const services = await payload.find({
      collection: 'services',
      where: {
        featuredOnHome: { equals: true },
      },
    })
    expect(services.docs.length).toBeGreaterThanOrEqual(1)
    const service = services.docs[0]
    expect(service.title).toBeDefined()
    expect(service.slug).toBeDefined()
    expect(service.description).toBeDefined()
    expect(service.detail).toBeDefined()
    expect(service.duration).toBeGreaterThan(0)
    expect(service.body).toBeDefined()
  })

  it('verifies slot management lifecycle and booking synchronization', async () => {
    // 1. Find a service to link
    const services = await payload.find({
      collection: 'services',
      limit: 1,
    })
    const serviceId = services.docs[0].id

    // 2. Create a test slot
    const testSlot = await payload.create({
      collection: 'slots',
      data: {
        date: '2026-12-31',
        startTime: '09:00',
        endTime: '10:00',
        service: serviceId,
        status: 'available',
        notes: 'Integration test slot',
      },
    })
    expect(testSlot.id).toBeDefined()
    expect(testSlot.status).toBe('available')

    // 3. Create a booking for this slot
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        clientName: 'Integration Test User',
        clientEmail: 'test@example.com',
        clientPhone: '+1234567890',
        service: serviceId,
        slot: testSlot.id,
        bookingDate: '2026-12-31',
        startTime: '09:00',
        endTime: '10:00',
        status: 'confirmed',
        notes: 'Test booking notes',
      },
    })
    expect(booking.id).toBeDefined()
    expect(booking.status).toBe('confirmed')

    // 4. Verify the slot status is updated to 'booked' via hook
    const updatedSlot = await payload.findByID({
      collection: 'slots',
      id: testSlot.id,
    })
    expect(updatedSlot.status).toBe('booked')

    // 5. Update booking to cancelled and verify slot status is returned to 'available'
    await payload.update({
      collection: 'bookings',
      id: booking.id,
      data: {
        status: 'cancelled',
      },
    })

    const releasedSlot = await payload.findByID({
      collection: 'slots',
      id: testSlot.id,
    })
    expect(releasedSlot.status).toBe('available')

    // Clean up
    await payload.delete({
      collection: 'bookings',
      id: booking.id,
    })
    await payload.delete({
      collection: 'slots',
      id: testSlot.id,
    })
  })
})
