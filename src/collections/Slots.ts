import type { CollectionConfig } from 'payload'

export const Slots: CollectionConfig = {
  slug: 'slots',
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'startTime', 'endTime', 'service', 'status'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'date',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Format: YYYY-MM-DD (e.g. 2026-09-20)',
      },
    },
    {
      name: 'startTime',
      type: 'text',
      required: true,
      admin: {
        description: '24-hour format: HH:mm (e.g. 09:30, 14:00)',
      },
    },
    {
      name: 'endTime',
      type: 'text',
      required: true,
      admin: {
        description: '24-hour format: HH:mm (e.g. 10:30, 15:00)',
      },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      hasMany: false,
      admin: {
        description: 'Select a specific service, or leave blank for any service',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'available',
      required: true,
      index: true,
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Booked', value: 'booked' },
        { label: 'Blocked', value: 'blocked' },
      ],
    },
    {
      name: 'notes',
      type: 'text',
      admin: {
        description: 'Internal notes (e.g. recurring slot, lunch break)',
      },
    },
  ],
  timestamps: true,
}
