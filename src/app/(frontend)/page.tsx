import { ArrowDown, ArrowUpRight, Heart, Leaf, Sprout } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Contact, Flower, Portrait, Reveal, SiteFooter, SiteHeader } from '@/components/site/design'
import { getAboutContent } from '@/lib/about-content'

export const dynamic = 'force-dynamic'

const foodImages = [
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=900&q=85',
]

export default async function HomePage() {
  const about = await getAboutContent()
  return (
    <div className="nutri-site">
      <SiteHeader />
      <main id="main">
        <section className="home-hero section-pad" aria-labelledby="hero-title">
          <Reveal className="hero-copy">
            <p className="eyebrow">
              <span className="tiny-sun" /> Nutrition for a life well lived
            </p>
            <h1 id="hero-title">
              Feel good{' '}
              <br />
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
              <Link className="pill pill-dark" href="#services">
                Find your balance <ArrowUpRight size={19} aria-hidden="true" />
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
          <a className="scroll-cue" href="#approach">
            <ArrowDown size={17} aria-hidden="true" /> A fresh perspective
          </a>
        </section>
        <div className="values-ribbon">
          <span>Real food</span>
          <Flower />
          <span>Small steps</span>
          <Flower />
          <span>More joy</span>
          <Flower />
          <span>Your kind of healthy</span>
          <Flower />
        </div>
        <section className="approach-section section-pad" id="approach">
          <Reveal className="approach-heading">
            <p className="eyebrow">A little less overwhelm. A lot more you.</p>
            <h2>
              Healthy doesn&apos;t have
              <br />
              to mean <em>complicated.</em>
            </h2>
            <p>
              Food is culture, comfort, connection. Let&apos;s make space for all of it, while
              finding what works for your health.
            </p>
          </Reveal>
          <div className="principles-grid">
            {[
              {
                icon: Sprout,
                title: 'Real life comes first',
                text: 'Your routines, your favourite meals, your starting point. That’s where we begin.',
              },
              {
                icon: Leaf,
                title: 'Small shifts. Big meaning.',
                text: 'Practical, manageable changes that you can carry into an ordinary Tuesday.',
              },
              {
                icon: Heart,
                title: 'Care without judgement',
                text: 'A place to ask questions, feel heard, and build confidence in your own choices.',
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className="principle">
                <span className="principle-icon">
                  <item.icon strokeWidth={1.4} aria-hidden="true" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="services-section section-pad" id="services">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">Ways to work together</p>
              <h2>
                A little guidance.
                <br />
                <em>A world of difference.</em>
              </h2>
            </div>
            <p>Thoughtful, personalised support for wherever you are in your health journey.</p>
          </Reveal>
          <div className="service-grid">
            {about.specialties.map((service, i) => (
              <Reveal
                className={`service-card service-color-${i % 3}`}
                key={service.title}
                delay={i * 0.08}
              >
                <a
                  href={`mailto:${about.contact.email}?subject=${encodeURIComponent(`Nutrition enquiry: ${service.title}`)}`}
                  className="service-card-link"
                >
                  <div className="service-image">
                    <Image
                      unoptimized
                      src={foodImages[i % 3]}
                      alt={
                        [
                          'Fresh ingredients for a balanced meal',
                          'A colourful bowl of nourishing food',
                          'Fresh vegetables ready to prepare',
                        ][i % 3]
                      }
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
                </a>
              </Reveal>
            ))}
          </div>
          <p className="services-note">
            Not sure where to start? <a href="#contact">Let&apos;s work it out together ↗</a>
          </p>
        </section>
        <section className="hello-section section-pad">
          <Reveal className="hello-photo">
            <Image
              unoptimized
              src={foodImages[0]}
              alt="A table filled with fresh, colourful everyday ingredients"
              width={1000}
              height={1000}
              loading="lazy"
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
            <Link className="pill pill-outline" href="/about">
              A little more about me <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </Reveal>
        </section>
        <section className="steps-section section-pad">
          <Reveal>
            <p className="eyebrow">A simple place to start</p>
            <h2>
              Your next chapter,
              <br />
              <em>one step at a time.</em>
            </h2>
          </Reveal>
          <div className="steps-grid">
            {[
              [
                'Let’s get to know you',
                'Share your story, your routines, and what you’d like support with.',
              ],
              [
                'Make a plan that fits',
                'Together, we turn your needs into clear, practical next steps.',
              ],
              [
                'Find your own rhythm',
                'Build confidence, notice what works, and adjust along the way.',
              ],
            ].map(([title, text], i) => (
              <Reveal className="step" key={title} delay={i * 0.08}>
                <span>
                  0{i + 1}
                  <ArrowUpRight aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </section>
        <Contact contact={about.contact} />
      </main>
      <SiteFooter />
    </div>
  )
}
