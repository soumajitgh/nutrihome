import { getPayload } from 'payload'

import config from './payload.config'
import { seedInitialData } from './lib/seed'

const payload = await getPayload({ config })
const summary = await seedInitialData(payload)

payload.logger.info(
  `Service seed complete: ${summary.createdServices.length} service(s), ${summary.createdSlots} starter slot(s).`,
)

await payload.destroy()
