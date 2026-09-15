import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { DEFAULT_SERVICES, seedInitialData } from '@/lib/seed'

type SeedCollection = 'services' | 'media' | 'slots'
type SeedDoc = Record<string, unknown> & { id: number }

function createPayloadStub() {
  const stores: Record<SeedCollection, SeedDoc[]> = {
    services: [],
    media: [],
    slots: [],
  }
  let nextId = 1

  const payload = {
    logger: {
      info: vi.fn(),
      error: vi.fn(),
    },
    find: vi.fn(
      async ({
        collection,
        where,
        limit,
      }: {
        collection: SeedCollection
        where?: Record<string, unknown>
        limit?: number
      }) => {
        let docs = stores[collection]
        const slug = (where?.slug as { equals?: string } | undefined)?.equals
        if (slug) docs = docs.filter((doc) => doc.slug === slug)

        const mediaClauses = where?.or as Array<Record<string, { equals?: string }>> | undefined
        if (mediaClauses) {
          docs = docs.filter((doc) =>
            mediaClauses.some((clause) => {
              const [field, condition] = Object.entries(clause)[0]
              return doc[field] === condition.equals
            }),
          )
        }

        return {
          docs: docs.slice(0, limit ?? docs.length),
          totalDocs: docs.length,
        }
      },
    ),
    create: vi.fn(
      async ({
        collection,
        data,
        file,
      }: {
        collection: SeedCollection
        data: Record<string, unknown>
        file?: { name: string; mimetype: string; size: number }
      }) => {
        const doc = {
          id: nextId++,
          ...data,
          ...(file ? { filename: file.name, mimeType: file.mimetype, size: file.size } : {}),
        }
        stores[collection].push(doc)
        return doc
      },
    ),
  } as unknown as Payload

  return { payload, stores }
}

describe('default service seed', () => {
  it('creates the default services, media, and starter availability once', async () => {
    const { payload, stores } = createPayloadStub()

    const firstRun = await seedInitialData(payload)
    const secondRun = await seedInitialData(payload)

    expect(firstRun.createdServices).toEqual(DEFAULT_SERVICES.map(({ slug }) => slug))
    expect(firstRun.createdSlots).toBeGreaterThan(0)
    expect(secondRun).toBe(firstRun)
    expect(stores.services).toHaveLength(DEFAULT_SERVICES.length)
    expect(stores.services.every((service) => service.duration === 30)).toBe(true)
    expect(stores.media).toHaveLength(DEFAULT_SERVICES.length)
    expect(stores.slots.every((slot) => slot.status === 'available')).toBe(true)
    expect(
      stores.slots.every((slot) => {
        const [startHour, startMinute] = String(slot.startTime).split(':').map(Number)
        const [endHour, endMinute] = String(slot.endTime).split(':').map(Number)
        return endHour * 60 + endMinute - (startHour * 60 + startMinute) === 30
      }),
    ).toBe(true)
    expect(payload.create).toHaveBeenCalledTimes(
      DEFAULT_SERVICES.length * 2 + firstRun.createdSlots,
    )
  })

  it('does not replace an existing service', async () => {
    const { payload, stores } = createPayloadStub()
    stores.services.push({
      id: 999,
      slug: DEFAULT_SERVICES[0].slug,
      title: 'Edited in Payload',
    })

    const summary = await seedInitialData(payload)

    expect(summary.createdServices).toEqual(DEFAULT_SERVICES.slice(1).map(({ slug }) => slug))
    expect(stores.services.find((service) => service.id === 999)?.title).toBe('Edited in Payload')
  })
})
