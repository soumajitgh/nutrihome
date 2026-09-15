import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'clientEmail', 'service', 'bookingDate', 'startTime', 'status'],
  },
  access: {
    read: () => true,
    create: () => true, // Allows clients to book calls
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req, previousDoc }) => {
        try {
          const slotId = typeof doc.slot === 'object' && doc.slot !== null ? doc.slot.id : doc.slot
          if (!slotId) return

          if (operation === 'create' || (previousDoc && previousDoc.status !== doc.status)) {
            if (doc.status === 'confirmed') {
              await req.payload.update({
                collection: 'slots',
                id: slotId,
                data: { status: 'booked' },
                req,
              })
            } else if (doc.status === 'cancelled') {
              await req.payload.update({
                collection: 'slots',
                id: slotId,
                data: { status: 'available' },
                req,
              })
            }
          }
        } catch (err) {
          req.payload.logger.error(`Error updating slot status in booking afterChange: ${err}`)
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        try {
          const slotId = typeof doc.slot === 'object' && doc.slot !== null ? doc.slot.id : doc.slot
          if (!slotId) return

          await req.payload.update({
            collection: 'slots',
            id: slotId,
            data: { status: 'available' },
            req,
          })
        } catch (err) {
          req.payload.logger.error(`Error releasing slot in booking afterDelete: ${err}`)
        }
      },
    ],
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Client Name',
    },
    {
      name: 'clientEmail',
      type: 'email',
      required: true,
      label: 'Client Email',
    },
    {
      name: 'clientPhone',
      type: 'text',
      label: 'Client Phone',
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    {
      name: 'slot',
      type: 'relationship',
      relationTo: 'slots',
      required: true,
    },
    {
      name: 'bookingDate',
      type: 'text',
      required: true,
      admin: {
        description: 'Format: YYYY-MM-DD',
      },
    },
    {
      name: 'startTime',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. 10:00',
      },
    },
    {
      name: 'endTime',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. 11:00',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'confirmed',
      required: true,
      options: [
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Client Notes / Consultation Goals',
    },
  ],
  timestamps: true,
}
