import type { CollectionConfig } from 'payload'

export const Diets: CollectionConfig = {
  slug: 'diets',
  labels: { singular: 'Diet article', plural: 'Diets' },
  admin: {
    group: 'Website content',
    description:
      'Share meal ideas and food tips. The latest three published articles appear on the homepage.',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true },
  fields: [
    {
      type: 'collapsible',
      label: 'Article information',
      fields: [
        { name: 'title', label: 'Article title', type: 'text', required: true },
        {
          name: 'excerpt',
          label: 'Short introduction',
          type: 'textarea',
          required: true,
          admin: { description: 'A short summary shown on cards and at the top of the article.' },
        },
        {
          name: 'body',
          label: 'Full article',
          type: 'richText',
          required: true,
          admin: {
            description:
              'Write your meal ideas, food tips, or the written version of your video here.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Photo and video (optional)',
      fields: [
        {
          name: 'cover',
          label: 'Article photo',
          type: 'upload',
          relationTo: 'media',
          filterOptions: { mimeType: { contains: 'image/' } },
          admin: {
            description:
              'Used on the card and as the page background. Leave empty to use the default nutrition illustration.',
          },
        },
        {
          name: 'video',
          label: 'Video',
          type: 'upload',
          relationTo: 'media',
          filterOptions: { mimeType: { contains: 'video/' } },
          admin: { description: 'Optional. Upload an MP4 or WebM video for visitors to watch.' },
        },
        {
          name: 'duration',
          label: 'Video length (minutes)',
          type: 'number',
          min: 1,
          admin: {
            description: 'For example, enter 5 for a five-minute video.',
            condition: (data) => Boolean(data.video),
          },
        },
      ],
    },
    {
      name: 'slug',
      label: 'Page link',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Created from the title automatically. Only change it if you need a different web address.',
      },
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
    {
      name: 'category',
      label: 'Topic',
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
      label: 'Publication date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        description:
          'The date shown on the article. Newer articles appear first. Use Publish to make an article visible.',
      },
    },
  ],
}
