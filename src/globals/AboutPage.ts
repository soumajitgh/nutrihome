import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  admin: {
    group: 'Website',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Introduction',
          fields: [
            {
              name: 'introduction',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', required: true },
                { name: 'name', type: 'text', required: true },
                { name: 'role', type: 'text', required: true },
                { name: 'location', type: 'text', required: true },
                {
                  name: 'summary',
                  type: 'textarea',
                  required: true,
                  admin: { rows: 5 },
                },
                {
                  name: 'philosophy',
                  type: 'textarea',
                  required: true,
                  admin: { rows: 4 },
                },
                {
                  name: 'portrait',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description:
                      'Optional. The homepage portrait is used when no image is selected.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Experience',
          fields: [
            {
              name: 'experience',
              type: 'array',
              required: true,
              labels: { singular: 'Position', plural: 'Positions' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'organisation', type: 'text', required: true },
                { name: 'role', type: 'text', required: true },
                { name: 'location', type: 'text', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'startDate', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'endDate', type: 'text', required: true, admin: { width: '50%' } },
                  ],
                },
                { name: 'summary', type: 'textarea', required: true, admin: { rows: 3 } },
                {
                  name: 'highlights',
                  type: 'array',
                  labels: { singular: 'Highlight', plural: 'Highlights' },
                  fields: [{ name: 'detail', type: 'textarea', required: true }],
                },
              ],
            },
          ],
        },
        {
          label: 'Specialties',
          fields: [
            {
              name: 'specialties',
              type: 'array',
              required: true,
              labels: { singular: 'Specialty group', plural: 'Specialty groups' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                {
                  name: 'areas',
                  type: 'array',
                  required: true,
                  labels: { singular: 'Area', plural: 'Areas' },
                  fields: [{ name: 'name', type: 'text', required: true }],
                },
              ],
            },
          ],
        },
        {
          label: 'Education & more',
          fields: [
            {
              name: 'education',
              type: 'array',
              required: true,
              labels: { singular: 'Qualification', plural: 'Qualifications' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'institution', type: 'text', required: true },
                { name: 'degree', type: 'text', required: true },
                { name: 'year', type: 'text', required: true },
                { name: 'result', type: 'text' },
              ],
            },
            {
              name: 'certifications',
              type: 'array',
              labels: {
                singular: 'Certification or membership',
                plural: 'Certifications & memberships',
              },
              admin: { initCollapsed: true },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'issuer', type: 'text' },
                { name: 'year', type: 'text' },
              ],
            },
            {
              name: 'languages',
              type: 'array',
              required: true,
              labels: { singular: 'Language', plural: 'Languages' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'proficiency', type: 'text', required: true },
              ],
            },
            {
              name: 'contact',
              type: 'group',
              fields: [
                { name: 'email', type: 'email', required: true },
                { name: 'phone', type: 'text', required: true },
                { name: 'ctaLabel', type: 'text', required: true },
                { name: 'ctaHeading', type: 'text', required: true },
                { name: 'ctaText', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
