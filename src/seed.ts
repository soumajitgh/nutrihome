import { getPayload } from 'payload'

import config from './payload.config'
import { seedInitialData } from './lib/seed'
import { aboutPageSeedData } from './seed/aboutPageData'

const payload = await getPayload({ config })

await seedInitialData(payload)

await payload.updateGlobal({
  slug: 'about-page',
  data: aboutPageSeedData,
})

payload.logger.info('Seeded the About Page from Bidisha’s September 2026 résumé.')

process.exit(0)
