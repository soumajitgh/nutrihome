import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dietCategories = {
  everyday: 'Everyday eating',
  kitchen: 'In the kitchen',
  wellbeing: 'Food & wellbeing',
}

export const getDiets = cache(async (page = 1) => {
  try {
    const payload = await getPayload({ config })
    return await payload.find({
      collection: 'diets',
      overrideAccess: false,
      depth: 1,
      sort: '-publishedAt',
      limit: 12,
      page,
    })
  } catch (error) {
    console.error('Failed to load diet episodes:', error)
    return {
      docs: [],
      totalDocs: 0,
      limit: 12,
      totalPages: 0,
      page,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }
})

export const getDiet = cache(async (slug: string) => {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'diets',
      overrideAccess: false,
      depth: 1,
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return docs[0] || null
  } catch (error) {
    console.error(`Failed to load diet episode ${slug}:`, error)
    return null
  }
})
