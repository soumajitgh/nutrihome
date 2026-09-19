import type { Metadata } from 'next'
import { ArrowUpRight, MapPin, Plus } from 'lucide-react'
import { Contact, Portrait, Reveal, SiteFooter, SiteHeader } from '@/components/site/design'
import { getAboutContent } from '@/lib/about-content'
import { mediaImage } from '@/lib/content-image'
import { createPageMetadata, ogImage } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutContent()

  return createPageMetadata({
    title: `About ${about.introduction.name}`,
    description:
      'Meet Bidisha Das, a clinical nutritionist and gut health expert specialising in practical, personalised nutrition care.',
    path: '/about',
    image: mediaImage(about.introduction.portrait) || ogImage,
  })
}

export default async function About() {
  const about = await getAboutContent()
  const { introduction, contact } = about
  return (
    <div className="nutri-site">
      <SiteHeader />
      <main id="main">
        <section className="about-hero section-pad">
          <Reveal className="about-hero-copy">
            <p className="eyebrow">{introduction.eyebrow}</p>
            <h1>
              About <em>{introduction.name.split(' ')[0]}.</em>
            </h1>
            <p className="about-role">{introduction.role}</p>
            <p>{introduction.summary}</p>
            <span className="location">
              <MapPin size={15} aria-hidden="true" />
              {introduction.location}
            </span>
            <a className="pill pill-dark" href="#contact">
              Get in touch <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </Reveal>
          <Portrait about={about} compact />
        </section>
        <section className="philosophy-section section-pad">
          <Reveal>
            <p className="eyebrow">My approach</p>
            <h2>
              Advice that fits <em>your life.</em>
            </h2>
          </Reveal>
          <Reveal>
            <p>{introduction.philosophy}</p>
            <div className="language-list">
              <span>Let&apos;s talk in</span>
              {about.languages.map((language) => (
                <span className="language-tag" key={language.name}>
                  {language.name}
                </span>
              ))}
            </div>
          </Reveal>
        </section>
        <section className="about-expertise section-pad" id="specialties">
          <Reveal className="mb-12 flex items-end justify-between gap-10 max-[700px]:mb-[30px] max-[700px]:block">
            <div>
              <p className="eyebrow">How I can help</p>
              <h2>
                How I can <em>help you.</em>
              </h2>
            </div>
            <p className="mb-[5px] max-w-[285px] text-[13px] opacity-80 max-[700px]:mt-5 max-[700px]:max-w-[380px]">
              Support with digestion, health conditions, and everyday eating habits.
            </p>
          </Reveal>
          <div className="expertise-grid">
            {about.specialties.map((specialty, i) => (
              <Reveal
                className={`expertise-card service-color-${i % 3}`}
                key={specialty.title}
                delay={i * 0.08}
              >
                <span className="eyebrow">0{i + 1} / Personalised care</span>
                <h3>{specialty.title}</h3>
                <p>{specialty.description}</p>
                <details>
                  <summary>
                    What I can help with <Plus size={17} aria-hidden="true" />
                  </summary>
                  <ul>
                    {specialty.areas.map((area) => (
                      <li key={area.name}>{area.name}</li>
                    ))}
                  </ul>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
        <section
          className="professional-section section-pad"
          id="experience"
          aria-labelledby="experience-heading"
        >
          <Reveal className="mb-12 flex items-end justify-between gap-10 max-[700px]:mb-[30px] max-[700px]:block">
            <div>
              <p className="eyebrow">Professional experience</p>
              <h2 id="experience-heading">
                My <em>experience.</em>
              </h2>
            </div>
            <p className="mb-[5px] max-w-[285px] text-[13px] opacity-80 max-[700px]:mt-5 max-[700px]:max-w-[380px]">
              I have worked with people in hospitals, online, and in one-to-one consultations.
            </p>
          </Reveal>
          <div className="professional-timeline">
            {about.experience.map((position, index) => (
              <Reveal key={`${position.organisation}-${position.startDate}`}>
                <article className="professional-position">
                  <div className="position-date">
                    <span className="position-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <span className="position-location">{position.location}</span>
                  </div>
                  <div className="position-content">
                    <h3>{position.role}</h3>
                    <p className="position-organisation">{position.organisation}</p>
                    <p>{position.summary}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="credentials-section section-pad" id="education">
          <Reveal className="credentials-intro">
            <p className="eyebrow">Qualifications</p>
            <h2>
              My <em>education.</em>
            </h2>
            <p>My training in food and nutrition helps me give you practical, informed advice.</p>
          </Reveal>
          <Reveal className="credentials-content">
            <p className="eyebrow">Education & credentials</p>
            {about.education.map((item) => (
              <div className="education-row" key={item.degree}>
                <div>
                  <h3>{item.degree}</h3>
                  <p>{item.institution}</p>
                </div>
                <span>{item.year}</span>
              </div>
            ))}
            <div className="certifications">
              {about.certifications?.map((item) => (
                <span key={item.title}>
                  {item.title} · {item.issuer}
                </span>
              ))}
            </div>
          </Reveal>
        </section>
        <Contact contact={contact} />
      </main>
      <SiteFooter />
    </div>
  )
}
