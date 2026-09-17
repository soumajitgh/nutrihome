'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Service } from '@/payload-types'
import { BookingWidget } from './BookingWidget'

interface ServiceOption {
  id: number
  title: string
  slug: string
  body: Service['body']
}

export function ConsultationBooking({
  services,
  initialSlug,
}: {
  services: ServiceOption[]
  initialSlug?: string
}) {
  const [slug, setSlug] = useState(
    services.find((service) => service.slug === initialSlug)?.slug || services[0].slug,
  )
  const selected = services.find((service) => service.slug === slug) || services[0]
  return (
    <div
      className="mt-8 grid grid-cols-1 items-start gap-7 min-[701px]:mt-12 min-[701px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] min-[701px]:gap-14"
      id="contact"
    >
      <div className="min-w-0">
        <label className="mb-2.5 block text-sm" htmlFor="consultation-service">
          Choose your service
        </label>
        <select
          id="consultation-service"
          className="min-h-12 w-full rounded-lg border border-[#19332a44] bg-(--color-paper) p-2.5 font-[inherit] text-base text-(--color-forest)"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
        >
          {services.map((service) => (
            <option key={service.id} value={service.slug}>
              {service.title}
            </option>
          ))}
        </select>
        <h2 className="mt-8 text-[26px]!">{selected.title}</h2>
        <p>30-minute consultation</p>
        {selected.body && (
          <div className="relative mt-6 max-h-[260px] overflow-hidden pr-3 text-sm leading-7 text-[#536152]">
            <div className="[&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-forest)] [&_blockquote]:pl-4 [&_blockquote]:font-serif [&_blockquote]:italic [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-xl [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-serif [&_h3]:text-lg [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
              <RichText data={selected.body} />
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-cream)] via-[var(--color-cream)]/90 to-transparent"
              aria-hidden="true"
            />
          </div>
        )}
        <Link
          className="inline-block py-3 text-sm underline-offset-4 hover:underline"
          href={`/services/${selected.slug}`}
        >
          Read about this service →
        </Link>
      </div>
      <BookingWidget key={selected.id} service={selected} />
    </div>
  )
}
