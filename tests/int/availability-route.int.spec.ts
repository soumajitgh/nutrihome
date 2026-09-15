import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const db = vi.hoisted(() => ({ auth: vi.fn(), find: vi.fn(), create: vi.fn() }))
vi.mock('payload', () => ({ getPayload: vi.fn(async () => db) }))
vi.mock('@payload-config', () => ({ default: {} }))
import { POST } from '../../src/app/api/slots/route'

const hours = {
  mode: 'availability',
  startDate: '2026-09-21',
  endDate: '2026-09-21',
  startTime: '09:00',
  endTime: '17:00',
  duration: 60,
}
const request = (body = hours) =>
  new NextRequest('http://localhost/api/slots', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

describe('Save availability', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.auth.mockResolvedValue({ user: { id: 1 } })
    db.find.mockResolvedValue({ docs: [] })
    db.create.mockResolvedValue({ id: 1 })
  })
  it('creates eight persisted slots with access control', async () => {
    const response = await POST(request())
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ createdCount: 8, skippedCount: 0 })
    expect(db.create).toHaveBeenCalledTimes(8)
    expect(db.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        overrideAccess: false,
        user: { id: 1 },
        data: expect.objectContaining({
          date: '2026-09-21',
          startTime: '16:00',
          endTime: '17:00',
          status: 'available',
        }),
      }),
    )
  })
  it('leaves existing available, blocked and booked intervals unchanged on repeat saves', async () => {
    const existing = [
      { date: hours.startDate, startTime: '09:00', endTime: '10:00', status: 'available' },
      { date: hours.startDate, startTime: '10:00', endTime: '11:00', status: 'blocked' },
      { date: hours.startDate, startTime: '11:30', endTime: '12:30', status: 'booked' },
    ]
    db.find.mockImplementation(async () => ({ docs: existing }))
    db.create.mockImplementation(async ({ data }) => {
      existing.push(data)
      return data
    })
    const first = await POST(request())
    expect(await first.json()).toMatchObject({ createdCount: 4, skippedCount: 4 })
    const second = await POST(request())
    expect(await second.json()).toMatchObject({ createdCount: 0, skippedCount: 8 })
    expect(db.create).toHaveBeenCalledTimes(4)
  })
  it('rejects invalid duration before any writes', async () => {
    expect((await POST(request({ ...hours, duration: 0 }))).status).toBe(400)
    expect(db.create).not.toHaveBeenCalled()
  })
  it('requires an authenticated admin user', async () => {
    db.auth.mockResolvedValue({ user: null })
    expect((await POST(request())).status).toBe(401)
    expect(db.create).not.toHaveBeenCalled()
  })
})
