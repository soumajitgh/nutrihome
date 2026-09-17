import type { Metadata } from 'next'

export const siteName = 'Nutrihome'
export const siteTitle = 'Nutrihome | Feel Good About Food'
export const siteDescription =
  'Personalised, practical nutrition support to help you feel confident and at home with food.'

export type SocialImageSource = {
  src: string
  alt?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
}

export const logoImage: SocialImageSource = {
  src: '/brand/nutrihome-logo.webp',
  alt: 'Nutrihome logo',
  width: 1010,
  height: 640,
  mimeType: 'image/webp',
}

export const ogImage: SocialImageSource = {
  src: '/brand/og-image.jpg',
  alt: 'Nutrihome personalised nutrition support with Bidisha Das',
  width: 1774,
  height: 887,
  mimeType: 'image/jpeg',
}

function getConfiguredSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  const candidate = configuredUrl || (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`

  try {
    return new URL(withProtocol).origin
  } catch {
    return 'http://localhost:3000'
  }
}

export const metadataBase = new URL(getConfiguredSiteUrl())

export function absoluteUrl(path: string) {
  return new URL(path, metadataBase).toString()
}

function isSocialImage(source: SocialImageSource | undefined): source is SocialImageSource {
  if (!source?.src) return false

  const mimeType = source.mimeType?.toLowerCase()
  if (mimeType === 'image/svg+xml') return false

  const pathname = source.src.split('?')[0].toLowerCase()
  return !pathname.endsWith('.svg') && !pathname.endsWith('.avif')
}

function resolveSocialImage(source?: SocialImageSource | null) {
  const selected = source && isSocialImage(source) ? source : ogImage

  return {
    url: absoluteUrl(selected.src),
    alt: selected.alt || `${siteName} image`,
    type: selected.mimeType || undefined,
    width: selected.width || undefined,
    height: selected.height || undefined,
  }
}

function formatPageTitle(title: string) {
  if (title === siteName || title === siteTitle) return siteTitle
  if (title.endsWith(`| ${siteName}`)) return title
  return `${title} | ${siteName}`
}

type PageMetadataOptions = {
  title: string
  description?: string | null
  path?: string
  image?: SocialImageSource | null
  type?: 'website' | 'article'
}

export function createPageMetadata({
  title,
  description = siteDescription,
  path = '/',
  image,
  type = 'website',
}: PageMetadataOptions): Metadata {
  const fullTitle = formatPageTitle(title)
  const resolvedDescription = description || siteDescription
  const url = absoluteUrl(path)
  const socialImage = resolveSocialImage(image)

  return {
    title: { absolute: fullTitle },
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      type,
      title: fullTitle,
      description: resolvedDescription,
      siteName,
      locale: 'en_IN',
      url,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: resolvedDescription,
      images: [socialImage],
    },
  }
}

export const baseMetadata: Metadata = {
  metadataBase,
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    title: siteTitle,
    description: siteDescription,
    siteName,
    locale: 'en_IN',
    url: absoluteUrl('/'),
    images: [resolveSocialImage(ogImage)],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [resolveSocialImage(ogImage)],
  },
}
