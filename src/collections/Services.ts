import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Website content',
    description: 'Create and edit the services visitors can book.',
    useAsTitle: 'title',
    defaultColumns: ['title', 'featuredOnHome', 'order', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Service information',
      fields: [
        {
          name: 'title',
          label: 'Service name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Short introduction',
          type: 'textarea',
          required: true,
          admin: {
            description: 'A short summary shown on service cards and at the top of the page.',
          },
        },
        {
          name: 'detail',
          label: 'What is included',
          type: 'text',
          required: true,
          admin: { description: 'For example: Personal advice and a meal plan.' },
        },
        {
          name: 'body',
          label: 'Full service description',
          type: 'richText',
          required: true,
          admin: { description: 'Explain who this is for, what happens, and how you can help.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Photo (optional)',
      fields: [
        {
          name: 'image',
          label: 'Service photo',
          type: 'upload',
          relationTo: 'media',
          filterOptions: { mimeType: { contains: 'image/' } },
          admin: {
            description:
              'Choose a photo for the card and page background. Leave empty to use the default nutrition illustration.',
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
          'Created from the name automatically. Only change it if you need a different web address.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            if (typeof value === 'string') {
              return value
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      defaultValue: 30,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'featuredOnHome',
      label: 'Show on the homepage',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'The first three selected services appear on the homepage, sorted by display position.',
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      label: 'Display position',
      type: 'number',
      defaultValue: 1,
      admin: {
        position: 'sidebar',
        description: 'Smaller numbers appear first: 1, then 2, then 3.',
      },
    },
    {
      name: 'status',
      label: 'Visibility',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Visible on the website', value: 'published' },
        { label: 'Hidden draft', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
