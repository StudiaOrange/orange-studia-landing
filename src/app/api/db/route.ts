// src/app/api/db/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { readDb, writeDb, hashPassword, sanitizeUser, publicState } from '@/lib/serverDb'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  return NextResponse.json(publicState(readDb()), {
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
  if (!Array.isArray(db.users)) db.users = []

  switch (action) {
    case 'seed': {
      if (db.seededAt) break
      if (Array.isArray(payload?.leads) && payload.leads.length) db.leads = payload.leads
      if (Array.isArray(payload?.news) && payload.news.length) db.news = payload.news
      if (Array.isArray(payload?.cases) && payload.cases.length) db.cases = payload.cases
      db.seededAt = new Date().toISOString()
      break
    }

    /* ===== ЗАЯВКИ / НОВОСТИ / КЕЙСЫ ===== */
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

    /* ===== ПОЛЬЗОВАТЕЛИ / РЕГИСТРАЦИЯ ===== */
    case 'register':
    case 'registerUser':
    case 'addUser': {
      const email = String(payload.email || '').trim().toLowerCase()
      if (!email || !payload.password) {
        return NextResponse.json({ error: 'Заполните почту и пароль' }, { status: 400 })
      }
      if (db.users.some((u) => u.email === email)) {
        return NextResponse.json({ error: 'Пользователь с такой почтой уже существует' }, { status: 409 })
      }
      db.users.push({
        id: randomUUID(),
        email,
        passHash: hashPassword(String(payload.password)),
        name: payload.name || payload.fullName || '',
        phone: payload.phone || '',
        niche: payload.niche || '',
        balance: Number(payload.balance) || 0,
        blocked: false,
        createdAt: Date.now(),
      })
      break
    }

    case 'loginUser':
    case 'login': {
      const email = String(payload.email || '').trim().toLowerCase()
      const user = db.users.find((u) => u.email === email)
      if (!user || user.passHash !== hashPassword(String(payload.password || ''))) {
        return NextResponse.json({ error: 'Неверная почта или пароль' }, { status: 401 })
      }
      if (user.blocked) {
        return NextResponse.json({ error: 'Аккаунт заблокирован. Свяжитесь с поддержкой.' }, { status: 403 })
      }
      return NextResponse.json({ ok: true, user: sanitizeUser(user) })
    }

    case 'editUser': {
      db.users = db.users.map((u) => {
        if (u.id !== payload.id) return u
        const next = { ...u }
        if (payload.email !== undefined) next.email = String(payload.email).trim().toLowerCase()
        if (payload.name !== undefined) next.name = payload.name
        if (payload.phone !== undefined) next.phone = payload.phone
        if (payload.niche !== undefined) next.niche = payload.niche
        if (payload.balance !== undefined) next.balance = Number(payload.balance) || 0
        return next
      })
      break
    }

    case 'changeUserPassword': {
      if (!payload.password) return NextResponse.json({ error: 'Введите новый пароль' }, { status: 400 })
      db.users = db.users.map((u) =>
        u.id === payload.id ? { ...u, passHash: hashPassword(String(payload.password)) } : u,
      )
      break
    }

    case 'topUpUser': {
      const amount = Number(payload.amount) || 0
      if (!amount) return NextResponse.json({ error: 'Введите сумму пополнения' }, { status: 400 })
      db.users = db.users.map((u) =>
        u.id === payload.id ? { ...u, balance: (Number(u.balance) || 0) + amount } : u,
      )
      break
    }

    case 'toggleUserBlock': {
      db.users = db.users.map((u) => (u.id === payload.id ? { ...u, blocked: !u.blocked } : u))
      break
    }

    case 'deleteUser': {
      db.users = db.users.filter((u) => u.id !== payload.id)
      break
    }

    default:
      return NextResponse.json({ error: 'unknown action' }, { status: 400 })
  }

  writeDb(db)
  return NextResponse.json(publicState(db))
}