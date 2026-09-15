import type { CollectionConfig } from 'payload'

export const Diets: CollectionConfig = {
  slug: 'diets',
  labels: { singular: 'Diet episode', plural: 'Diets' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', '_status', 'publishedAt'] },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = value || data?.title
            return typeof source === 'string'
              ? source
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-+|-+$/g, '')
              : source
          },
        ],
      },
    },
    { name: 'excerpt', type: 'textarea', required: true },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: { mimeType: { contains: 'image/' } },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video/' } },
      admin: {
        description: 'Upload an MP4 or WebM episode. The body can also be used as a transcript.',
      },
    },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'duration',
      type: 'number',
      min: 1,
      admin: { description: 'Watch time in minutes', position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'everyday',
      options: [
        { label: 'Everyday eating', value: 'everyday' },
        { label: 'In the kitchen', value: 'kitchen' },
        { label: 'Food & wellbeing', value: 'wellbeing' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
  ],
}
