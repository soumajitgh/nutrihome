import { describe, expect, it } from 'vitest'
import { generateAppointments, appointmentsOverlap } from '../../src/lib/availability'

const hours = {
  startDate: '2026-09-21',
  endDate: '2026-09-21',
  startTime: '09:00',
  endTime: '17:00',
  duration: 60,
}

describe('Availability generation', () => {
  it('splits 9 AM–5 PM into eight hourly appointments', () => {
    const slots = generateAppointments(hours)
    expect(slots).toHaveLength(8)
    expect(slots[0]).toEqual({ date: '2026-09-21', startTime: '09:00', endTime: '10:00' })
    expect(slots[7]).toEqual({ date: '2026-09-21', startTime: '16:00', endTime: '17:00' })
  })
  it('uses a configurable duration and omits incomplete final appointments', () => {
    expect(generateAppointments({ ...hours, duration: 30 })).toHaveLength(16)
    const slots = generateAppointments({ ...hours, duration: 45 })
    expect(slots).toHaveLength(10)
    expect(slots.at(-1)?.endTime).toBe('16:30')
  })
  it('preserves dates across month boundaries and selected weekdays', () => {
    const slots = generateAppointments({
      ...hours,
      startDate: '2026-09-30',
      endDate: '2026-10-02',
      daysOfWeek: [3, 5],
    })
    expect([...new Set(slots.map((slot) => slot.date))]).toEqual(['2026-09-30', '2026-10-02'])
    expect(slots).toHaveLength(16)
  })
  it.each([0, -10, 1.5, NaN, Infinity])('rejects invalid appointment length %s', (duration) => {
    expect(() => generateAppointments({ ...hours, duration })).toThrow()
  })
  it('rejects invalid dates, ranges, times and empty weekdays', () => {
    expect(() => generateAppointments({ ...hours, startDate: '2026-02-30' })).toThrow()
    expect(() => generateAppointments({ ...hours, endDate: '2026-09-20' })).toThrow()
    expect(() => generateAppointments({ ...hours, endTime: '08:00' })).toThrow()
    expect(() => generateAppointments({ ...hours, endTime: '25:00' })).toThrow()
    expect(() => generateAppointments({ ...hours, duration: 600 })).toThrow()
    expect(() => generateAppointments({ ...hours, daysOfWeek: [] })).toThrow()
  })
  it('detects duplicates and partial overlaps but permits adjacent times', () => {
    const slot = { date: hours.startDate, startTime: '09:00', endTime: '10:00' }
    expect(appointmentsOverlap(slot, slot)).toBe(true)
    expect(appointmentsOverlap(slot, { ...slot, startTime: '09:30', endTime: '10:30' })).toBe(true)
    expect(appointmentsOverlap(slot, { ...slot, startTime: '10:00', endTime: '11:00' })).toBe(false)
    expect(appointmentsOverlap(slot, { ...slot, date: '2026-09-22' })).toBe(false)
  })
})
