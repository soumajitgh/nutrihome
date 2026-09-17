import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal, SiteFooter, SiteHeader } from '@/components/site/design'
import { getAllServices } from '@/lib/services'
import { contentImage, mediaImage } from '@/lib/content-image'
import { createPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const services = await getAllServices()

  return createPageMetadata({
    title: 'Services & Consultations',
    description:
      'Explore our personalised nutrition consultations, meal planning guides, and workplace wellness sessions.',
    path: '/services',
    image: services[0] ? mediaImage(services[0].image) : null,
  })
}

export default async function ServicesPage() {
  const services = await getAllServices()

  return (
    <div className="nutri-site">
      <SiteHeader />
      <main id="main">
        {/* Hero Section */}
        <section className="services-hero section-pad max-w-[1440px]">
          <Reveal>
            <h1>
              Support shaped <br />
              around <em>your life.</em>
            </h1>
            <p>
              Whether you are looking for dedicated one-to-one clinical guidance, everyday meal
              planning, or workplace wellbeing workshops, explore our sessions below and book your
              preferred time slot directly.
            </p>
          </Reveal>
        </section>

        {/* Services Listing Grid */}
        <section className="section-pad" style={{ paddingTop: 0, paddingBottom: 100 }}>
          <div
            className="service-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))' }}
          >
            {services.map((service, index) => {
              const imageUrl = contentImage(service.image).src

              return (
                <Reveal
                  key={service.slug || service.id}
                  delay={index * 0.08}
                  className={`service-card service-color-${index % 3}`}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="service-card-link"
                    style={{ height: '100%' }}
                  >
                    <div className="service-image">
                      <Image
                        unoptimized
                        src={imageUrl}
                        alt={service.title}
                        width={900}
                        height={600}
                        loading="lazy"
                      />
                      <span className="service-number">0{index + 1}</span>
                      <span className="service-arrow">
                        <ArrowUpRight aria-hidden="true" />
                      </span>
                    </div>
                    <div
                      className="service-copy"
                      style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
                    >
                      <h3>{service.title}</h3>
                      <p style={{ minHeight: '60px' }}>{service.description}</p>

                      <span
                        className="service-bottom"
                        style={{ marginTop: 'auto', paddingTop: '18px' }}
                      >
                        Read more <ArrowUpRight size={17} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                  <Link
                    className="service-book-button"
                    href={`/book-a-consultation?service=${encodeURIComponent(service.slug)}`}
                  >
                    Book consultation <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                </Reveal>
              )
            })}
          </div>

          {/* Bottom Note */}
          <div
            style={{
              marginTop: '60px',
              padding: '36px',
              border: '1px solid var(--color-forest)',
              background: 'var(--color-paper)',
              borderRadius: '4px',
              boxShadow: '4px 4px 0 var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <p className="eyebrow" style={{ marginBottom: '8px' }}>
                Questions about our offerings?
              </p>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', margin: 0 }}>
                Need a bespoke plan or corporate enquiry?
              </h3>
            </div>
            <Link className="pill pill-dark" href="/#contact">
              Get in touch <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
