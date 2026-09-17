import type { Media } from '@/payload-types'

export function contentImage(media: Media | number | null | undefined) {
  if (media && typeof media === 'object' && media.url) {
    return { src: media.url, alt: media.alt }
  }
  return {
    src: '/brand/default-nutrition.svg',
    alt: 'Illustration of a plate with vegetables and fruit',
  }
}
