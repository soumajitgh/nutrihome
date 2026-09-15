import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Slots } from './collections/Slots'
import { Bookings } from './collections/Bookings'
import { Diets } from './collections/Diets'
import { r2StoragePlugin } from './lib/r2'
import { AboutPage } from './globals/AboutPage'
import { seedInitialData } from './lib/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseURL =
  process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:.data/payload.db'
const databaseAuthToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN

if (databaseURL.startsWith('libsql://') && !databaseAuthToken) {
  throw new Error('DATABASE_AUTH_TOKEN is required when DATABASE_URL points to Turso.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ['@/components/admin/BookingsDashboard#BookingsDashboard'],
      afterNavLinks: ['@/components/admin/AdminNavSlotLink#AdminNavSlotLink'],
      views: {
        slotManagement: {
          Component: '@/components/admin/SlotManagementView#SlotManagementView',
          path: '/slots-management',
          meta: {
            title: 'Slot Management',
          },
        },
      },
    },
  },
  collections: [Users, Media, Services, Slots, Bookings, Diets],
  globals: [AboutPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: databaseURL,
      authToken: databaseAuthToken,
    },
    // Development uses schema push. Production schema changes are applied once
    // by the Vercel build migration before serverless functions start.
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
  plugins: [r2StoragePlugin()],
  // Payload runs onInit once when the server connects to the database. Keeping
  // the idempotent seed here makes every deployment self-initialising while
  // leaving any existing admin-edited content untouched.
  onInit: async (payload) => {
    await seedInitialData(payload)
  },
})
