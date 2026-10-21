// src/lib/serverDb.ts
import fs from 'fs'
import path from 'path'
import { createHash } from 'crypto'

export interface DbShape {
  leads: any[]
  news: any[]
  cases: any[]
  users: any[]
  lastViewed: string | null
  seededAt: string | null
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

const empty: DbShape = { leads: [], news: [], cases: [], users: [], lastViewed: null, seededAt: null }

export function readDb(): DbShape {
  try {
    if (!fs.existsSync(DB_FILE)) return { ...empty }
    const raw = fs.readFileSync(DB_FILE, 'utf-8')
    return { ...empty, ...JSON.parse(raw) }
  } catch {
    return { ...empty }
  }
}

export function writeDb(db: DbShape) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8')
}

/* Хеш пароля: в базе не хранится открытый текст */
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

/* Убираем хеш пароля из ответов клиенту */
export function sanitizeUser(u: any) {
  if (!u) return u
  const { passHash, ...rest } = u
  return rest
}

export function publicState(db: DbShape) {
  return { ...db, users: (db.users || []).map(sanitizeUser) }
}