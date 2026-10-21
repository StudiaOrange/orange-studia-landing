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
  register: (data: Omit<Partner, 'id' | 'createdAt'>) => void
  login: (email: string, password: string) => boolean
  logout: () => void
  addCalculation: (calc: Omit<Calculation, 'id' | 'partnerId' | 'createdAt'>) => void
  deleteCalculation: (id: string) => void
  addReport: (input: ReportInput) => Report | null
  deleteReport: (id: string) => void
}

const PartnerContext = createContext<PartnerContextValue | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
const PARTNERS_KEY = 'orange_studia_partners'
const SESSION_KEY = 'orange_studia_partner_session'
const CALCS_KEY = 'orange_studia_calculations'
const REPORTS_KEY = 'orange_studia_reports'

export function PartnerProvider({ children }: { children: React.ReactNode }) {
  const [partner, setPartner] = useState<Partner | null>(null)
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setInitialized(true)
      return
    }
    try {
      const session = localStorage.getItem(SESSION_KEY)
      if (session) {
        const parsed = JSON.parse(session)
        if (parsed.expires > Date.now()) {
          const partners: Partner[] = JSON.parse(localStorage.getItem(PARTNERS_KEY) || '[]')
          const found = partners.find((p) => p.id === parsed.partnerId)
          if (found) setPartner(found)
        } else {
          localStorage.removeItem(SESSION_KEY)
        }
      }
      setCalculations(JSON.parse(localStorage.getItem(CALCS_KEY) || '[]'))
      setReports(JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]'))
    } catch {
      /* ignore */
    }
    setInitialized(true)
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

  const register = useCallback((data: Omit<Partner, 'id' | 'createdAt'>) => {
    if (typeof window === 'undefined') return
    const newPartner: Partner = { ...data, id: uid(), createdAt: Date.now() }
    try {
      const partners: Partner[] = JSON.parse(localStorage.getItem(PARTNERS_KEY) || '[]')
      if (partners.find((p) => p.email === data.email)) {
        alert('Пользователь с таким email уже зарегистрирован')
        return
      }
      partners.push(newPartner)
      localStorage.setItem(PARTNERS_KEY, JSON.stringify(partners))
      localStorage.setItem(SESSION_KEY, JSON.stringify({ partnerId: newPartner.id, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 }))
      setPartner(newPartner)
    } catch {
      alert('Ошибка регистрации')
    }
  }, [])

  const login = useCallback((email: string, password: string): boolean => {
    if (typeof window === 'undefined') return false
    try {
      const partners: Partner[] = JSON.parse(localStorage.getItem(PARTNERS_KEY) || '[]')
      const found = partners.find((p) => p.email.toLowerCase() === email.toLowerCase())
      if (!found) {
        alert('Пользователь не найден. Проверьте email.')
        return false
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify({ partnerId: found.id, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 }))
      setPartner(found)
      return true
    } catch {
      alert('Ошибка входа')
      return false
    }
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