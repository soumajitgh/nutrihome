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
          <Image src="/brand/nutrihome-logo.png" alt="Nutrihome" width={112} height={62} />
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
  const src = typeof portrait === 'object' && portrait?.url ? portrait.url : '/home/hero.png'
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
    <footer className="site-footer border-t border-[#19332a1f] bg-[#e4efbd59] px-5! py-10! sm:px-7! lg:py-14!">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-9 pb-10 md:grid-cols-[minmax(0,1.3fr)_auto] md:items-end lg:gap-16">
          <div>
            <Link className="inline-flex" href="/" aria-label="Nutrihome home">
              <Image src="/brand/nutrihome-logo.png" alt="Nutrihome" width={148} height={81} />
            </Link>
            <p className="mt-5 max-w-2xl font-serif text-[clamp(30px,4vw,58px)] leading-[1.02]! tracking-[-0.035em]">
              A little science. A lot of care.
              <br />
              <em>A healthier kind of everyday.</em>
            </p>
          </div>
          <Link className="pill pill-dark min-h-12 w-fit gap-8!" href="/book-a-consultation">
            Book a call <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-8 border-t border-[#19332a24] py-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          <nav aria-label="Footer navigation">
            <p className="eyebrow mb-4!">Explore</p>
            <div className="flex flex-col items-start gap-3 text-sm">
              <Link href="/about">About Bidisha</Link>
              <Link href="/services">Services</Link>
              <Link href="/diets">Food diary</Link>
            </div>
          </nav>
          <nav aria-label="Footer consultation links">
            <p className="eyebrow mb-4!">Start here</p>
            <div className="flex flex-col items-start gap-3 text-sm">
              <Link href="/book-a-consultation">Book a consultation</Link>
              <Link href="/#approach">Our approach</Link>
              <Link href="/#contact">Contact</Link>
            </div>
          </nav>
          <div className="sm:col-span-2 lg:col-span-1 lg:text-right">
            <p className="eyebrow mb-4! lg:justify-end">Practice</p>
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#19332a40] px-4 text-xs font-semibold"
              href="/admin"
            >
              <LockKeyhole size={14} aria-hidden="true" /> Admin login
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#19332a24] pt-6 text-[10px] tracking-[0.08em] uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Nutrihome</span>
          <span>Practical nutrition. Personal to you.</span>
          <a className="w-fit" href="#main">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
