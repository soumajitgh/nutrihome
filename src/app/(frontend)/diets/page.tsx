import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'
import { SiteHeader, SiteFooter } from '@/components/site/design'
import { dietCategories, getDiets } from '@/lib/diets'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Diets | Nutrihome',
  description:
    'A food diary for real life. Explore kitchen stories, everyday meals, and nutrition with Bidisha.',
}

export default async function DietsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const requestedPage = Number((await searchParams).page || 1)
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const episodes = await getDiets(page)
  return (
    <div className="nutri-site">
      <SiteHeader />
      <main id="main">
        <section className="services-hero section-pad">
          <p className="eyebrow">
            <span className="tiny-sun" /> The Nutrihome food diary
          </p>
          <h1>
            Good food.
            <br />
            <em>Real life.</em>
          </h1>
          <p>
            A seat at my table. Kitchen stories, everyday meals, and little moments that make eating
            well feel natural.
          </p>
        </section>
        <section className="section-pad diet-list" aria-label="Diet episodes">
          <div className="diet-section-heading">
            <h2>Fresh from the diary</h2>
            <span>{episodes.totalDocs} episodes</span>
          </div>
          {episodes.docs.length === 0 ? (
            <div className="diet-empty">
              <h3>{page > 1 ? 'No episodes on this page.' : 'Something good is cooking.'}</h3>
              <p>
                {page > 1
                  ? 'Explore the latest stories from the diary.'
                  : 'New food stories and kitchen moments will be here soon.'}
              </p>
              <Link className="pill pill-dark" href={page > 1 ? '/diets' : '/about'}>
                {page > 1 ? 'Latest episodes' : 'Meet Bidisha'} <ArrowUpRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="diet-grid">
              {episodes.docs.map((episode) => {
                const cover = typeof episode.cover === 'object' ? episode.cover : null
                return (
                  <Link className="diet-card" href={`/diests/${episode.slug}`} key={episode.id}>
                    <div className="diet-thumbnail">
                      {cover?.url && (
                        <Image
                          src={cover.url}
                          alt={cover.alt}
                          width={960}
                          height={540}
                          unoptimized
                        />
                      )}
                      <span className="diet-play">
                        <Play size={22} aria-hidden="true" />
                      </span>
                      {episode.duration && (
                        <span className="diet-duration">{episode.duration} min</span>
                      )}
                    </div>
                    <p className="eyebrow">{dietCategories[episode.category]}</p>
                    <h3>{episode.title}</h3>
                    <p>{episode.excerpt}</p>
                    <span className="service-bottom">
                      {episode.video ? 'Watch episode' : 'Read story'} <ArrowUpRight size={18} />
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
          <nav className="diet-pagination" aria-label="Episode pages">
            {episodes.hasPrevPage && (
              <Link className="pill" href={`/diets?page=${page - 1}`}>
                Previous
              </Link>
            )}
            {episodes.hasNextPage && (
              <Link className="pill" href={`/diets?page=${page + 1}`}>
                More episodes
              </Link>
            )}
          </nav>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
