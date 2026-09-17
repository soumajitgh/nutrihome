'use client'

import { ArrowUpRight, Leaf, LockKeyhole, Menu, X } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRef, useState, type ReactNode } from 'react'
import type { AboutContent } from '@/lib/about-content'

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduce ? undefined : { y: [24, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 })
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Nutrihome home" onClick={() => setOpen(false)}>
          <Image src="/brand/nutrihome-logo.webp" alt="Nutrihome" width={112} height={62} />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
            Home
          </Link>
          <Link href="/about" aria-current={pathname === '/about' ? 'page' : undefined}>
            About Bidisha
          </Link>
          <Link
            href="/services"
            aria-current={pathname?.startsWith('/services') ? 'page' : undefined}
          >
            Services
          </Link>
          <Link
            href="/diets"
            aria-current={
              pathname?.startsWith('/diets') || pathname?.startsWith('/diests') ? 'page' : undefined
            }
          >
            Diets
          </Link>
          <Link href="/#services">Work with me</Link>
        </nav>
        <Link className="pill header-cta" href="/book-a-consultation">
          Let&apos;s talk <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpen(false)
            document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus()
          }
        }}
      >
        <Link href="/" onClick={() => setOpen(false)}>
          Home <ArrowUpRight />
        </Link>
        <Link href="/about" onClick={() => setOpen(false)}>
          About Bidisha <ArrowUpRight />
        </Link>
        <Link href="/services" onClick={() => setOpen(false)}>
          Services <ArrowUpRight />
        </Link>
        <Link href="/diets" onClick={() => setOpen(false)}>
          Diets <ArrowUpRight />
        </Link>
        <Link href="/#services" onClick={() => setOpen(false)}>
          Work with me <ArrowUpRight />
        </Link>
        <Link href="/book-a-consultation" onClick={() => setOpen(false)}>
          Let&apos;s talk <ArrowUpRight />
        </Link>
      </nav>
      <motion.div className="reading-progress" style={{ scaleX: progress }} />
    </header>
  )
}

