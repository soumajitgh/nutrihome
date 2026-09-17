import type { Media } from '@/payload-types'

export type ContentImage = {
  src: string
  alt: string
  width?: number | null
  height?: number | null
  mimeType?: string | null
}

export function mediaImage(media: Media | number | null | undefined): ContentImage | null {
  if (media && typeof media === 'object' && media.url) {
    return {
      src: media.url,
      alt: media.alt,
      width: media.width,
      height: media.height,
      mimeType: media.mimeType,
    }
  }

  return null
}

export function contentImage(media: Media | number | null | undefined) {
  return mediaImage(media) || {
    src: '/brand/default-nutrition.svg',
    alt: 'Illustration of a plate with vegetables and fruit',
    width: 1200,
    height: 600,
    mimeType: 'image/svg+xml',
  }
}
