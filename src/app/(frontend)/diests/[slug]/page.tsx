import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteHeader, SiteFooter } from '@/components/site/design'
import { dietCategories, getDiet } from '@/lib/diets'
import { contentImage, mediaImage } from '@/lib/content-image'
import { createPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const episode = await getDiet(slug)

  return createPageMetadata({
    title: episode?.title || 'Episode Not Found',
    description: episode?.excerpt,
    path: `/diets/${encodeURIComponent(slug)}`,
    image: mediaImage(episode?.cover),
    type: 'article',
  })
}

export default async function DietEpisode({ params }: Props) {
  const episode = await getDiet((await params).slug)
  if (!episode) notFound()
  const cover = contentImage(episode.cover)
  const video = typeof episode.video === 'object' ? episode.video : null
  return (
    <div className="nutri-site">
      <SiteHeader />
      <main
        id="main"
        className="service-reading-page diet-episode mx-auto max-w-[1100px] px-5 pt-5 pb-12 sm:px-7 sm:pt-8 sm:pb-20"
      >
        <Link
          href="/diets"
          className="detail-back mb-6 inline-flex min-h-11 items-center text-sm sm:mb-10"
        >
          ← Back to the food diary
        </Link>
        <article>
          <header className="service-intro">
            <Image
              src={cover.src}
              alt=""
              fill
              sizes="1100px"
              className="service-intro-image"
              priority
              unoptimized
            />
            <div className="service-intro-copy">
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
            </div>
          </header>
          {video?.url && (
            <div className="diet-player">
              <video
                controls
                playsInline
                preload="metadata"
                poster={cover.src}
                aria-label={episode.title}
              >
                <source src={video.url} type={video.mimeType || 'video/mp4'} />
                Your browser does not support video. <a href={video.url}>Download the episode</a>.
              </video>
            </div>
          )}
          <div className="rich-text-content service-reading-body">
            <RichText data={episode.body} />
          </div>
        </article>
        <div id="contact" className="diet-section-heading detail-footer">
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
