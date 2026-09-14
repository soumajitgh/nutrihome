import { getPayload } from 'payload'
import config from '@payload-config'
import type { AboutPage } from '@/payload-types'
import { aboutPageSeedData } from '@/seed/aboutPageData'

export type AboutContent = Omit<AboutPage, 'createdAt' | 'id' | 'updatedAt'>

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({ slug: 'about-page', depth: 1 })
    return {
      introduction: { ...aboutPageSeedData.introduction, ...page.introduction },
      experience: page.experience?.length ? page.experience : aboutPageSeedData.experience,
      specialties: page.specialties?.length ? page.specialties : aboutPageSeedData.specialties,
      education: page.education?.length ? page.education : aboutPageSeedData.education,
      certifications: page.certifications?.length
        ? page.certifications
        : aboutPageSeedData.certifications,
      languages: page.languages?.length ? page.languages : aboutPageSeedData.languages,
      contact: { ...aboutPageSeedData.contact, ...page.contact },
    }
  } catch {
    return aboutPageSeedData
  }
}
