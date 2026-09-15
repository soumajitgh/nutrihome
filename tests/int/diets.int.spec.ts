import { describe, expect, it, vi } from 'vitest'
import type { Access, PayloadRequest } from 'payload'
import { Diets } from '../../src/collections/Diets'

vi.mock('@payloadcms/storage-s3', () => ({ s3Storage: vi.fn((options) => options) }))
import { r2StoragePlugin } from '../../src/lib/r2'

describe('Diet publishing permissions', () => {
  const anonymous = { req: { user: null } as PayloadRequest }
  const admin = { req: { user: { id: 1, collection: 'users' } } as PayloadRequest }
  it('only exposes published episodes to anonymous visitors', async () => {
    expect(await (Diets.access?.read as Access)(anonymous)).toEqual({
      _status: { equals: 'published' },
    })
    expect(await (Diets.access?.read as Access)(admin)).toBe(true)
  })
  it.each(['create', 'update', 'delete'] as const)(
    'requires authentication to %s',
    async (operation) => {
      expect(await (Diets.access?.[operation] as Access)(anonymous)).toBe(false)
      expect(await (Diets.access?.[operation] as Access)(admin)).toBe(true)
    },
  )
})

describe('R2 configuration', () => {
  it('keeps local uploads available without credentials', () => {
    expect(r2StoragePlugin({})).toMatchObject({ enabled: false })
  })
  it('rejects partially configured storage instead of silently storing locally', () => {
    expect(() => r2StoragePlugin({ R2_BUCKET: 'media' })).toThrow(
      'Missing: R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY',
    )
  })
  it('configures the R2 endpoint and preserves Payload media access', () => {
    expect(
      r2StoragePlugin({
        R2_BUCKET: 'media',
        R2_ENDPOINT: 'https://example.r2.cloudflarestorage.com',
        R2_ACCESS_KEY_ID: 'test',
        R2_SECRET_ACCESS_KEY: 'test-secret',
      }),
    ).toMatchObject({
      enabled: true,
      collections: { media: true },
      config: { region: 'auto', forcePathStyle: true },
    })
  })
})
