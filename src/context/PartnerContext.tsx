// src/context/PartnerContext.tsx
'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { calculateReport, ReportResult } from '@/utils/reportCalc'

export interface Partner {
  id: string
  fullName: string
  email: string
  phone: string
  niche: string
  createdAt: number
}

export interface Calculation {
  id: string
  partnerId: string
  niche: string
  revenuePerClient: number
  channel: string
  costPerLead: number
  leadsFromDeposit: number
  potentialRevenue: number
  createdAt: number
}

export interface ReportInput {
  title: string
  nicheName: string
  category: string
  channelName: string
  budget: number
  months: number
  avgCheck: number
  conversion: number
  margin: number
  startCpl: number
  demandTrend: number
}

export interface Report extends ReportInput {
  id: string
  partnerId: string
  result: ReportResult
  createdAt: number
}

interface PartnerContextValue {
  partner: Partner | null
  calculations: Calculation[]
  reports: Report[]
  isAuthenticated: boolean
  register: (data: Omit<Partner, 'id' | 'createdAt'> & { password?: string }, password?: string) => void
  login: (email: string, password: string) => boolean
  logout: () => void
  addCalculation: (calc: Omit<Calculation, 'id' | 'partnerId' | 'createdAt'>) => void
  deleteCalculation: (id: string) => void
  addReport: (input: ReportInput) => Report | null
  deleteReport: (id: string) => void
}

const PartnerContext = createContext<PartnerContextValue | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

const SESSION_KEY = 'orange_studia_partner_session'
const CALCS_KEY = 'orange_studia_calculations'
const REPORTS_KEY = 'orange_studia_reports'
/* Старые ключи localStorage — для одноразового переноса партнёров на сервер */
const LEGACY_PARTNERS_KEY = 'orange_studia_partners'
const MIGRATED_FLAG = 'orange_partners_migrated_v1'
/* Ниша хранится локально (серверный пользователь содержит только имя/почту/телефон) */
const META_KEY = 'orange_partner_meta_v1'
const DEFAULT_PASSWORD = '123456'

function readMeta(): Record<string, { niche: string }> {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeMeta(meta: Record<string, { niche: string }>) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    /* ignore */
  }
}

function buildPartner(u: any): Partner {
  const meta = typeof window !== 'undefined' ? readMeta() : {}
  return {
    id: u.id,
    fullName: u.name || '',
    email: u.email || '',
    phone: u.phone || '',
    niche: meta[u.email]?.niche || '',
    createdAt: u.createdAt || Date.now(),
  }
}

export function PartnerProvider({ children }: { children: React.ReactNode }) {
  const [partner, setPartner] = useState<Partner | null>(null)
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [initialized, setInitialized] = useState(false)

  /* ===== Первичная загрузка: перенос старых партнёров + восстановление сессии ===== */
  useEffect(() => {
    if (typeof window === 'undefined') {
      setInitialized(true)
      return
    }
    const init = async () => {
      try {
        setCalculations(JSON.parse(localStorage.getItem(CALCS_KEY) || '[]'))
        setReports(JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]'))

        /* Одноразовый перенос зарегистрированных ранее партнёров в серверную базу */
        if (!localStorage.getItem(MIGRATED_FLAG)) {
          const legacy: any[] = JSON.parse(localStorage.getItem(LEGACY_PARTNERS_KEY) || '[]')
          if (legacy.length) {
            for (const p of legacy) {
              await fetch('/api/db', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'addUser',
                  payload: { email: p.email, password: DEFAULT_PASSWORD, name: p.fullName, phone: p.phone },
                }),
              }).catch(() => null)
              const meta = readMeta()
              if (p.email && p.niche) {
                meta[p.email] = { niche: p.niche }
                writeMeta(meta)
              }
            }
          }
          localStorage.setItem(MIGRATED_FLAG, '1')
        }

        /* Восстановление сессии: ищем пользователя на сервере по id */
        const session = localStorage.getItem(SESSION_KEY)
        if (session) {
          const parsed = JSON.parse(session)
          if (parsed.expires > Date.now()) {
            const res = await fetch('/api/db', { cache: 'no-store' })
            if (res.ok) {
              const data = await res.json()
              const found = (data.users || []).find((u: any) => u.id === parsed.partnerId)
              if (found) setPartner(buildPartner(found))
              else localStorage.removeItem(SESSION_KEY)
            }
          } else {
            localStorage.removeItem(SESSION_KEY)
          }
        }
      } catch {
        /* ignore */
      }
      setInitialized(true)
    }
    init()
  }, [])

  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return
    try {
      localStorage.setItem(CALCS_KEY, JSON.stringify(calculations))
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
    } catch {
      /* quota */
    }
  }, [calculations, reports, initialized])

  /* ===== Регистрация: создаёт пользователя в серверной базе ===== */
  const register = useCallback((data: Omit<Partner, 'id' | 'createdAt'> & { password?: string }, password?: string) => {
    if (typeof window === 'undefined') return
    const pwd = password || (data as any).password || DEFAULT_PASSWORD
    const meta = readMeta()
    meta[data.email] = { niche: data.niche || '' }
    writeMeta(meta)
    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addUser',
        payload: { email: data.email, password: pwd, name: data.fullName, phone: data.phone },
      }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null)
        if (!res.ok) {
          alert(json?.error || 'Ошибка регистрации')
          return
        }
        const created = (json.users || []).find((u: any) => u.email === data.email.toLowerCase())
        if (created) {
          localStorage.setItem(SESSION_KEY, JSON.stringify({ partnerId: created.id, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 }))
          setPartner(buildPartner(created))
        }
      })
      .catch(() => alert('Ошибка сети при регистрации'))
  }, [])

  /* ===== Вход: проверка пароля на сервере ===== */
  const login = useCallback((email: string, password: string): boolean => {
    if (typeof window === 'undefined') return false
    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'loginUser', payload: { email, password } }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null)
        if (!res.ok || !json?.user) {
          alert(json?.error || 'Неверная почта или пароль')
          return
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify({ partnerId: json.user.id, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 }))
        setPartner(buildPartner(json.user))
      })
      .catch(() => alert('Ошибка сети при входе'))
    return true
  }, [])

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY)
    }
    setPartner(null)
  }, [])

  const addCalculation = useCallback((calc: Omit<Calculation, 'id' | 'partnerId' | 'createdAt'>) => {
    if (!partner) return
    setCalculations((prev) => [{ ...calc, id: uid(), partnerId: partner.id, createdAt: Date.now() }, ...prev])
  }, [partner])

  const deleteCalculation = useCallback((id: string) => {
    setCalculations((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const addReport = useCallback((input: ReportInput): Report | null => {
    if (!partner) return null
    const result = calculateReport({
      startCpl: input.startCpl,
      conversion: input.conversion,
      margin: input.margin,
      avgCheck: input.avgCheck,
      budget: input.budget,
      months: input.months,
      demandTrend: input.demandTrend,
    })
    const report: Report = { ...input, id: uid(), partnerId: partner.id, result, createdAt: Date.now() }
    setReports((prev) => [report, ...prev])
    return report
  }, [partner])

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id))
  }, [])

  if (!initialized) return null

  return (
    <PartnerContext.Provider
      value={{
        partner,
        calculations,
        reports,
        isAuthenticated: !!partner,
        register,
        login,
        logout,
        addCalculation,
        deleteCalculation,
        addReport,
        deleteReport,
      }}
    >
      {children}
    </PartnerContext.Provider>
  )
}

export const usePartner = () => {
  const ctx = useContext(PartnerContext)
  if (!ctx) throw new Error('usePartner must be used inside PartnerProvider')
  return ctx
}