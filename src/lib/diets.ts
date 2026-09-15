import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dietCategories = {
  everyday: 'Everyday eating',
  kitchen: 'In the kitchen',
  wellbeing: 'Food & wellbeing',
}

export async function getDiets(page = 1) {
  const payload = await getPayload({ config })
  return payload.find({
    collection: 'diets',
    overrideAccess: false,
    depth: 1,
    sort: '-publishedAt',
    limit: 12,
    page,
  })
}

export const getDiet = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'diets',
    overrideAccess: false,
    depth: 1,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] || null
})
