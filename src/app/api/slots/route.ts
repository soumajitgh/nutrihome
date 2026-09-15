import { getPayload, type Where } from 'payload'
import { generateAppointments, appointmentsOverlap, type AppointmentTime } from '@/lib/availability'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(req.url)

    const date = searchParams.get('date')
    const month = searchParams.get('month')
    const serviceId = searchParams.get('serviceId')
    const status = searchParams.get('status') || 'available'
    const allStatuses = searchParams.get('all') === 'true'
    if (allStatuses) {
      const { user } = await payload.auth({ headers: req.headers })
      if (!user)
        return NextResponse.json(
          { error: 'Please sign in to manage availability.' },
          { status: 401 },
        )
    }

    const whereConditions: Where[] = []

    if (!allStatuses) {
      whereConditions.push({ status: { equals: status } })
    }

    if (date) {
      whereConditions.push({ date: { equals: date } })
    } else if (month) {
      // match YYYY-MM
      whereConditions.push({ date: { like: `${month}-%` } })
    }

    if (serviceId) {
      whereConditions.push({
        or: [{ service: { equals: serviceId } }, { service: { exists: false } }],
      })
    }

    const where = whereConditions.length > 0 ? { and: whereConditions } : undefined

    const slots = await payload.find({
      collection: 'slots',
      where,
      limit: 500,
      pagination: !allStatuses,
      sort: ['date', 'startTime'],
      depth: 1,
    })

    return NextResponse.json({ docs: slots.docs, totalDocs: slots.totalDocs })
  } catch (error: any) {
    console.error('Error fetching slots:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch slots' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()

    if (body.mode === 'bulk' || body.mode === 'availability') {
      const { user } = await payload.auth({ headers: req.headers })
      if (!user)
        return NextResponse.json(
          { error: 'Please sign in to manage availability.' },
          { status: 401 },
        )
      let appointments
      try {
        appointments = generateAppointments({
          startDate: body.startDate,
          endDate: body.endDate,
          startTime: body.startTime,
          endTime: body.endTime,
          duration: body.duration,
          daysOfWeek: body.daysOfWeek,
          buffer: body.buffer,
        })
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Invalid availability.' },
          { status: 400 },
        )
      }
      const existing = await payload.find({
        collection: 'slots',
        where: {
          and: [
            { date: { greater_than_equal: body.startDate } },
            { date: { less_than_equal: body.endDate } },
          ],
        },
        pagination: false,
        depth: 0,
        user,
        overrideAccess: false,
      })
      let createdCount = 0
      let skippedCount = 0
      const occupied = new Map<string, AppointmentTime[]>()
      for (const slot of existing.docs) {
        const daySlots = occupied.get(slot.date) || []
        daySlots.push(slot)
        occupied.set(slot.date, daySlots)
      }
      for (const appointment of appointments) {
        const daySlots = occupied.get(appointment.date) || []
        if (daySlots.some((slot) => appointmentsOverlap(slot, appointment))) {
          skippedCount++
          continue
        }
        await payload.create({
          collection: 'slots',
          data: { ...appointment, service: body.serviceId || undefined, status: 'available' },
          user,
          overrideAccess: false,
        })
        daySlots.push(appointment)
        occupied.set(appointment.date, daySlots)
        createdCount++
      }
      return NextResponse.json({ success: true, createdCount, skippedCount })
    }

    // Single creation
    const { date, startTime, endTime, serviceId, notes } = body
    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'date, startTime, and endTime are required' },
        { status: 400 },
      )
    }

    const newSlot = await payload.create({
      collection: 'slots',
      data: {
        date,
        startTime,
        endTime,
        service: serviceId || undefined,
        notes,
        status: 'available',
      },
    })

    return NextResponse.json({ success: true, doc: newSlot })
  } catch (error: any) {
    console.error('Error creating slots:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create slot(s)' },
      { status: 500 },
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const updated = await payload.update({
      collection: 'slots',
      id,
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    })

    return NextResponse.json({ success: true, doc: updated })
  } catch (error: any) {
    console.error('Error updating slot:', error)
    return NextResponse.json({ error: error.message || 'Failed to update slot' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const idsParam = searchParams.get('ids')

    if (id) {
      await payload.delete({
        collection: 'slots',
        id,
      })
      return NextResponse.json({ success: true, deletedId: id })
    }

    if (idsParam) {
      const ids = idsParam.split(',')
      for (const singleId of ids) {
        await payload.delete({
          collection: 'slots',
          id: singleId,
        })
      }
      return NextResponse.json({ success: true, deletedCount: ids.length })
    }

    return NextResponse.json({ error: 'id or ids query param is required' }, { status: 400 })
  } catch (error: any) {
    console.error('Error deleting slot:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete slot' }, { status: 500 })
  }
}
