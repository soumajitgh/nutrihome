import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteFooter, SiteHeader } from '@/components/site/design'
import { getServiceBySlug } from '@/lib/services'

export const dynamic = 'force-dynamic'
interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug((await params).slug)
  return {
    title: `${service?.title || 'Service Not Found'} | Nutrihome`,
    description: service?.description,
  }
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const service = await getServiceBySlug((await params).slug)
  if (!service) notFound()
  const image = typeof service.image === 'object' ? service.image : null
  const bookingUrl = `/book-a-consultation?service=${encodeURIComponent(service.slug)}`
  return (
    <div className="nutri-site">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1440px] px-5 pt-5 pb-12 sm:px-7 sm:pt-8 sm:pb-20">
        <Link
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm no-underline sm:mb-10"
          href="/services"
        >
          <ArrowLeft size={16} /> All services
        </Link>
        <article>
          <header>
            <p className="eyebrow">NUTRIHOME / SERVICES</p>
            <h1 className="mt-5 mb-6 text-[clamp(44px,6vw,76px)]! leading-[1.03]! wrap-anywhere">
              {service.title}
            </h1>
            <p className="text-lg text-[#536152] sm:text-xl">{service.description}</p>
            <Link className="pill pill-dark mt-6 min-h-12 gap-6!" href={bookingUrl}>
              Book now <ArrowUpRight size={18} />
            </Link>
          </header>
          {image?.url && (
            <div className="my-10 overflow-hidden rounded-xl">
              <Image
                src={image.url}
                alt={image.alt || service.title}
                width={1200}
                height={750}
                sizes="(max-width: 1440px) 100vw, 1384px"
                className="block h-auto w-full"
                priority
                unoptimized
              />
            </div>
          )}
          {service.body && (
            <div className="rich-text-content wrap-anywhere text-[17px]! sm:text-lg! [&_img]:h-auto [&_img]:max-w-full [&_h2]:text-4xl!">
              <RichText data={service.body} />
            </div>
          )}
          <footer
            className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-[#19332a33] py-7 sm:flex-row sm:items-center"
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
