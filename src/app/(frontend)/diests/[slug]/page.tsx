import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteHeader, SiteFooter } from '@/components/site/design'
import { dietCategories, getDiet } from '@/lib/diets'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const episode = await getDiet((await params).slug)
  return {
    title: `${episode?.title || 'Episode not found'} | Nutrihome`,
    description: episode?.excerpt,
    alternates: { canonical: `/diests/${encodeURIComponent((await params).slug)}` },
  }
}

export default async function DietEpisode({ params }: Props) {
  const episode = await getDiet((await params).slug)
  if (!episode) notFound()
  const cover = typeof episode.cover === 'object' ? episode.cover : null
  const video = typeof episode.video === 'object' ? episode.video : null
  return (
    <div className="nutri-site">
      <SiteHeader />
      <main id="main" className="section-pad diet-episode">
        <Link href="/diets" className="eyebrow">
          ← Back to the food diary
        </Link>
        <article>
          <header>
            <p className="eyebrow">
              {dietCategories[episode.category]}
              {episode.duration ? ` · ${episode.duration} min` : ''}
            </p>
            <h1>{episode.title}</h1>
            <p className="diet-intro">{episode.excerpt}</p>
            <time dateTime={episode.publishedAt}>
              {new Date(episode.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
          </header>
          <div className="diet-player">
            {video?.url ? (
              <video
                controls
                playsInline
                preload="metadata"
                poster={cover?.url || undefined}
                aria-label={episode.title}
              >
                <source src={video.url} type={video.mimeType || 'video/mp4'} />
                Your browser does not support video. <a href={video.url}>Download the episode</a>.
              </video>
            ) : (
              cover?.url && (
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  width={1200}
                  height={675}
                  unoptimized
                  priority
                />
              )
            )}
          </div>
          <div className="rich-text-content diet-body">
            <RichText data={episode.body} />
          </div>
        </article>
        <div id="contact" className="diet-section-heading">
          <h2>Make it personal.</h2>
          <Link className="pill pill-dark" href="/book-a-consultation">
            Book a consultation ↗
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
