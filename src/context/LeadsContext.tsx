// src/context/LeadsContext.tsx
'use client'
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

export type LeadSource = 'hero' | 'modal' | 'contact' | 'register'

export interface Lead {
  id: string
  source: LeadSource
  data: Record<string, string>
  createdAt: number
  status: 'new' | 'processing' | 'closed'
}

export interface NewsItem {
  id: string
  title: string
  excerpt: string
  content?: string
  date: string
  author?: string
  image?: string
}

export interface CaseMetric {
  value: string
  label: string
}

export interface Case {
  id: string
  niche: string
  title: string
  siteName: string
  siteUrl?: string
  city: string
  before: string
  after: string
  metrics: CaseMetric[]
  featured: boolean
  createdAt: number
}

export interface DailyStat {
  date: string
  leads: number
}

interface LeadsContextValue {
  leads: Lead[]
  news: NewsItem[]
  cases: Case[]
  unread: number
  dailyStats: DailyStat[]
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void
  updateLeadStatus: (id: string, status: Lead['status']) => void
  deleteLead: (id: string) => void
  addNews: (n: Omit<NewsItem, 'id'>) => void
  editNews: (id: string, updates: Partial<Omit<NewsItem, 'id'>>) => void
  deleteNews: (id: string) => void
  addCase: (c: Omit<Case, 'id' | 'createdAt'>) => void
  editCase: (id: string, updates: Partial<Omit<Case, 'id' | 'createdAt'>>) => void
  deleteCase: (id: string) => void
  toggleCaseFeatured: (id: string) => void
  markAllRead: () => void
}

const LeadsContext = createContext<LeadsContextValue | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

/* Старые ключи localStorage (для одноразового переноса данных на сервер) */
const LEADS_KEY = 'orange_studia_leads_v2'
const NEWS_KEY = 'orange_studia_news_v2'
const CASES_KEY = 'orange_studia_cases_v2'

const MAX_FEATURED = 4

/* ===== Демо-новости ===== */
const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Запустили платформу Cash-Boom 2.0',
    excerpt: 'Обновили личный кабинет: добавили запись звонков, расширенную аналитику по каналам и кнопку отбраковки лидов в один клик.',
    content: 'Мы полностью переработали платформу Cash-Boom.\n\nТеперь партнеры видят каждую заявку в реальном времени, слушают записи разговоров и могут отбраковывать нецелевые обращения одним кликом.\n\nЧто нового:\n- Запись всех звонков\n- Аналитика по каналам\n- Отбраковка лидов в один клик',
    date: '2026-10-15',
    author: 'Команда Orange Studia',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },
  {
    id: 'n2',
    title: 'Новый кейс: скупка техники, 145 заявок за месяц',
    excerpt: 'Партнер из Перми получил 145 целевых заявок по 450 ₽ и выкупил техники более чем на 800 000 ₽.',
    content: 'Кейс Noutbukoff в Перми.\n\nСтарый сайт не конвертировал, заявки не шли. За первый месяц — 145 заявок по 450 ₽.',
    date: '2026-10-10',
    author: 'Маркетинг',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
  },
  {
    id: 'n3',
    title: 'Расширили географию: теперь работаем по всей России',
    excerpt: 'С октября подключаем партнеров из любого города РФ — удаленно и по договору.',
    date: '2026-10-05',
    author: 'Команда Orange Studia',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80',
  },
  {
    id: 'n4',
    title: 'Добавили Telegram и Max в каналы трафика',
    excerpt: 'Теперь калькулятор считает стоимость лида по 4 каналам: Директ, ВК, Telegram и Max.',
    date: '2026-09-28',
    author: 'Продукт',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
  },
]

