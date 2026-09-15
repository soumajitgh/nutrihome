import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { createBookingConfirmationEmail } from '@/lib/booking-email'

const bookingTimeZone = process.env.BOOKING_TIMEZONE || 'Asia/Kolkata'

// Helper to generate Google Calendar link
function generateGoogleCalendarUrl({
  title,
  description,
  date,
  startTime,
  endTime,
}: {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
}) {
  const cleanDate = date.replace(/-/g, '')
  const cleanStart = startTime.replace(':', '') + '00'
  const cleanEnd = endTime.replace(':', '') + '00'

  const startIso = `${cleanDate}T${cleanStart}`
  const endIso = `${cleanDate}T${cleanEnd}`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Consultation: ${title}`,
    dates: `${startIso}/${endIso}`,
    details: description || 'Your nutrition consultation with Bidisha.',
    ctz: bookingTimeZone,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Helper to generate standard iCal content
function generateIcsData({
  title,
  description,
  date,
  startTime,
  endTime,
}: {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
}) {
  const cleanDate = date.replace(/-/g, '')
  const cleanStart = startTime.replace(':', '') + '00'
  const cleanEnd = endTime.replace(':', '') + '00'

  const startIso = `${cleanDate}T${cleanStart}`
  const endIso = `${cleanDate}T${cleanEnd}`
  const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nutrihome//Consultation Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@nutrihome.com`,
    `DTSTAMP:${nowIso}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:Consultation: ${title}`,
    `DESCRIPTION:${description || 'Nutrition consultation with Bidisha.'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(req.url)

    const month = searchParams.get('month') // YYYY-MM
    const date = searchParams.get('date') // YYYY-MM-DD
    const status = searchParams.get('status')
    const serviceId = searchParams.get('serviceId')

    const whereConditions: Record<string, any>[] = []

    if (status) {
      whereConditions.push({ status: { equals: status } })
    }

    if (date) {
      whereConditions.push({ bookingDate: { equals: date } })
    } else if (month) {
      whereConditions.push({ bookingDate: { like: `${month}-%` } })
    }

    if (serviceId) {
      whereConditions.push({ service: { equals: serviceId } })
    }

    const where = whereConditions.length > 0 ? { and: whereConditions } : undefined

    const bookings = await payload.find({
      collection: 'bookings',
      where,
      limit: 500,
      sort: '-bookingDate,startTime',
      depth: 2,
    })

    return NextResponse.json({ docs: bookings.docs, totalDocs: bookings.totalDocs })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()

    const { slotId, serviceId, clientName, clientEmail, clientPhone, notes } = body

    if (!slotId || !serviceId || !clientName || !clientEmail) {
      return NextResponse.json(
        { error: 'slotId, serviceId, clientName, and clientEmail are required' },
        { status: 400 },
      )
    }

    // 1. Concurrency safe check: verify slot is still available
    const slot = await payload.findByID({
      collection: 'slots',
      id: slotId,
    })

    if (!slot) {
      return NextResponse.json({ error: 'Selected slot not found' }, { status: 404 })
    }

    if (slot.status !== 'available') {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please select another slot.' },
        { status: 409 },
      )
    }

    // 2. Fetch service for title and details
    const serviceDoc = await payload.findByID({
      collection: 'services',
      id: serviceId,
    })

    const serviceTitle = serviceDoc?.title || 'Nutrition Consultation'

    // 3. Create booking
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        service: serviceId,
        slot: slotId,
        clientName,
        clientEmail,
        clientPhone: clientPhone || undefined,
        bookingDate: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'confirmed',
        notes: notes || undefined,
      },
    })

    // 4. Mark slot as booked
    await payload.update({
      collection: 'slots',
      id: slotId,
      data: {
        status: 'booked',
      },
    })

    // 5. Generate Google Calendar URL and .ics file
    const googleUrl = generateGoogleCalendarUrl({
      title: serviceTitle,
      description: `Nutrition consultation with Bidisha.\nClient: ${clientName}\nEmail: ${clientEmail}`,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })

    const icsData = generateIcsData({
      title: serviceTitle,
      description: `Nutrition consultation with Bidisha for ${clientName}`,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })

    // 6. Send the client a booking confirmation. A provider outage should not
    // undo an otherwise successful booking, so report delivery separately.
    let confirmationEmailSent = false

    if (!process.env.RESEND_API_KEY) {
      payload.logger.warn('Booking confirmation email skipped because RESEND_API_KEY is not set.')
    } else {
      try {
        const confirmationEmail = createBookingConfirmationEmail({
          clientName,
          serviceTitle,
          bookingDate: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          googleCalendarUrl: googleUrl,
          timeZone: bookingTimeZone,
        })

        await payload.sendEmail({
          to: clientEmail,
          subject: confirmationEmail.subject,
          text: confirmationEmail.text,
          html: confirmationEmail.html,
          attachments: [
            {
              filename: `nutrihome-consultation-${slot.date}.ics`,
              content: Buffer.from(icsData).toString('base64'),
              contentType: 'text/calendar; charset=utf-8',
            },
          ],
        })

        confirmationEmailSent = true
      } catch (emailError) {
        payload.logger.error({
          err: emailError,
          bookingId: booking.id,
          msg: 'Failed to send booking confirmation email',
        })
      }
    }

    return NextResponse.json({
      success: true,
      booking,
      email: {
        sent: confirmationEmailSent,
      },
      calendar: {
        googleUrl,
        icsData,
      },
    })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: error.message || 'Failed to book slot' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    const updated = await payload.update({
      collection: 'bookings',
      id,
      data: { status },
    })

    return NextResponse.json({ success: true, doc: updated })
  } catch (error: any) {
    console.error('Error updating booking status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 500 },
    )
  }
}
