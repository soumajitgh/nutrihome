'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookingWidget } from './BookingWidget'

interface ServiceOption {
  id: number
  title: string
  slug: string
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
        <Link className="inline-block py-3 text-sm" href={`/services/${selected.slug}`}>
          Read about this service →
        </Link>
      </div>
      <BookingWidget key={selected.id} service={selected} />
    </div>
  )
}
