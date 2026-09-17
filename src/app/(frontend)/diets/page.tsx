import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader, SiteFooter } from '@/components/site/design'
import { getDiets } from '@/lib/diets'
import { DietCard } from '@/components/site/DietCard'

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
        <section className="services-hero section-pad max-w-[1440px]">
          <h1>
            Simple ideas for <em>everyday meals.</em>
          </h1>
          <p>Easy meal ideas, shopping tips, and practical ways to enjoy the food you eat.</p>
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
              {episodes.docs.map((episode, i) => (
                <DietCard key={episode.id} diet={episode} index={i} />
              ))}
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
