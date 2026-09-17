import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Diet } from '@/payload-types'
import { dietCategories } from '@/lib/diets'
import { contentImage } from '@/lib/content-image'

export function DietCard({ diet, index = 0 }: { diet: Diet; index?: number }) {
  const cover = contentImage(diet.cover)
  return (
    <Link
      className={`service-card diet-card service-color-${index % 3}`}
      href={`/diets/${diet.slug}`}
    >
      <div className="service-image diet-card-image">
        <Image src={cover.src} alt={cover.alt} width={640} height={240} unoptimized />
        <span className="service-arrow">
          <ArrowUpRight aria-hidden="true" />
        </span>
      </div>
      <div className="service-copy">
        <p className="eyebrow">{dietCategories[diet.category]}</p>
        <h3>{diet.title}</h3>
        <p>{diet.excerpt}</p>
        <span className="service-bottom">
          {diet.video ? 'Watch episode' : 'Read story'}{' '}
          <ArrowUpRight size={17} aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
