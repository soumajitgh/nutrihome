import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteFooter, SiteHeader } from '@/components/site/design'
import { getServiceBySlug } from '@/lib/services'
import { contentImage, mediaImage } from '@/lib/content-image'
import { createPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'
interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  return createPageMetadata({
    title: service?.title || 'Service Not Found',
    description: service?.description,
    path: `/services/${encodeURIComponent(slug)}`,
    image: mediaImage(service?.image),
  })
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const service = await getServiceBySlug((await params).slug)
  if (!service) notFound()
  const image = contentImage(service.image)
  const bookingUrl = `/book-a-consultation?service=${encodeURIComponent(service.slug)}`
  return (
    <div className="nutri-site">
      <SiteHeader />
      <main
        id="main"
        className="service-reading-page mx-auto max-w-[1100px] px-5 pt-5 pb-12 sm:px-7 sm:pt-8 sm:pb-20"
      >
        <Link
          className="detail-back mb-6 inline-flex min-h-11 items-center gap-2 text-sm no-underline sm:mb-10"
          href="/services"
        >
          <ArrowLeft size={16} /> All services
        </Link>
        <article>
          <header className="service-intro">
            <Image
              src={image.src}
              alt=""
              fill
              sizes="1100px"
              className="service-intro-image"
              priority
              unoptimized
            />
            <div className="service-intro-copy">
              <p className="eyebrow">NUTRIHOME / SERVICES</p>
              <h1 className="mt-4 mb-5 wrap-anywhere">{service.title}</h1>
              <p className="text-base text-[#536152]">{service.description}</p>
              <p className="service-intro-meta">
                {service.duration} minute consultation · Personalised guidance
              </p>
              <Link className="pill pill-dark mt-6 min-h-12 gap-6!" href={bookingUrl}>
                Book now <ArrowUpRight size={18} />
              </Link>
            </div>
          </header>
          {service.body && (
            <div className="rich-text-content service-reading-body wrap-anywhere [&_img]:h-auto [&_img]:max-w-full">
              <RichText data={service.body} />
            </div>
          )}
          <footer
            className="detail-footer mt-10 flex flex-col items-start justify-between gap-6 border-t border-[#19332a33] py-7 sm:flex-row sm:items-center"
            id="contact"
          >
            <div>
              <h2 className="text-[28px]!">{service.title}</h2>
            </div>
            <Link className="pill pill-dark min-h-12 shrink-0 gap-6!" href={bookingUrl}>
              Book now <ArrowUpRight size={18} />
            </Link>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