/* ===== Демо-кейсы ===== */
const DEFAULT_CASES: Case[] = [
  {
    id: 'c1',
    niche: 'Скупка техники',
    title: 'Noutbukoff — 145 заявок за первый месяц',
    siteName: 'Noutbukoff',
    siteUrl: 'https://noutbukoff.ru',
    city: 'Пермь',
    before: 'Старый сайт не конвертировал, заявки не шли, бюджет на рекламу сливался впустую. Средняя цена заявки была больше 3000 ₽.',
    after: 'Собрали новый лендинг, настроили Яндекс.Директ, подключили Cash-Boom. 145 заявок за месяц по 450 ₽, выкуп техники на 800 000 ₽.',
    metrics: [
      { value: '145', label: 'заявок/мес' },
      { value: '450 ₽', label: 'цена лида' },
      { value: '800К ₽', label: 'выкуплено' },
    ],
    featured: true,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'c2',
    niche: 'Ремонт квартир',
    title: 'RemontPro — 67 заявок и 5 контрактов на 8,5 млн',
    siteName: 'RemontPro',
    siteUrl: 'https://remontpro.ru',
    city: 'Москва',
    before: 'Старый сайт сливал 60 000 ₽ бюджета в месяц без единой заявки. Конверсия 0,3%.',
    after: 'Пересобрали сайт с нуля, подключили аналитику. 67 заявок за месяц, 5 подписанных контрактов на общую сумму 8,5 млн ₽.',
    metrics: [
      { value: '67', label: 'заявок/мес' },
      { value: '5', label: 'контрактов' },
      { value: '8,5 млн', label: 'сумма' },
    ],
    featured: true,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'c3',
    niche: 'Клининг',
    title: 'CleanCity — 210 заявок и 14 корпоративных договоров',
    siteName: 'CleanCity',
    siteUrl: 'https://cleancity.ru',
    city: 'Екатеринбург',
    before: 'Клиенты приходили только по сарафанке, онлайн-каналы не работали. Заявок хватало только на загрузку 30% команды.',
    after: 'Запустили сайт, настроили рекламу в 3 каналах. За квартал — 210 заявок, 14 корпоративных договоров на абонентское обслуживание.',
    metrics: [
      { value: '210', label: 'заявок/квартал' },
      { value: '14', label: 'договоров' },
      { value: '70%', label: 'загрузка' },
    ],
    featured: true,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'c4',
    niche: 'Строительство домов',
    title: 'DomStroy16 — 5 контрактов на 12 млн за квартал',
    siteName: 'DomStroy16',
    siteUrl: 'https://domstroy16.ru',
    city: 'Казань',
    before: 'Сайт из 2018 года, без мобильной версии. Заявки приходили случайно, не было системы привлечения клиентов.',
    after: 'Новый сайт с квизом, настройка Директа и ВК. 5 заключённых договоров на строительство домов суммарно 12 млн ₽ за квартал.',
    metrics: [
      { value: '5', label: 'контрактов' },
      { value: '12 млн', label: 'сумма' },
      { value: '3 мес', label: 'срок' },
    ],
    featured: true,
    createdAt: Date.now() - 75 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'c5',
    niche: 'Окна ПВХ',
    title: 'OknaServis — 83 заявки за 2 месяца',
    siteName: 'OknaServis',
    city: 'Челябинск',
    before: 'Реклама работала только в сезон, в межсезонье заявок почти не было.',
    after: 'Настроили круглогодичную рекламу через Telegram и Директ. 83 заявки за 2 месяца, выровняли загрузку бригады.',
    metrics: [
      { value: '83', label: 'заявки' },
      { value: '2 мес', label: 'срок' },
      { value: '380 ₽', label: 'средний CPL' },
    ],
    featured: false,
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'c6',
    niche: 'Видеонаблюдение',
    title: 'VideoGuard — 41 заявка от юрлиц',
    siteName: 'VideoGuard',
    city: 'Тюмень',
    before: 'Все клиенты — физлица с мелкими заказами. Крупных корпоративных проектов не было.',
    after: 'Переупаковали позиционирование под B2B, запустили таргет ВК на руководителей. 41 заявка от юрлиц за первый месяц.',
    metrics: [
      { value: '41', label: 'B2B-заявок' },
      { value: '68%', label: 'доля юрлиц' },
      { value: '180К', label: 'ср. чек' },
    ],
    featured: false,
    createdAt: Date.now() - 100 * 24 * 60 * 60 * 1000,
  },
]

