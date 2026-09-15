# Diets and media storage

Manage episodes at `/admin/collections/diets`. Add a title, slug, excerpt,
image cover, category, publication date and body. Optionally upload an MP4 or
WebM video and set its duration. Use the body for episode notes and a transcript.
Save drafts while editing; publish to make an episode publicly visible.

The listing is `/diets`, with episodes at `/diests/[slug]`. Both spellings also
work: `/diests` lists episodes and `/diets/[slug]` renders the same episode.
Episode metadata uses `/diests/[slug]` as the canonical URL.

## Connect Cloudflare R2

Create an R2 bucket and a bucket-scoped Object Read & Write API token in
Cloudflare. Set these server environment variables (never NEXT_PUBLIC variables):

```dotenv
R2_BUCKET=your-bucket-name
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
```

Restart the app after configuring them. All new Media uploads then use R2,
including episode covers and videos. The bucket can remain private; Payload
serves files through its media endpoint. Media itself is publicly readable,
so draft-only episode access does not make uploaded files private.

With all four variables empty, uploads use local storage. Partial configuration
fails with the names of the missing variables. Existing local files are not
migrated automatically: copy existing media objects to the bucket using their
exact filenames before switching an existing installation to R2.

Verify by uploading an image and a short video in the admin, checking the objects
in the bucket, and playing the published episode. Server-side video uploads must
fit the hosting platform's request size and timeout limits.

References: [Payload storage adapters](https://payloadcms.com/docs/upload/storage-adapters)
and [Cloudflare S3 setup](https://developers.cloudflare.com/r2/get-started/s3/).