export function Flower({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g fill="currentColor">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx="50" cy="27" rx="13" ry="24" transform={`rotate(${i * 45} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="13" fill="var(--color-forest)" />
      <path
        d="M44 50c2 5 10 5 12 0"
        stroke="var(--color-sun)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Portrait({ about, compact = false }: { about: AboutContent; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-16, 16])
  const portrait = about.introduction.portrait
  const src = typeof portrait === 'object' && portrait?.url ? portrait.url : '/home/hero.webp'
  return (
    <div ref={ref} className={`portrait-composition ${compact ? 'portrait-compact' : ''}`}>
      <div className="portrait-orbit" aria-hidden="true" />
      <motion.div className="portrait-frame" style={{ y: reduce ? 0 : y }}>
        <Image
          src={src}
          alt={
            typeof portrait === 'object' && portrait?.alt ? portrait.alt : about.introduction.name
          }
          priority
          unoptimized={!src.startsWith('/')}
          sizes="(max-width: 700px) 85vw, 42vw"
          width={640}
          height={800}
        />
      </motion.div>
      <Flower className="portrait-flower" />
      <div className="portrait-note">
        <Leaf size={19} aria-hidden="true" />
        <span>
          Science-led.
          <br />
          <em>Made for you.</em>
        </span>
      </div>
      <div className="portrait-caption">
        <span>{about.introduction.name}</span>
        <span>Your nutrition partner ↗</span>
      </div>
    </div>
  )
}

export function Contact({ contact }: { contact: AboutContent['contact'] }) {
  return (
    <section className="contact-section section-pad" id="contact">
      <Reveal className="contact-inner">
        <div className="contact-art" aria-hidden="true">
          <Flower />
          <span>
            A little support.
            <br />A fresh start.
          </span>
        </div>
        <div>
          <p className="eyebrow">{contact.ctaLabel}</p>
          <h2>
            Good food.
            <br />
            Better days.
            <br />
            <em>Let&apos;s begin.</em>
          </h2>
          <p className="contact-copy">{contact.ctaText}</p>
          <Link className="pill pill-dark" href="/book-a-consultation">
            Book a call <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
          <a className="contact-email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <a className="contact-email" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
            {contact.phone}
          </a>
        </div>
      </Reveal>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#19332a1f] bg-[#e4efbd59] px-[6vw] pt-9 pb-[22px] max-[700px]:px-5 max-[700px]:pt-[26px] max-[700px]:pb-[18px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-[minmax(280px,1.5fr)_0.7fr_0.7fr_auto] items-start gap-[clamp(28px,4vw,64px)] pb-[30px] max-[900px]:grid-cols-2 max-[900px]:gap-x-8 max-[900px]:gap-y-6 max-[700px]:gap-x-5 max-[700px]:pb-[22px]">
          <div className="max-[900px]:col-span-2 max-[700px]:grid max-[700px]:grid-cols-[78px_1fr] max-[700px]:items-center max-[700px]:gap-[17px]">
            <Link href="/" aria-label="Nutrihome home">
              <Image
                className="h-auto w-[100px] object-contain max-[700px]:w-[78px]"
                src="/brand/nutrihome-logo.webp"
                alt="Nutrihome"
                width={112}
                height={61}
              />
            </Link>
            <p className="mt-[15px] max-w-[420px] font-serif text-[clamp(21px,2.2vw,31px)] leading-[1.08] tracking-[-0.025em] max-[700px]:mt-0 max-[700px]:text-lg">
              A little science. A lot of care.
              <br />
              <em>A healthier kind of everyday.</em>
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="eyebrow mb-[13px]!">Explore</p>
            <div className="flex flex-col items-start gap-[9px] text-xs [&_a:hover]:underline [&_a:hover]:underline-offset-4">
              <Link href="/about">About Bidisha</Link>
              <Link href="/services">Services</Link>
              <Link href="/diets">Food diary</Link>
            </div>
          </nav>
          <nav aria-label="Footer consultation links">
            <p className="eyebrow mb-[13px]!">Start here</p>
            <div className="flex flex-col items-start gap-[9px] text-xs [&_a:hover]:underline [&_a:hover]:underline-offset-4">
              <Link href="/book-a-consultation">Book a consultation</Link>
              <Link href="/#approach">Our approach</Link>
              <Link href="/#contact">Contact</Link>
            </div>
          </nav>
          <div className="flex flex-col items-end gap-3 max-[900px]:col-span-2 max-[900px]:flex-row max-[900px]:items-center max-[900px]:justify-between">
            <Link
              className="inline-flex min-h-[43px] w-fit items-center justify-center gap-4 rounded-full border border-transparent bg-[var(--color-forest)] px-[17px] py-2.5 text-[11px] font-semibold text-[var(--color-cream)] transition-[transform,background-color,box-shadow] duration-[250ms] hover:-translate-y-[3px] hover:bg-[#315442] hover:shadow-[0_6px_0_#19332a15] [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-[250ms] hover:[&_svg]:rotate-45 max-[700px]:min-h-10"
              href="/book-a-consultation"
            >
              Book a call <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex items-center gap-[7px] text-[10px] hover:underline hover:underline-offset-4"
              href="/admin"
            >
              <LockKeyhole size={13} aria-hidden="true" /> Admin login
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-[18px] border-t border-[#19332a25] pt-[18px] font-mono text-[8px] tracking-[0.05em] uppercase max-[700px]:grid-cols-[1fr_auto] max-[700px]:gap-x-4 max-[700px]:gap-y-[9px] max-[700px]:pt-[15px] max-[700px]:text-[7px]">
          <span>© {new Date().getFullYear()} Nutrihome</span>
          <span className="max-[700px]:hidden">Practical nutrition. Personal to you.</span>
          <a className="justify-self-end hover:underline hover:underline-offset-4" href="#main">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
