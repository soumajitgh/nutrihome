import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader, SiteFooter } from '@/components/site/design'
import { getAllServices } from '@/lib/services'
import { ConsultationBooking } from '@/components/services/ConsultationBooking'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Book a consultation | Nutrihome' }

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const [services, query] = await Promise.all([getAllServices(), searchParams])
  const options = services.map(({ id, title, slug, body }) => ({
    id,
    title,
    slug,
    body,
  }))
  return (
    <div className="nutri-site">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1440px] px-5 pt-10 pb-16 sm:px-7 sm:pt-16 sm:pb-24">
        <p className="eyebrow mb-6! text-[11px]!">LET’S MAKE TIME FOR YOU</p>
        <h1>Book a consultation.</h1>
        <p className="text-base">Choose your service, find a time, and share your details.</p>
        {options.length ? (
          <ConsultationBooking services={options} initialSlug={query.service} />
        ) : (
          <p>
            No consultations are currently available. <Link href="/services">Explore services</Link>
            .
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
