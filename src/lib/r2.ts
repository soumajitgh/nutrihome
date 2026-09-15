import { s3Storage } from '@payloadcms/storage-s3'

export function r2StoragePlugin(env: Record<string, string | undefined> = process.env) {
  const keys = ['R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'] as const
  const configured = keys.filter((key) => Boolean(env[key]))
  if (configured.length > 0 && configured.length < keys.length) {
    throw new Error(
      `Incomplete R2 configuration. Missing: ${keys.filter((key) => !env[key]).join(', ')}`,
    )
  }
  return s3Storage({
    enabled: configured.length === keys.length,
    collections: { media: true },
    bucket: env.R2_BUCKET || '',
    config: {
      endpoint: env.R2_ENDPOINT,
      region: 'auto',
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: env.R2_SECRET_ACCESS_KEY || '',
      },
    },
  })
}
