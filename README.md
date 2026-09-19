# Nutrihome

Portfolio and consultation-booking website built with Next.js and Payload CMS.

## Local development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000). The Payload admin panel is available at
[localhost:3000/admin](http://localhost:3000/admin).

Local development uses SQLite by default. Set the values documented in `.env.example` to use
Turso, send booking emails with Resend, or store media in Cloudflare R2.

## Commands

```bash
pnpm dev             # Start the development server
pnpm lint            # Run ESLint
pnpm test:int        # Run integration tests
pnpm test:e2e        # Run end-to-end tests
pnpm build           # Create a production build
pnpm generate:types  # Regenerate Payload types
```
