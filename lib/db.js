// Due tabelle: "users" (email + password con hash, per il login) e
// "user_data" (un'unica riga JSONB per utente con tutto lo stato
// dell'app — stesso blob che prima viveva nel localStorage).
import { neon } from "@neondatabase/serverless";

let sqlClient = null;
function getSql() {
  if (!sqlClient) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED;
    if (!url) throw new Error("Nessuna variabile d'ambiente del database trovata (DATABASE_URL / POSTGRES_URL).");
    sqlClient = neon(url);
  }
  return sqlClient;
}

let tablesReady = null;
async function ensureTables() {
  if (!tablesReady) {
    const sql = getSql();
    tablesReady = Promise.all([
      sql`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`,
      sql`CREATE TABLE IF NOT EXISTS user_data (
        user_id TEXT PRIMARY KEY,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`,
    ]);
  }
  await tablesReady;
}

export async function getUserByEmail(email) {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`SELECT id, email, password_hash FROM users WHERE email = ${email}`;
  return rows[0] || null;
}

export async function createUser(id, email, passwordHash) {
  await ensureTables();
  const sql = getSql();
  await sql`INSERT INTO users (id, email, password_hash) VALUES (${id}, ${email}, ${passwordHash})`;
}

export async function getUserData(userId) {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`SELECT data FROM user_data WHERE user_id = ${userId}`;
  return rows[0] ? rows[0].data : null;
}

export async function setUserData(userId, data) {
  await ensureTables();
  const sql = getSql();
  await sql`
    INSERT INTO user_data (user_id, data, updated_at) VALUES (${userId}, ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `;
}
