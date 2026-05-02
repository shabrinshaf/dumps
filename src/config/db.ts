import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema'; // Sesuaikan path ke schema.ts kamu
import 'dotenv/config';

// 1. Buat koneksi mentah (Pool)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Hubungkan Pool ke Drizzle
const db = drizzle(pool, { schema });

// Opsional: Cek koneksi
pool
  .connect() // eslint-disable-next-line no-console
  .then(() => console.log('Database Connected (Drizzle Ready)')) // eslint-disable-next-line no-console
  .catch((err) => console.error('Database Connection error: ', err));

export default db; // Pastikan export-nya db, bukan pool
