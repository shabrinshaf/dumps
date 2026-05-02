import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'), // Boleh kosong kalau login pakai Google
  googleId: text('google_id').unique(), // Untuk menyimpan ID unik dari Google
  githubId: text('github_id').unique(), // Untuk menyimpan ID unik dari GitHub
  avatar: text('avatar'), // Untuk menyimpan foto profil Google
  createdAt: timestamp('created_at').defaultNow(),
});
