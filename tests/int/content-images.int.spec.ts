import { describe, expect, it } from 'vitest'
import type { Field } from 'payload'
import type { Media } from '@/payload-types'
import { contentImage } from '@/lib/content-image'
import { Services } from '@/collections/Services'
import { Diets } from '@/collections/Diets'

function findField(fields: Field[], name: string): Field | undefined {
  for (const field of fields) {
    if ('name' in field && field.name === name) return field
    if ('fields' in field) {
      const match = findField(field.fields, name)
      if (match) return match
    }
  }
}

describe('Optional content images', () => {
  it.each([null, undefined, 123])('uses the local default for missing media: %s', (media) => {
    expect(contentImage(media).src).toBe('/brand/default-nutrition.svg')
  })

  it('uses the uploaded image and its description when present', () => {
    expect(contentImage({ url: '/media/lunch.jpg', alt: 'Lunch' } as Media)).toEqual({
      src: '/media/lunch.jpg',
      alt: 'Lunch',
    })
  })

  it('allows services and diets to be saved without an image', () => {
    const serviceImage = findField(Services.fields, 'image')
    const dietImage = findField(Diets.fields, 'cover')
    for (const field of [serviceImage, dietImage]) {
      expect(field?.type).toBe('upload')
      expect(field && 'required' in field ? field.required : false).toBeFalsy()
    }
  })
})
