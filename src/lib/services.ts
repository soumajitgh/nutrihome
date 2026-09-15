import { getPayload } from 'payload'
import config from '@payload-config'
import type { Service } from '@/payload-types'
import { seedInitialData } from './seed'

export async function getFeaturedServices(): Promise<Service[]> {
  try {
    const payload = await getPayload({ config })
    // Ensure initial seed if empty
    await seedInitialData(payload)

    const { docs } = await payload.find({
      collection: 'services',
      where: {
        and: [{ status: { equals: 'published' } }, { featuredOnHome: { equals: true } }],
      },
      sort: 'order',
      limit: 3,
      depth: 1,
    })

    if (docs.length > 0) {
      return docs
    }

    // Fallback: any published services up to 3
    const fallbackDocs = await payload.find({
      collection: 'services',
      where: {
        status: { equals: 'published' },
      },
      sort: 'order',
      limit: 3,
      depth: 1,
    })

    return fallbackDocs.docs
  } catch (error) {
    console.error('Failed to get featured services from Payload:', error)
    return []
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const payload = await getPayload({ config })
    await seedInitialData(payload)

    const { docs } = await payload.find({
      collection: 'services',
      where: {
        status: { equals: 'published' },
      },
      sort: 'order',
      limit: 50,
      depth: 1,
    })

    return docs
  } catch (error) {
    console.error('Failed to get all services from Payload:', error)
    return []
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const payload = await getPayload({ config })
    await seedInitialData(payload)
    const { docs } = await payload.find({
      collection: 'services',
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
      limit: 1,
      depth: 1,
    })

    return docs[0] || null
  } catch (error) {
    console.error(`Failed to get service with slug ${slug}:`, error)
    return null
  }
}
