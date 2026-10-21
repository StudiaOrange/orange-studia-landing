// src/app/api/db/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/serverDb'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  return NextResponse.json(readDb(), {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || !body.action) {
    return NextResponse.json({ error: 'no action' }, { status: 400 })
  }
  const { action, payload } = body
  const db = readDb()

  switch (action) {
    case 'seed': {
      // Одноразовое начальное наполнение (перенос из localStorage или демо-данные)
      if (db.seededAt) break
      if (Array.isArray(payload?.leads) && payload.leads.length) db.leads = payload.leads
      if (Array.isArray(payload?.news) && payload.news.length) db.news = payload.news
      if (Array.isArray(payload?.cases) && payload.cases.length) db.cases = payload.cases
      db.seededAt = new Date().toISOString()
      break
    }
    case 'addLead':
      db.leads.unshift(payload)
      break
    case 'updateLeadStatus':
      db.leads = db.leads.map((l) => (l.id === payload.id ? { ...l, status: payload.status } : l))
      break
    case 'deleteLead':
      db.leads = db.leads.filter((l) => l.id !== payload.id)
      break
    case 'addNews':
      db.news.unshift(payload)
      break
    case 'editNews':
      db.news = db.news.map((n) => (n.id === payload.id ? { ...n, ...payload } : n))
      break
    case 'deleteNews':
      db.news = db.news.filter((n) => n.id !== payload.id)
      break
    case 'addCase':
      db.cases.unshift(payload)
      break
    case 'editCase':
      db.cases = db.cases.map((c) => (c.id === payload.id ? { ...c, ...payload } : c))
      break
    case 'deleteCase':
      db.cases = db.cases.filter((c) => c.id !== payload.id)
      break
    case 'toggleCaseFeatured': {
      const c = db.cases.find((x) => x.id === payload.id)
      if (c) c.featured = !c.featured
      break
    }
    case 'markAllRead':
      db.lastViewed = new Date().toISOString()
      break
    default:
      return NextResponse.json({ error: 'unknown action' }, { status: 400 })
  }

  writeDb(db)
  return NextResponse.json(db)
}