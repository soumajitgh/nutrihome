import { ArrowDownRight, ArrowUpRight, Leaf } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'

const services = [
  {
    number: '01',
    title: 'One-to-one nutrition',
    description:
      'Personalised, realistic guidance built around your health, your routines, and the food you actually enjoy.',
    detail: '60-minute consultations · tailored action plan',
    image:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85',
    alt: 'A colourful spread of nourishing food on a table',
  },
  {
    number: '02',
    title: 'Everyday meal planning',
    description:
      'Simple, flexible meal ideas that remove the daily guesswork without rules, restriction, or complicated prep.',
    detail: 'Seasonal plans · practical shopping support',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85',
    alt: 'A vibrant plant-based bowl with fresh vegetables',
  },
  {
    number: '03',
    title: 'Workplace wellbeing',
    description:
      'Engaging nutrition workshops and thoughtful wellness programmes created for modern teams and communities.',
    detail: 'Talks · workshops · bespoke programmes',
    image:
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=85',
    alt: 'Fresh vegetables and ingredients prepared for a healthy meal',
  },
]

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p
    className={`font-mono text-[11px] font-medium uppercase tracking-[0.18em] ${light ? 'text-cream/80' : 'text-forest/80'}`}
  >
    {children}
  </p>
)

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1920px] overflow-hidden bg-cream text-forest">
      <header className="relative z-20 flex h-24 items-center justify-between border-b border-forest/70 bg-cream px-5 py-2 sm:px-8 lg:h-28 lg:px-16">
        <a className="flex h-full items-center py-1" href="#top" aria-label="Nutrihome home">
          <img
            className="h-[62px] w-auto max-w-[124px] object-contain sm:h-[72px] sm:max-w-[144px]"
            src="/brand/nutrihome-logo.png"
            alt="Nutrihome"
          />
        </a>
        <nav aria-label="Primary navigation" className="flex items-center gap-6 lg:gap-12">
          <a className="nav-link hidden sm:inline-flex" href="#about">
            About
          </a>
          <a className="nav-link hidden sm:inline-flex" href="#services">
            Services
          </a>
          <Button asChild size="sm" variant="sunny">
            <a href="#contact">Let&apos;s talk</a>
          </Button>
        </nav>
      </header>

      <main id="top">
        <section
          aria-labelledby="hero-title"
          className="relative flex min-h-[calc(100svh-6rem)] flex-col-reverse items-center gap-10 overflow-hidden bg-lime-soft px-5 py-16 md:grid md:grid-cols-2 md:px-10 lg:min-h-[calc(100svh-7rem)] lg:px-[6vw] lg:py-24"
        >
          <div className="relative w-full max-w-[620px] p-5 sm:p-9">
            <span className="absolute -top-[2%] -left-[4%] aspect-square w-[65%] rounded-full bg-sun" />
            <div className="relative h-[58svh] min-h-[450px] border border-forest bg-paper p-3 lg:h-[66vh] lg:min-h-[540px] lg:p-4">
              <img
                className="h-full w-full object-cover saturate-[.78]"
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=1400&q=85"
                alt="A friendly nutrition professional smiling in a bright room"
              />
            </div>
            <span className="absolute right-1 bottom-0 rotate-[-3deg] border border-forest bg-paper px-5 py-3 font-serif text-xl italic sm:-right-3 sm:text-3xl">
              Food should feel good
            </span>
          </div>

          <div className="relative z-10 max-w-[730px] md:px-5 lg:px-14">
            <Eyebrow>Nutrition for a life well lived</Eyebrow>
            <h1
              className="mt-6 max-w-[800px] font-serif text-[clamp(4.2rem,7.2vw,8.7rem)] leading-[0.86] font-medium tracking-[-0.065em]"
              id="hero-title"
            >
              Feel good about <em className="text-forest not-italic">food.</em>
            </h1>
            <p className="mt-9 max-w-[590px] text-lg leading-relaxed lg:text-xl">
              Clear, compassionate nutrition guidance that fits real life—so you can feel energised,
              confident, and at home in your choices.
            </p>
            <a
              className="mt-8 inline-flex items-center gap-10 border-b border-forest pb-2 font-mono text-xs uppercase tracking-[0.08em]"
              href="#services"
            >
              Explore services <ArrowDownRight aria-hidden="true" size={18} />
            </a>
          </div>

          <div className="absolute right-[4vw] -bottom-12 hidden size-44 rotate-6 flex-col items-center justify-center rounded-full bg-forest text-cream xl:flex">
            <Leaf className="mb-1 text-sun" size={54} strokeWidth={1.5} />
            <span className="font-mono text-[9px] uppercase tracking-wider">Evidence-led</span>
            <span className="font-mono text-[9px] uppercase tracking-wider">Human-first</span>
          </div>
        </section>

        <section
          className="grid border-y border-forest bg-paper md:grid-cols-[1.08fr_.92fr]"
          id="about"
          aria-labelledby="intro-title"
        >
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center sm:px-12 lg:px-[8vw] lg:py-40">
            <Eyebrow>A practical approach to better health</Eyebrow>
            <h2
              className="mt-6 font-serif text-[clamp(3.8rem,6vw,7rem)] leading-[0.92] font-medium tracking-[-0.06em]"
              id="intro-title"
            >
              Hi, I&apos;m <em className="text-lime-dark">Maya.</em>
            </h2>
            <p className="mt-4 font-serif text-xl italic sm:text-2xl">
              Registered Nutritionist &amp; Food-Lover
            </p>
            <div className="mt-9 max-w-[720px] space-y-5 leading-relaxed">
              <p>
                I help people step away from confusing food rules and build habits that feel
                nourishing, flexible, and genuinely sustainable.
              </p>
              <p>
                There is no perfect diet. Together, we&apos;ll make sense of the science and find an
                approach that works for your body, your culture, and your everyday life.
              </p>
            </div>
            <Button asChild className="mt-10" variant="soft">
              <a href="#contact">Get to know me</a>
            </Button>
          </div>

          <div className="relative min-h-[560px] border-t border-forest md:min-h-[760px] md:border-t-0 md:border-l">
            <img
              className="h-full w-full object-cover saturate-[.76]"
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=85"
              alt="A nutrition professional speaking with a client at a table"
            />
            <div className="absolute bottom-8 left-0 flex flex-col border border-l-0 border-forest bg-sun px-8 py-5 font-serif text-2xl leading-none sm:text-4xl">
              <span>Gentle guidance.</span>
              <span className="italic">Lasting change.</span>
            </div>
          </div>
        </section>

        <section
          className="bg-forest px-5 py-24 text-cream sm:px-10 lg:px-[5vw] lg:py-40"
          id="services"
        >
          <div className="mx-auto grid max-w-[1640px] items-end gap-10 lg:grid-cols-[1.35fr_.65fr] lg:gap-16">
            <div>
              <Eyebrow light>Ways to work together</Eyebrow>
              <h2 className="mt-7 max-w-[1100px] font-serif text-[clamp(3.8rem,6.2vw,7.7rem)] leading-[0.89] font-medium tracking-[-0.065em]">
                Support that meets you <em className="text-lime not-italic">where you are.</em>
              </h2>
            </div>
            <p className="max-w-[460px] leading-relaxed text-cream/85 lg:pb-2">
              No fads. No shame. Just warm, evidence-led support and small changes that add up to
              something meaningful.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-[1640px] gap-5 md:grid-cols-3 lg:mt-20">
            {services.map((service) => (
              <article
                className="group min-w-0 border border-cream bg-cream text-forest"
                key={service.number}
              >
                <div className="relative h-[300px] overflow-hidden lg:h-[370px]">
                  <img
                    className="h-full w-full object-cover saturate-[.82] transition-transform duration-500 group-hover:scale-[1.025]"
                    src={service.image}
                    alt={service.alt}
                  />
                  <span className="absolute top-4 right-4 flex size-14 items-center justify-center rounded-full border border-forest bg-sun font-mono text-xs lg:size-16">
                    {service.number}
                  </span>
                </div>
                <div className="p-7 lg:min-h-[320px] lg:p-9">
                  <h3 className="font-serif text-[clamp(2rem,2.7vw,3rem)] leading-none font-medium tracking-[-0.045em]">
                    {service.title}
                  </h3>
                  <p className="mt-6 leading-relaxed">{service.description}</p>
                  <small className="mt-10 block border-t border-forest/50 pt-4 font-mono text-[10px] uppercase tracking-[0.06em]">
                    {service.detail}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid min-h-[680px] bg-sun md:grid-cols-[.78fr_1.22fr]" id="contact">
          <div className="relative hidden overflow-hidden border-r border-forest md:block">
            <span className="absolute top-[18%] left-[12%] h-[290px] w-[250px] -rotate-12 rounded-[50%_45%_50%_46%] border-2 border-forest bg-sun shadow-[inset_-30px_-24px_0_rgba(185,216,76,.45)]" />
            <span className="absolute top-[5%] left-[44%] h-[230px] w-24 rotate-45 rounded-[90%_5%_90%_5%] bg-forest" />
            <span className="absolute right-[8%] bottom-[9%] h-[210px] w-[180px] rotate-[24deg] rounded-[50%_45%_50%_46%] border-2 border-forest bg-sun shadow-[inset_-24px_-20px_0_rgba(185,216,76,.45)]" />
            <span className="absolute bottom-[8%] left-[7%] h-[230px] w-24 -rotate-[58deg] rounded-[90%_5%_90%_5%] bg-forest" />
          </div>
          <div className="self-center px-6 py-24 sm:px-12 lg:px-[9vw]">
            <Eyebrow>Your next chapter can feel lighter</Eyebrow>
            <h2 className="mt-7 max-w-[920px] font-serif text-[clamp(3.8rem,6vw,7.3rem)] leading-[0.89] font-medium tracking-[-0.06em]">
              Let&apos;s make healthy eating feel <em className="not-italic">natural.</em>
            </h2>
            <p className="mt-8 max-w-[650px] text-lg leading-relaxed">
              Ready for a calmer, kinder relationship with food? Book a complimentary discovery chat
              and tell me what support would feel most useful.
            </p>
            <Button asChild className="mt-9" variant="dark">
              <a href="mailto:hello@example.com">
                Book a discovery chat <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="grid gap-8 bg-cream px-6 py-14 sm:px-10 md:grid-cols-3 md:items-end lg:px-16">
        <a className="block w-44" href="#top" aria-label="Nutrihome home">
          <img
            className="h-auto w-full object-contain"
            src="/brand/nutrihome-logo.png"
            alt="Nutrihome"
          />
        </a>
        <p className="font-mono text-[10px] uppercase tracking-wider">
          Practical nutrition for beautifully ordinary lives.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider md:text-right">
          © {new Date().getFullYear()} Nutrihome
        </p>
      </footer>
    </div>
  )
}
