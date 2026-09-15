export interface AvailabilityInput {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  duration: number
  daysOfWeek?: number[]
  buffer?: number
}

export interface AppointmentTime {
  date: string
  startTime: string
  endTime: string
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Choose a valid date.')
  const date = new Date(`${value}T00:00:00Z`)
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error('Choose a valid date.')
  }
  return date
}

function minutes(value: string) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error('Choose valid start and end times.')
  const [hour, minute] = value.split(':').map(Number)
  return hour * 60 + minute
}

const time = (value: number) =>
  `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`

export function generateAppointments(input: AvailabilityInput): AppointmentTime[] {
  const start = parseDate(input.startDate)
  const end = parseDate(input.endDate)
  const startMinutes = minutes(input.startTime)
  const endMinutes = minutes(input.endTime)
  const buffer = input.buffer ?? 0
  const days = input.daysOfWeek ?? [0, 1, 2, 3, 4, 5, 6]
  if (end < start) throw new Error('The end date must be on or after the start date.')
  if ((end.getTime() - start.getTime()) / 86400000 > 365)
    throw new Error('Choose a date range of at most one year.')
  if (!Number.isInteger(input.duration) || input.duration < 1 || input.duration > 1440)
    throw new Error('Appointment length must be a positive number of minutes.')
  if (!Number.isInteger(buffer) || buffer < 0 || buffer > 1440)
    throw new Error('Choose a valid buffer.')
  if (
    !Array.isArray(days) ||
    !days.length ||
    days.some((day) => !Number.isInteger(day) || day < 0 || day > 6)
  )
    throw new Error('Select at least one valid day of the week.')
  if (endMinutes <= startMinutes) throw new Error('End time must be later than start time.')
  if (input.duration > endMinutes - startMinutes)
    throw new Error('Appointment length must fit within your available hours.')
  const appointments: AppointmentTime[] = []
  for (const date = new Date(start); date <= end; date.setUTCDate(date.getUTCDate() + 1)) {
    if (!days.includes(date.getUTCDay())) continue
    for (
      let minute = startMinutes;
      minute + input.duration <= endMinutes;
      minute += input.duration + buffer
    ) {
      appointments.push({
        date: date.toISOString().slice(0, 10),
        startTime: time(minute),
        endTime: time(minute + input.duration),
      })
      if (appointments.length > 5000)
        throw new Error(
          'Choose a shorter date range or a longer appointment length (maximum 5,000 slots).',
        )
    }
  }
  if (!appointments.length) throw new Error('No selected weekdays fall within this date range.')
  return appointments
}

export function appointmentsOverlap(a: AppointmentTime, b: AppointmentTime) {
  return a.date === b.date && a.startTime < b.endTime && b.startTime < a.endTime
}
