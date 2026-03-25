import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function initDb() {
  const sql = fs.readFileSync(path.join(__dirname, '../sql/init.sql'), 'utf-8');
  await pool.query(sql);
}
