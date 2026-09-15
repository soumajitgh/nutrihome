import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`services\` (
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
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_image_idx\` ON \`services\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`slots\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`start_time\` text NOT NULL,
  	\`end_time\` text NOT NULL,
  	\`service_id\` integer,
  	\`status\` text DEFAULT 'available' NOT NULL,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`slots_date_idx\` ON \`slots\` (\`date\`);`)
  await db.run(sql`CREATE INDEX \`slots_service_idx\` ON \`slots\` (\`service_id\`);`)
  await db.run(sql`CREATE INDEX \`slots_status_idx\` ON \`slots\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`slots_updated_at_idx\` ON \`slots\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`slots_created_at_idx\` ON \`slots\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`bookings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`client_name\` text NOT NULL,
  	\`client_email\` text NOT NULL,
  	\`client_phone\` text,
  	\`service_id\` integer NOT NULL,
  	\`slot_id\` integer NOT NULL,
  	\`booking_date\` text NOT NULL,
  	\`start_time\` text NOT NULL,
  	\`end_time\` text NOT NULL,
  	\`status\` text DEFAULT 'confirmed' NOT NULL,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`slot_id\`) REFERENCES \`slots\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`bookings_service_idx\` ON \`bookings\` (\`service_id\`);`)
  await db.run(sql`CREATE INDEX \`bookings_slot_idx\` ON \`bookings\` (\`slot_id\`);`)
  await db.run(sql`CREATE INDEX \`bookings_updated_at_idx\` ON \`bookings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`bookings_created_at_idx\` ON \`bookings\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`diets\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`cover_id\` integer,
  	\`video_id\` integer,
  	\`body\` text,
  	\`duration\` numeric,
  	\`category\` text DEFAULT 'everyday',
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`diets_slug_idx\` ON \`diets\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`diets_cover_idx\` ON \`diets\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`diets_video_idx\` ON \`diets\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`diets_updated_at_idx\` ON \`diets\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`diets_created_at_idx\` ON \`diets\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`diets__status_idx\` ON \`diets\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_diets_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_cover_id\` integer,
  	\`version_video_id\` integer,
  	\`version_body\` text,
  	\`version_duration\` numeric,
  	\`version_category\` text DEFAULT 'everyday',
  	\`version_published_at\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`diets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_diets_v_parent_idx\` ON \`_diets_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_diets_v_version_version_slug_idx\` ON \`_diets_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_diets_v_version_version_cover_idx\` ON \`_diets_v\` (\`version_cover_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_diets_v_version_version_video_idx\` ON \`_diets_v\` (\`version_video_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_diets_v_version_version_updated_at_idx\` ON \`_diets_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_diets_v_version_version_created_at_idx\` ON \`_diets_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_diets_v_version_version__status_idx\` ON \`_diets_v\` (\`version__status\`);`,
  )
  await db.run(sql`CREATE INDEX \`_diets_v_created_at_idx\` ON \`_diets_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_diets_v_updated_at_idx\` ON \`_diets_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_diets_v_latest_idx\` ON \`_diets_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`services_id\` integer,
  	\`slots_id\` integer,
  	\`bookings_id\` integer,
  	\`diets_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`slots_id\`) REFERENCES \`slots\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bookings_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`diets_id\`) REFERENCES \`diets\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_slots_id_idx\` ON \`payload_locked_documents_rels\` (\`slots_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_diets_id_idx\` ON \`payload_locked_documents_rels\` (\`diets_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`about_page_experience_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`detail\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_experience\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_page_experience_highlights_order_idx\` ON \`about_page_experience_highlights\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_page_experience_highlights_parent_id_idx\` ON \`about_page_experience_highlights\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`about_page_experience\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`organisation\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`location\` text NOT NULL,
  	\`start_date\` text NOT NULL,
  	\`end_date\` text NOT NULL,
  	\`summary\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_page_experience_order_idx\` ON \`about_page_experience\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_page_experience_parent_id_idx\` ON \`about_page_experience\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`about_page_specialties_areas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_specialties\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_page_specialties_areas_order_idx\` ON \`about_page_specialties_areas\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_page_specialties_areas_parent_id_idx\` ON \`about_page_specialties_areas\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`about_page_specialties\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_page_specialties_order_idx\` ON \`about_page_specialties\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_page_specialties_parent_id_idx\` ON \`about_page_specialties\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`about_page_education\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`institution\` text NOT NULL,
  	\`degree\` text NOT NULL,
  	\`year\` text NOT NULL,
  	\`result\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_page_education_order_idx\` ON \`about_page_education\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_page_education_parent_id_idx\` ON \`about_page_education\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`about_page_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`issuer\` text,
  	\`year\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_page_certifications_order_idx\` ON \`about_page_certifications\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_page_certifications_parent_id_idx\` ON \`about_page_certifications\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`about_page_languages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`proficiency\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_page_languages_order_idx\` ON \`about_page_languages\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_page_languages_parent_id_idx\` ON \`about_page_languages\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`about_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`introduction_eyebrow\` text NOT NULL,
  	\`introduction_name\` text NOT NULL,
  	\`introduction_role\` text NOT NULL,
  	\`introduction_location\` text NOT NULL,
  	\`introduction_summary\` text NOT NULL,
  	\`introduction_philosophy\` text NOT NULL,
  	\`introduction_portrait_id\` integer,
  	\`contact_email\` text NOT NULL,
  	\`contact_phone\` text NOT NULL,
  	\`contact_cta_label\` text NOT NULL,
  	\`contact_cta_heading\` text NOT NULL,
  	\`contact_cta_text\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`introduction_portrait_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_page_introduction_introduction_portrait_idx\` ON \`about_page\` (\`introduction_portrait_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`DROP TABLE \`slots\`;`)
  await db.run(sql`DROP TABLE \`bookings\`;`)
  await db.run(sql`DROP TABLE \`diets\`;`)
  await db.run(sql`DROP TABLE \`_diets_v\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`about_page_experience_highlights\`;`)
  await db.run(sql`DROP TABLE \`about_page_experience\`;`)
  await db.run(sql`DROP TABLE \`about_page_specialties_areas\`;`)
  await db.run(sql`DROP TABLE \`about_page_specialties\`;`)
  await db.run(sql`DROP TABLE \`about_page_education\`;`)
  await db.run(sql`DROP TABLE \`about_page_certifications\`;`)
  await db.run(sql`DROP TABLE \`about_page_languages\`;`)
  await db.run(sql`DROP TABLE \`about_page\`;`)
}
