'use client'

import { ArrowUpRight, Leaf, Menu, X } from 'lucide-react'
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
          <Link href="/#services">Work with me</Link>
        </nav>
        <Link className="pill header-cta" href="#contact">
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
        <Link href="/#services" onClick={() => setOpen(false)}>
          Work with me <ArrowUpRight />
        </Link>
        <Link href="#contact" onClick={() => setOpen(false)}>
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
  const src = typeof portrait === 'object' && portrait?.url ? portrait.url : '/brand/hero.png'
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
          <a className="pill pill-dark" href={`mailto:${contact.email}`}>
            Start a conversation <ArrowUpRight size={19} aria-hidden="true" />
          </a>
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
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/" aria-label="Nutrihome home">
          <Image src="/brand/nutrihome-logo.png" alt="Nutrihome" width={128} height={70} />
        </Link>
        <p>
          A little science. A lot of care.
          <br />
          <em>A healthier kind of everyday.</em>
        </p>
        <Link href="/about">
          Meet Bidisha <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Nutrihome</span>
        <span>Practical nutrition. Personal to you.</span>
        <a href="#main">Back to top ↑</a>
      </div>
    </footer>
  )
}
