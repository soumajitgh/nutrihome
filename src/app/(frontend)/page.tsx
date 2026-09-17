import { ArrowDown, ArrowUpRight, Leaf } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Contact, Flower, Portrait, Reveal, SiteFooter, SiteHeader } from '@/components/site/design'
import { getAboutContent } from '@/lib/about-content'
import { getFeaturedServices } from '@/lib/services'
import { contentImage } from '@/lib/content-image'
import { getDiets } from '@/lib/diets'
import { DietCard } from '@/components/site/DietCard'

export const dynamic = 'force-dynamic'

const foodImages = [
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=900&q=85',
]

export default async function HomePage() {
  const [about, services, diets] = await Promise.all([
    getAboutContent(),
    getFeaturedServices(),
    getDiets(),
  ])
  return (
    <div className="nutri-site">
      <SiteHeader />
      <main id="main">
        <section className="home-hero section-pad" aria-labelledby="hero-title">
          <Reveal className="hero-copy">
            <h1 id="hero-title">
              Feel good <br />
              about{' '}
              <em className="food-word">
                food.
                <svg viewBox="0 0 300 20" aria-hidden="true">
                  <path d="M4 13Q130-3 293 8M26 19Q140 6 270 15" />
                </svg>
              </em>
            </h1>
            <p className="hero-description">
              A healthier you, with room for the food you love. Personalised nutrition that makes
              everyday life feel a little better.
            </p>
            <div className="hero-actions">
              <Link className="pill pill-dark" href="/book-a-consultation">
                Book a call <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
              <Link className="text-link" href="/about">
                Meet Bidisha <span>↗</span>
              </Link>
            </div>
            <div className="hero-footnote">
              <span className="mini-leaf">
                <Leaf size={21} aria-hidden="true" />
              </span>
              <p>
                Rooted in science.
                <br />
                <strong>Built around real life.</strong>
              </p>
            </div>
          </Reveal>
          <Portrait about={about} />
          <a className="scroll-cue" href="#about-bidisha">
            <ArrowDown size={17} aria-hidden="true" /> Meet Bidisha
          </a>
        </section>
        <div className="values-ribbon max-[700px]:flex-nowrap! max-[700px]:justify-between! max-[700px]:gap-[7px]! max-[700px]:px-3! max-[700px]:py-3.5!">
          {['Real food', 'Small steps', 'More joy', 'Your kind of healthy'].map((value) => (
            <div
              className="ribbon-item max-[700px]:min-h-6! max-[700px]:shrink-0! max-[700px]:gap-[5px]!"
              key={value}
            >
              <span className="max-[700px]:text-[clamp(9px,2.75vw,12px)]! max-[700px]:leading-tight! max-[700px]:whitespace-nowrap!">
                {value}
              </span>
              <Flower className="max-[700px]:size-2.5!" />
            </div>
          ))}
        </div>
        <section className="hello-section section-pad" id="about-bidisha">
          <Reveal className="hello-photo">
            <Image
              src="/home/holding_fruits.png"
              alt={`${about.introduction.name} holding a colourful selection of fresh fruit and vegetables`}
              width={1122}
              height={1402}
              loading="lazy"
              sizes="(max-width: 700px) 100vw, 50vw"
            />
            <div className="photo-sticker">
              A full plate.
              <br />
              <em>A fuller life.</em>
            </div>
          </Reveal>
          <Reveal className="hello-copy">
            <p className="eyebrow">The person behind Nutrihome</p>
            <h2>
              Hi, I&apos;m
              <br />
              <em>{about.introduction.name.split(' ')[0]}.</em>
              <Flower />
            </h2>
            <p className="hello-role">{about.introduction.role}</p>
            <p>
              I believe good nutrition should feel like a helping hand. I bring clinical experience
              and a curious, compassionate approach to understanding you and your everyday life.
            </p>
            <p>
              We&apos;ll connect the science with the food on your plate, one achievable step at a
              time.
            </p>
            <Link className="pill pill-outline" href="/book-a-consultation">
              Book a call <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </Reveal>
        </section>
        <section className="services-section section-pad" id="services">
          <Reveal className="section-heading max-[700px]:flex! max-[700px]:items-end! max-[700px]:gap-3!">
            <div className="max-[700px]:min-w-0 max-[700px]:flex-1">
              <p className="eyebrow">Ways to work together</p>
              <h2 className="max-[700px]:text-[clamp(1.45rem,6vw,1.75rem)]!">
                A little guidance.
                <br />
                <em>A world of difference.</em>
              </h2>
            </div>
            <Link
              className="pill pill-dark section-view-all max-[700px]:min-h-[42px]! max-[700px]:gap-[9px]! max-[700px]:px-3! max-[700px]:py-2.5! max-[700px]:text-[10px]! max-[700px]:whitespace-nowrap!"
              href="/services"
            >
              View all services <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="service-grid">
            {services.length > 0
              ? services.slice(0, 3).map((service, i) => {
                  const imageUrl = contentImage(service.image).src

                  return (
                    <Reveal
                      className={`service-card service-color-${i % 3}`}
                      key={service.slug || service.id}
                      delay={i * 0.08}
                    >
                      <Link
                        href={`/book-a-consultation?service=${encodeURIComponent(service.slug)}`}
                        className="service-card-link"
                      >
                        <div className="service-image">
                          <Image
                            unoptimized
                            src={imageUrl}
                            alt={service.title}
                            width={900}
                            height={650}
                            loading="lazy"
                          />
                          <span className="service-number">0{i + 1}</span>
                          <span className="service-arrow">
                            <ArrowUpRight aria-hidden="true" />
                          </span>
                        </div>
                        <div className="service-copy">
                          <h3>{service.title}</h3>
                          <p>{service.description}</p>
                          <span className="service-book-button">
                            Book consultation <ArrowUpRight size={17} aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  )
                })
              : about.specialties.map((service, i) => (
                  <Reveal
                    className={`service-card service-color-${i % 3}`}
                    key={service.title}
                    delay={i * 0.08}
                  >
                    <Link href="/book-a-consultation" className="service-card-link">
                      <div className="service-image">
                        <Image
                          unoptimized
                          src={foodImages[i % 3]}
                          alt={service.title}
                          width={900}
                          height={650}
                          loading="lazy"
                        />
                        <span className="service-number">0{i + 1}</span>
                        <span className="service-arrow">
                          <ArrowUpRight aria-hidden="true" />
                        </span>
                      </div>
                      <div className="service-copy">
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <span className="service-bottom">
                          Let&apos;s find what works for you{' '}
                          <ArrowUpRight size={17} aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '36px',
            }}
          >
            <p className="services-note" style={{ margin: 0 }}>
              Not sure where to start?{' '}
              <Link href="/book-a-consultation">Let&apos;s work it out together ↗</Link>
            </p>
            <Link className="pill pill-dark" href="/book-a-consultation">
              Book a call <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>
        <section className="featured-diets section-pad" aria-labelledby="featured-diets-title">
          <Reveal className="section-heading max-[700px]:flex! max-[700px]:items-end! max-[700px]:gap-3!">
            <div className="max-[700px]:min-w-0 max-[700px]:flex-1">
              <p className="eyebrow">Featured diets</p>
              <h2
                className="max-[700px]:text-[clamp(1.45rem,6vw,1.75rem)]!"
                id="featured-diets-title"
              >
                Ideas for <em>everyday eating.</em>
              </h2>
            </div>
            <Link
              className="pill pill-dark section-view-all max-[700px]:min-h-[42px]! max-[700px]:gap-[9px]! max-[700px]:px-3! max-[700px]:py-2.5! max-[700px]:text-[10px]! max-[700px]:whitespace-nowrap!"
              href="/diets"
            >
              View all diets <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="featured-diets-grid">
            {diets.docs.slice(0, 3).map((diet, i) => (
              <Reveal key={diet.id} delay={i * 0.08}>
                <DietCard diet={diet} index={i} />
              </Reveal>
            ))}
          </div>
          {diets.docs.length === 0 && (
            <p>New meal ideas are coming soon. Visit the food diary for updates.</p>
          )}
        </section>
        <Contact contact={about.contact} />
      </main>
      <SiteFooter />
    </div>
  )
}
