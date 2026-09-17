import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`detail\` text NOT NULL,
  	\`body\` text NOT NULL,
  	\`image_id\` integer,
  	\`slug\` text NOT NULL,
  	\`duration\` numeric DEFAULT 30 NOT NULL,
  	\`price\` numeric,
  	\`featured_on_home\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 1,
  	\`status\` text DEFAULT 'published',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_services\`("id", "title", "description", "detail", "body", "image_id", "slug", "duration", "price", "featured_on_home", "order", "status", "updated_at", "created_at") SELECT "id", "title", "description", "detail", "body", "image_id", "slug", "duration", "price", "featured_on_home", "order", "status", "updated_at", "created_at" FROM \`services\`;`,
  )
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`ALTER TABLE \`__new_services\` RENAME TO \`services\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`services_image_idx\` ON \`services\` (\`image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`detail\` text NOT NULL,
  	\`duration\` numeric DEFAULT 30 NOT NULL,
  	\`price\` numeric,
  	\`image_id\` integer NOT NULL,
  	\`body\` text NOT NULL,
  	\`featured_on_home\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 1,
  	\`status\` text DEFAULT 'published',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_services\`("id", "title", "slug", "description", "detail", "duration", "price", "image_id", "body", "featured_on_home", "order", "status", "updated_at", "created_at") SELECT "id", "title", "slug", "description", "detail", "duration", "price", "image_id", "body", "featured_on_home", "order", "status", "updated_at", "created_at" FROM \`services\`;`,
  )
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`ALTER TABLE \`__new_services\` RENAME TO \`services\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_image_idx\` ON \`services\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
}
