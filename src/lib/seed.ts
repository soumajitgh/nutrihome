import type { Payload } from 'payload'

import type { AppointmentTime } from './availability'

/**
 * Safe defaults for a new Nutrihome installation.
 *
 * The seeder only creates a record when its slug is missing. This means it is
 * safe to run on every deployment and never replaces content edited in the
 * Payload admin.
 */
export const DEFAULT_SERVICES = [
  {
    title: 'One-to-one nutrition',
    slug: 'one-to-one-nutrition',
    description:
      'Personalised, realistic guidance built around your health, your routines, and the food you actually enjoy.',
    detail: 'Personalised guidance · tailored action plan',
    duration: 30,
    imageFilename: 'nutrition-table.svg',
    imageAlt: 'One-to-one nutrition consultation table spread',
    imageColors: ['#19332a', '#b9d84c'],
    body: [
      'Our one-to-one nutrition consultations provide a compassionate, evidence-based space to explore your unique relationship with food, energy levels, and overall wellness.',
      'During our initial session, we will review your current lifestyle, dietary patterns, health history, and personal goals. Together, we will co-create a tailored action plan that fits naturally into your routine—no restrictive diets or calorie counting required.',
      'Whether you are managing digestive discomfort, seeking sustainable energy throughout the workday, or looking to nourish your body with joyful variety, Bidisha is here to guide you every step of the way.',
    ],
  },
  {
    title: 'Everyday meal planning',
    slug: 'everyday-meal-planning',
    description:
      'Simple, flexible meal ideas that remove the daily guesswork without rules, restriction, or complicated prep.',
    detail: 'Seasonal plans · practical shopping support',
    duration: 30,
    imageFilename: 'meal-planning.svg',
    imageAlt: 'Healthy plant-based meal bowl',
    imageColors: ['#536b45', '#ffd74f'],
    body: [
      'Take the mental load out of weeknight dinners and daily nourishment with a customised meal planning framework designed for real, busy lives.',
      'We focus on intuitive meal templates, pantry staples, seasonal produce, and adaptable grocery lists that make cooking at home a pleasurable, stress-free ritual.',
      'You will receive seasonal recipe ideas tailored to your kitchen preferences, batch cooking strategies, and practical shopping guides.',
    ],
  },
  {
    title: 'Workplace wellbeing',
    slug: 'workplace-wellbeing',
    description:
      'Engaging nutrition workshops and thoughtful wellness programmes created for modern teams and communities.',
    detail: 'Talks · workshops · bespoke programmes',
    duration: 30,
    imageFilename: 'workplace-wellbeing.svg',
    imageAlt: 'Fresh green vegetables for workplace wellness',
    imageColors: ['#315746', '#e4efbd'],
    body: [
      'Empower your team with vibrant, research-backed workplace wellbeing workshops and interactive nutrition seminars.',
      'Our corporate sessions cover desk-friendly lunches, sustained focus without the afternoon sugar crash, mindful eating under stress, and supporting overall vitality in modern workplace environments.',
      'Each programme is customisable for remote, hybrid, or in-person teams, complete with digital resource handouts and interactive Q&A.',
    ],
  },
] as const

export function createLexicalContent(paragraphs: readonly string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        children: [
          {
            mode: 'normal',
            text,
            type: 'text',
            style: '',
            detail: 0,
            format: 0,
            version: 1,
          },
        ],
        direction: 'ltr' as const,
      })),
      direction: 'ltr' as const,
    },
  }
}

function placeholderSvg(colors: readonly string[], title: string) {
  return Buffer.from(`
    <svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="800" fill="${colors[0]}" />
      <circle cx="600" cy="400" r="205" fill="${colors[1]}" />
      <text x="600" y="415" fill="${colors[0]}" font-family="Georgia,serif" font-size="34" text-anchor="middle">${title}</text>
    </svg>
  `)
}

async function getOrCreateMedia(
  payload: Payload,
  filename: string,
  alt: string,
  colors: readonly string[],
  title: string,
) {
  const found = await payload.find({
    collection: 'media',
    where: {
      or: [{ filename: { equals: filename } }, { alt: { equals: alt } }],
    },
    limit: 1,
    depth: 0,
  })
  if (found.docs[0]) return found.docs[0].id

  const data = placeholderSvg(colors, title)
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      name: filename,
      mimetype: 'image/svg+xml',
      size: data.length,
    },
  })
  return media.id
}

function nextWeekdayAppointments(): AppointmentTime[] {
  const appointments: AppointmentTime[] = []
  const today = new Date()
  for (let offset = 1; offset <= 14; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + offset)
    if (date.getDay() === 0 || date.getDay() === 6) continue
    const dateString = date.toISOString().slice(0, 10)
    for (const [startTime, endTime] of [
      ['10:00', '10:30'],
      ['11:30', '12:00'],
      ['14:00', '14:30'],
      ['16:00', '16:30'],
    ] as const) {
      appointments.push({ date: dateString, startTime, endTime })
    }
  }
  return appointments
}

export interface SeedSummary {
  createdServices: string[]
  createdSlots: number
}

async function runSeed(payload: Payload): Promise<SeedSummary> {
  const createdServices: string[] = []

  for (const [index, service] of DEFAULT_SERVICES.entries()) {
    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: service.slug } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) continue

    const image = await getOrCreateMedia(
      payload,
      service.imageFilename,
      service.imageAlt,
      service.imageColors,
      service.title,
    )
    await payload.create({
      collection: 'services',
      data: {
        title: service.title,
        slug: service.slug,
        description: service.description,
        detail: service.detail,
        duration: service.duration,
        image,
        featuredOnHome: true,
        order: index + 1,
        status: 'published',
        body: createLexicalContent(service.body),
      },
    })
    createdServices.push(service.slug)
  }

  let createdSlots = 0
  // Starter availability is only created for a brand-new database. Admins can
  // then replace it or add their own availability from Slot Management.
  if (createdServices.length > 0) {
    const existingSlots = await payload.find({ collection: 'slots', limit: 1, depth: 0 })
    if (existingSlots.totalDocs === 0) {
      for (const appointment of nextWeekdayAppointments()) {
        await payload.create({
          collection: 'slots',
          data: { ...appointment, status: 'available' },
        })
        createdSlots += 1
      }
    }
  }

  return { createdServices, createdSlots }
}

const seedRuns = new WeakMap<object, Promise<SeedSummary>>()

/** Run the default seed once per Payload instance. Safe to call at startup and from pages. */
export function seedInitialData(payload: Payload): Promise<SeedSummary> {
  const existingRun = seedRuns.get(payload)
  if (existingRun) return existingRun

  const run = runSeed(payload)
    .then((summary) => {
      if (summary.createdServices.length || summary.createdSlots) {
        payload.logger.info(
          `Seeded ${summary.createdServices.length} default service(s) and ${summary.createdSlots} starter slot(s).`,
        )
      }
      return summary
    })
    .catch((error: unknown) => {
      seedRuns.delete(payload)
      payload.logger.error(
        `Default seed failed: ${error instanceof Error ? error.message : String(error)}`,
      )
      throw error
    })

  seedRuns.set(payload, run)
  return run
}
