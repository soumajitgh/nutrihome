import { getPayload } from 'payload'
import config from './payload.config'
import { aboutPageSeedData } from './seed/aboutPageData'
import { seedInitialData } from './lib/seed'

// Apply the plain-language copy while preserving identity, images, credentials,
// contact details, and any additional work history entered in the CMS.
const payload = await getPayload({ config })
await seedInitialData(payload)
const current = await payload.findGlobal({ slug: 'about-page', depth: 0 })
const { introduction, contact } = aboutPageSeedData
const previousTitles = ['Gut & digestive health', 'Clinical nutrition', 'Personalised wellbeing']

await payload.updateGlobal({
  slug: 'about-page',
  data: {
    introduction: {
      ...introduction,
      ...current.introduction,
      eyebrow: introduction.eyebrow,
      role: introduction.role,
      summary: introduction.summary,
      philosophy: introduction.philosophy,
    },
    experience: (current.experience?.length
      ? current.experience
      : aboutPageSeedData.experience
    ).map((position) => ({
      ...position,
      summary:
        aboutPageSeedData.experience.find((seed) => seed.organisation === position.organisation)
          ?.summary ?? position.summary,
    })),
    specialties: (current.specialties?.length
      ? current.specialties
      : aboutPageSeedData.specialties
    ).map((specialty) => {
      const index = previousTitles.indexOf(specialty.title)
      const replacement =
        index >= 0
          ? aboutPageSeedData.specialties[index]
          : aboutPageSeedData.specialties.find((seed) => seed.title === specialty.title)
      return replacement ? { ...specialty, ...replacement } : specialty
    }),
    contact: {
      ...contact,
      ...current.contact,
      ctaHeading: contact.ctaHeading,
      ctaText: contact.ctaText,
    },
  },
})
payload.logger.info('Updated About page with plain-language copy.')
process.exit(0)
