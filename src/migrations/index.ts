import * as migration_20260915_060053_initial_schema from './20260915_060053_initial_schema'
import * as migration_20260917_020705_optional_content_images from './20260917_020705_optional_content_images'

export const migrations = [
  {
    up: migration_20260915_060053_initial_schema.up,
    down: migration_20260915_060053_initial_schema.down,
    name: '20260915_060053_initial_schema',
  },
  {
    up: migration_20260917_020705_optional_content_images.up,
    down: migration_20260917_020705_optional_content_images.down,
    name: '20260917_020705_optional_content_images',
  },
]
