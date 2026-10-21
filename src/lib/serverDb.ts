// src/lib/serverDb.ts
import fs from 'fs'
import path from 'path'

export interface DbShape {
  leads: any[]
  news: any[]
  cases: any[]
  lastViewed: string | null
  seededAt: string | null
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

const empty: DbShape = { leads: [], news: [], cases: [], lastViewed: null, seededAt: null }

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