/* ===== Демо-заявки ===== */
function buildDemoLeads(): Lead[] {
  const sources: LeadSource[] = ['hero', 'modal', 'contact', 'register']
  const niches = ['Ремонт квартир', 'Скупка техники', 'Клининг', 'Строительство домов', 'Окна', 'Видеонаблюдение', 'Продажа участков']
  const cities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Пермь', 'Казань', 'Новосибирск', 'Тюмень']
  const names = ['Иван Петров', 'Мария Соколова', 'Алексей Смирнов', 'Елена Волкова', 'Дмитрий Орлов', 'Ольга Миронова']
  const leads: Lead[] = []
  const now = Date.now()
  for (let i = 0; i < 47; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const source = sources[Math.floor(Math.random() * sources.length)]
    const name = names[Math.floor(Math.random() * names.length)]
    const niche = niches[Math.floor(Math.random() * niches.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const phone = '+7 (9' + Math.floor(Math.random() * 99) + ') ' + Math.floor(Math.random() * 900 + 100) + '-' + String(Math.floor(Math.random() * 100)).padStart(2, '0') + '-' + String(Math.floor(Math.random() * 100)).padStart(2, '0')
    const status: Lead['status'] = daysAgo < 2 ? 'new' : daysAgo < 10 ? 'processing' : 'closed'
    leads.push({
      id: uid() + i,
      source,
      status,
      createdAt: now - daysAgo * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 12 * 60 * 60 * 1000),
      data: {
        name, phone, niche, city,
        email: name.toLowerCase().split(' ')[0] + '@example.com',
      },
    })
  }
  return leads.sort((a, b) => b.createdAt - a.createdAt)
}

/* ============================================================
ЗВУК КОЛОКОЛЬЧИКА (с разблокировкой аудио для браузеров)
============================================================ */
let audioCtx: AudioContext | null = null

export function unlockAudio() {
  try {
    if (typeof window === 'undefined') return
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    if (!audioCtx) audioCtx = new Ctx()
    if (audioCtx.state === 'suspended') audioCtx.resume()
  } catch {
    /* ignore */
  }
}

export async function playBell() {
  try {
    if (typeof window === 'undefined') return
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    if (!audioCtx) audioCtx = new Ctx()
    if (audioCtx.state === 'suspended') await audioCtx.resume()
    const ctx = audioCtx
    const now = ctx.currentTime + 0.02
    const bellNotes = [
      { freq: 880, start: 0, dur: 0.9 },
      { freq: 659.25, start: 0.2, dur: 1.2 },
    ]
    bellNotes.forEach((note) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = note.freq
      osc.type = 'sine'
      const t = now + note.start
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.55, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + note.dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + note.dur + 0.05)
    })
  } catch {
    /* ignore */
  }
}

/* ============================================================
ПЕРЕНOS СТАРЫХ ДАННЫХ ИЗ localStorage (одноразово)
============================================================ */
function readLegacy(): { leads: any[]; news: any[]; cases: any[] } | null {
  if (typeof window === 'undefined') return null
  try {
    const l = localStorage.getItem(LEADS_KEY)
    const n = localStorage.getItem(NEWS_KEY)
    const c = localStorage.getItem(CASES_KEY)
    const leads = l ? JSON.parse(l) : []
    const news = n ? JSON.parse(n) : []
    const cases = c ? JSON.parse(c) : []
    if (leads.length || news.length || cases.length) return { leads, news, cases }
  } catch {
    /* ignore */
  }
  return null
}

