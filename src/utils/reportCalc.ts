// src/utils/reportCalc.ts
import { ChannelKey } from '@/data/niches2026'

/* Коэффициенты каналов относительно Директа (для произвольной ниши) */
export const CHANNEL_MULTIPLIER: Record<ChannelKey, number> = {
  direct: 1,
  vk: 0.62,
  telegram: 0.72,
  max: 0.52,
}

/* Кривые оптимизации: алгоритмы удешевляют лид, отдел продаж растит конверсию */
const CPL_CURVE = [1.0, 0.96, 0.92, 0.87, 0.83, 0.79, 0.76, 0.73, 0.71, 0.69, 0.67, 0.65]
const CONV_CURVE = [1.0, 1.05, 1.1, 1.16, 1.2, 1.24, 1.27, 1.3, 1.32, 1.34, 1.36, 1.38]

export interface CalcParams {
  startCpl: number
  conversion: number
  margin: number
  avgCheck: number
  budget: number
  months: number
  demandTrend?: number
}

export interface MonthResult {
  month: number
  label: string
  cpl: number
  leads: number
  conversion: number
  clients: number
  revenue: number
  profit: number
  cumRevenue: number
  cumProfit: number
  cumBudget: number
  romi: number
}

export interface ReportResult {
  months: MonthResult[]
  paybackMonth: number | null
  totals: {
    leads: number
    clients: number
    revenue: number
    profit: number
    investment: number
    romi: number
  }
}

export function calculateReport(p: CalcParams): ReportResult {
  const trend = p.demandTrend ?? 0
  let cumRevenue = 0
  let cumProfit = 0
  let cumClients = 0
  let cumLeads = 0
  let paybackMonth: number | null = null
  const months: MonthResult[] = []

  for (let m = 1; m <= p.months; m++) {
    const idx = Math.min(m - 1, 11)
    const cpl = Math.max(50, Math.round(p.startCpl * CPL_CURVE[idx]))
    let conv = p.conversion * CONV_CURVE[idx] * (1 + (trend / 100) * (m / 12))
    conv = Math.min(conv, 85)
    const leads = Math.floor(p.budget / cpl)
    const clients = Math.round((leads * conv) / 100)
    const revenue = clients * p.avgCheck
    const grossProfit = (revenue * p.margin) / 100
    const profit = grossProfit - p.budget
    cumRevenue += revenue
    cumProfit += profit
    cumClients += clients
    cumLeads += leads
    const cumBudget = p.budget * m
    const romi = cumBudget > 0 ? Math.round((cumProfit / cumBudget) * 100) : 0
    if (paybackMonth === null && cumProfit >= 0) paybackMonth = m
    months.push({
      month: m,
      label: `${m} мес`,
      cpl,
      leads,
      conversion: Math.round(conv * 10) / 10,
      clients,
      revenue,
      profit,
      cumRevenue,
      cumProfit,
      cumBudget,
      romi,
    })
  }

  const investment = p.budget * p.months
  return {
    months,
    paybackMonth,
    totals: {
      leads: cumLeads,
      clients: cumClients,
      revenue: cumRevenue,
      profit: cumProfit,
      investment,
      romi: investment > 0 ? Math.round((cumProfit / investment) * 100) : 0,
    },
  }
}