/* ============================================================
ПРОВАЙДЕР (данные хранятся на сервере: /api/db → data/db.json)
============================================================ */
export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [unread, setUnread] = useState(0)
  const [ready, setReady] = useState(false)

  const apply = useCallback((fresh: any) => {
    if (!fresh) return
    setLeads(Array.isArray(fresh.leads) ? fresh.leads : [])
    setNews(Array.isArray(fresh.news) ? fresh.news : [])
    setCases(Array.isArray(fresh.cases) ? fresh.cases : [])
  }, [])

  const send = useCallback(async (action: string, payload: any) => {
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      })
      if (res.ok) apply(await res.json())
    } catch (e) {
      console.error('DB write error', e)
    }
  }, [apply])

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/db', { cache: 'no-store' })
      if (res.ok) apply(await res.json())
    } catch (e) {
      console.error('DB load error', e)
    }
  }, [apply])

  /* ===== Первичная загрузка + одноразовое наполнение ===== */
  useEffect(() => {
    let alive = true
    const init = async () => {
      try {
        const res = await fetch('/api/db', { cache: 'no-store' })
        let fresh = res.ok ? await res.json() : null
        if (fresh && !fresh.seededAt) {
          const legacy = readLegacy()
          const payload = legacy || { leads: buildDemoLeads(), news: DEFAULT_NEWS, cases: DEFAULT_CASES }
          const sr = await fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'seed', payload }),
          })
          if (sr.ok) fresh = await sr.json()
        }
        if (alive) apply(fresh)
      } catch (e) {
        console.error('DB init error', e)
      } finally {
        if (alive) setReady(true)
      }
    }
    init()
    return () => { alive = false }
  }, [apply])

  /* ===== Автообновление при возврате на вкладку ===== */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refresh])

  /* ===== Звук + мигание заголовка при новой заявке ===== */
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const originalTitle = document.title
    let blinkInterval: ReturnType<typeof setInterval> | null = null
    const handler = () => {
      playBell()
      setUnread((u) => u + 1)
      if (blinkInterval) clearInterval(blinkInterval)
      let count = 0
      blinkInterval = setInterval(() => {
        document.title = count % 2 === 0 ? '🔔 Новая заявка!' : originalTitle
        count++
        if (count >= 8) {
          if (blinkInterval) clearInterval(blinkInterval)
          document.title = originalTitle
        }
      }, 700)
    }
    window.addEventListener('lead-created', handler)
    return () => {
      window.removeEventListener('lead-created', handler)
      if (blinkInterval) clearInterval(blinkInterval)
    }
  }, [])

  /* ===== Статистика по дням для графика ===== */
  const dailyStats: DailyStat[] = (() => {
    const days: Record<string, number> = {}
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      days[d.toISOString().slice(0, 10)] = 0
    }
    leads.forEach((l) => {
      const key = new Date(l.createdAt).toISOString().slice(0, 10)
      if (key in days) days[key]++
    })
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      leads: count,
    }))
  })()

  /* ============================================================
  ДЕЙСТВИЯ: ЗАЯВКИ
  ============================================================ */
  const addLead = useCallback((l: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const lead: Lead = { ...l, id: uid(), createdAt: Date.now(), status: 'new' }
    setLeads((prev) => [lead, ...prev])
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lead-created', { detail: lead }))
    }
    send('addLead', lead)
  }, [send])

  const updateLeadStatus = useCallback((id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    send('updateLeadStatus', { id, status })
  }, [send])

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id))
    send('deleteLead', { id })
  }, [send])

  /* ============================================================
  ДЕЙСТВИЯ: НОВОСТИ
  ============================================================ */
  const addNews = useCallback((n: Omit<NewsItem, 'id'>) => {
    const item = { ...n, id: uid() }
    setNews((prev) => [item, ...prev])
    send('addNews', item)
  }, [send])

  const editNews = useCallback((id: string, updates: Partial<Omit<NewsItem, 'id'>>) => {
    setNews((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)))
    send('editNews', { id, ...updates })
  }, [send])

  const deleteNews = useCallback((id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id))
    send('deleteNews', { id })
  }, [send])

  /* ============================================================
  ДЕЙСТВИЯ: КЕЙСЫ
  ============================================================ */
  const addCase = useCallback((c: Omit<Case, 'id' | 'createdAt'>) => {
    const item = { ...c, id: uid(), createdAt: Date.now() }
    setCases((prev) => [item, ...prev])
    send('addCase', item)
  }, [send])

  const editCase = useCallback((id: string, updates: Partial<Omit<Case, 'id' | 'createdAt'>>) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
    send('editCase', { id, ...updates })
  }, [send])

  const deleteCase = useCallback((id: string) => {
    setCases((prev) => prev.filter((c) => c.id !== id))
    send('deleteCase', { id })
  }, [send])

  const toggleCaseFeatured = useCallback((id: string) => {
    const target = cases.find((c) => c.id === id)
    if (!target) return
    const featuredCount = cases.filter((c) => c.featured).length
    if (!target.featured && featuredCount >= MAX_FEATURED) {
      if (typeof window !== 'undefined') {
        alert(`На главной можно показать не более ${MAX_FEATURED} кейсов. Снимите галочку с одного из уже выбранных.`)
      }
      return
    }
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c)))
    send('toggleCaseFeatured', { id })
  }, [cases, send])

  const markAllRead = useCallback(() => setUnread(0), [])

  if (!ready) return null

  return (
    <LeadsContext.Provider
      value={{
        leads, news, cases, unread, dailyStats,
        addLead, updateLeadStatus, deleteLead,
        addNews, editNews, deleteNews,
        addCase, editCase, deleteCase, toggleCaseFeatured,
        markAllRead,
      }}
    >
      {children}
    </LeadsContext.Provider>
  )
}

export const useLeads = () => {
  const ctx = useContext(LeadsContext)
  if (!ctx) throw new Error('useLeads must be used inside LeadsProvider')
  return ctx
}