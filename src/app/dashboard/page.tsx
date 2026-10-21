// src/app/dashboard/page.tsx
'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, FileText, BarChart3, LogOut, Menu, X, Trash2, Share2,
  Wallet as WalletIcon, Target, TrendingUp, ArrowLeft, ArrowRight, Plus,
  CheckCircle, Copy, Sparkles, Calendar, Users, DollarSign, Clock, PieChart,
  FileSignature,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, Legend,
} from 'recharts'
import { usePartner, Report, ReportInput } from '@/context/PartnerContext'
import { NICHES_2026, CHANNEL_LABELS, ChannelKey } from '@/data/niches2026'
import { calculateReport, CHANNEL_MULTIPLIER } from '@/utils/reportCalc'
import ContractGenerator from '@/components/ContractGenerator'
import WalletTab from '@/components/WalletTab'

type Tab = 'overview' | 'reports' | 'market' | 'contract' | 'wallet'
type ReportsView = 'list' | 'create' | 'detail'

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU')
const fmtMoney = (n: number) => `${fmt(n)} ₽`
const compactMoney = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  if (Math.abs(n) >= 1_000) return `${Math.round(n / 1000)} тыс ₽`
  return `${fmt(n)} ₽`
}

export default function DashboardPage() {
  const router = useRouter()
  const { partner, reports, isAuthenticated, logout, addReport, deleteReport } = usePartner()
  const [tab, setTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reportsView, setReportsView] = useState<ReportsView>('list')
  const [activeReport, setActiveReport] = useState<Report | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  const myReports = useMemo(
    () => (partner ? reports.filter((r) => r.partnerId === partner.id) : []),
    [reports, partner]
  )

  const overview = useMemo(() => {
    if (myReports.length === 0) return null
    const totalRevenue = myReports.reduce((s, r) => s + r.result.totals.revenue, 0)
    const totalProfit = myReports.reduce((s, r) => s + r.result.totals.profit, 0)
    const avgRomi = Math.round(myReports.reduce((s, r) => s + r.result.totals.romi, 0) / myReports.length)
    const paybacks = myReports.map((r) => r.result.paybackMonth).filter((x): x is number => x !== null)
    const avgPayback = paybacks.length ? Math.round(paybacks.reduce((a, b) => a + b, 0) / paybacks.length) : null
    return { totalRevenue, totalProfit, avgRomi, avgPayback }
  }, [myReports])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }
  const openReport = (r: Report) => { setActiveReport(r); setReportsView('detail') }
  const goCreate = () => { setTab('reports'); setReportsView('create') }
  
  const handleCreated = (r: Report | null) => {
    if (r) { setActiveReport(r); setReportsView('detail'); showToast('✅ Отчёт создан') }
  }
  
  const handleDeleteReport = (id: string) => {
    if (confirm('Удалить отчёт?')) { deleteReport(id); setReportsView('list'); setActiveReport(null); showToast('Отчёт удалён') }
  }
  
  const handleShare = (r: Report) => {
    const t = r.result.totals
    const text = [
      `📊 Отчёт: ${r.title}`,
      `Ниша: ${r.nicheName} · Канал: ${r.channelName}`,
      `Бюджет: ${fmtMoney(r.budget)}/мес · Горизонт: ${r.months} мес`,
      '',
      `Лиды: ${fmt(t.leads)}`,
      `Клиенты: ${fmt(t.clients)}`,
      `Выручка: ${fmtMoney(t.revenue)}`,
      `Прибыль: ${fmtMoney(t.profit)}`,
      `ROMI: ${t.romi}%`,
      `Окупаемость: ${r.result.paybackMonth ? `~${r.result.paybackMonth} мес` : '> 12 мес'}`,
      '',
      'Сделано в Orange Studia · данные рынка 2026',
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => showToast('📋 Отчёт скопирован'))
  }

  const navItems = [
    { id: 'overview' as Tab, label: 'Обзор', icon: Home },
    { id: 'reports' as Tab, label: 'Отчёты', icon: FileText, badge: myReports.length },
    { id: 'market' as Tab, label: 'Рынок 2026', icon: BarChart3 },
    { id: 'contract' as Tab, label: 'Договор', icon: FileSignature },
    { id: 'wallet' as Tab, label: 'Кошелёк', icon: WalletIcon },
  ]

  if (!isAuthenticated || !partner) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col lg:flex-row">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
        )}
      </AnimatePresence>
      
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-[#1e293b] to-[#0f172a] dark:from-slate-900 dark:to-slate-950 text-white shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-extrabold shadow-lg shadow-orange-500/30">O</div>
            <div>
              <p className="text-sm font-extrabold leading-tight">Orange</p>
              <p className="text-[10px] text-slate-400 leading-tight">Личный кабинет</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-sm">
              {partner.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{partner.fullName}</p>
              <p className="text-[10px] text-slate-400 truncate">{partner.niche}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 px-3 py-2 font-bold">Меню</p>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false); if (item.id === 'reports') setReportsView('list') }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${active ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-orange-500'}`}>{item.badge}</span>
                )}
              </button>
            )
          })}
          <p className="text-[10px] uppercase tracking-wider text-slate-500 px-3 py-2 mt-5 font-bold">Переходы</p>
          <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-all">
            <Home size={18} /> <span className="text-sm font-semibold">На сайт</span>
          </Link>
          <button onClick={() => { logout(); router.push('/') }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all mt-2">
            <LogOut size={18} /> <span className="text-sm font-semibold">Выйти</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white capitalize">
                  {tab === 'overview' ? 'Обзор' : tab === 'reports' ? 'Отчёты' : tab === 'market' ? 'Рынок 2026' : tab === 'contract' ? 'Договор' : 'Кошелёк'}
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Добро пожаловать, {partner.fullName}</p>
              </div>
            </div>
            {tab === 'reports' && reportsView === 'list' && (
              <button onClick={goCreate} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-orange-500/25 hover:shadow-xl transition-shadow">
                <Plus size={16} /> <span className="hidden sm:inline">Создать отчёт</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* ===== ОБЗОР ===== */}
          {tab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Личный кабинет</p>
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-2">{partner.fullName}</h2>
                  <p className="text-blue-100 text-sm md:text-base max-w-xl">
                    Создавайте реалистичные отчёты, формируйте договор, управляйте балансом и отслеживайте прогноз окупаемости.
                  </p>
                </div>
              </motion.div>
              {myReports.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                  <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-1">Отчётов пока нет</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Создайте первый отчёт по вашей нише — это займёт меньше минуты</p>
                  <button onClick={goCreate} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25">
                    <Plus size={16} /> Создать первый отчёт
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Отчётов', value: myReports.length, icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
                      { label: 'Прогноз выручки', value: overview ? compactMoney(overview.totalRevenue) : '—', icon: DollarSign, gradient: 'from-orange-500 to-amber-500' },
                      { label: 'Средний ROMI', value: overview ? `${overview.avgRomi}%` : '—', icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500' },
                      { label: 'Ср. окупаемость', value: overview?.avgPayback ? `~${overview.avgPayback} мес` : '—', icon: Clock, gradient: 'from-violet-500 to-purple-500' },
                    ].map((stat, i) => {
                      const Icon = stat.icon
                      return (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg mb-3`}>
                            <Icon size={20} className="text-white" />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                          <p className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white truncate">{stat.value}</p>
                        </motion.div>
                      )
                    })}
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Последние отчёты</h3>
                      <button onClick={() => { setTab('reports'); setReportsView('list') }} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        Все отчёты <ArrowRight size={13} />
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {myReports.slice(0, 5).map((r) => (
                        <button key={r.id} onClick={() => { setTab('reports'); openReport(r) }} className="w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{r.title}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.nicheName} · {r.channelName}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-bold ${r.result.totals.romi >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>ROMI {r.result.totals.romi}%</span>
                              <span className="text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleDateString('ru-RU')}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===== ОТЧЁТЫ ===== */}
          {tab === 'reports' && (
            <div className="max-w-7xl mx-auto">
              {reportsView === 'list' && (
                <div>
                  {myReports.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                      <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-1">Отчётов пока нет</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Создайте отчёт по вашей нише на основе данных рынка 2026</p>
                      <button onClick={goCreate} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25">
                        <Plus size={16} /> Создать отчёт
                      </button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {myReports.map((r) => (
                        <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <Calendar size={11} /> {new Date(r.createdAt).toLocaleDateString('ru-RU')}
                              </p>
                              <h3 className="font-bold text-slate-900 dark:text-white truncate">{r.title}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.nicheName} · {r.channelName}</p>
                            </div>
                            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full flex-shrink-0">{r.months} мес</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-center">
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">Выручка</p>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{compactMoney(r.result.totals.revenue)}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-center">
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">ROMI</p>
                              <p className={`text-sm font-bold ${r.result.totals.romi >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{r.result.totals.romi}%</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-center">
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">Окуп.</p>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{r.result.paybackMonth ? `~${r.result.paybackMonth} мес` : '>12'}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openReport(r)} className="flex-1 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">Открыть</button>
                            <button onClick={() => handleShare(r)} className="py-2 px-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><Share2 size={13} /></button>
                            <button onClick={() => handleDeleteReport(r.id)} className="py-2 px-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><Trash2 size={13} /></button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {reportsView === 'create' && <ReportForm onCreate={handleCreated} onCancel={() => setReportsView('list')} />}
              {reportsView === 'detail' && activeReport && (
                <ReportDetail report={activeReport} onBack={() => setReportsView('list')} onShare={() => handleShare(activeReport)} onDelete={() => handleDeleteReport(activeReport.id)} />
              )}
            </div>
          )}

          {/* ===== РЫНОК 2026 ===== */}
          {tab === 'market' && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">Бенчмарки рынка 2026</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Реальные показатели по нишам: стоимость лида, средний чек, конверсия.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 text-left">
                        {['Ниша', 'Средний чек', 'Маржа', 'Конверсия', 'CPL Директ', 'Тренд', ''].map((h) => (
                          <th key={h} className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {NICHES_2026.map((n) => (
                        <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900 dark:text-white">{n.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{n.category}</p>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{compactMoney(n.avgCheck)}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{n.margin}%</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{n.conversion}%</td>
                          <td className="px-4 py-3 font-semibold text-orange-600 dark:text-orange-400">{n.cpl.direct} ₽</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold ${n.demandTrend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                              {n.demandTrend >= 0 ? '+' : ''}{n.demandTrend}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={goCreate} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">Отчёт →</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== ДОГОВОР ===== */}
          {tab === 'contract' && <ContractGenerator />}
          
          {/* ===== КОШЕЛЁК ===== */}
          {tab === 'wallet' && <WalletTab />}
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-400 dark:text-emerald-600" />
            <p className="text-sm font-medium">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===== ФОРМА СОЗДАНИЯ ОТЧЁТА ===== */
function ReportForm({ onCreate, onCancel }: { onCreate: (r: Report | null) => void; onCancel: () => void }) {
  const { addReport } = usePartner()
  const [nicheId, setNicheId] = useState(NICHES_2026[0].id)
  const [channel, setChannel] = useState<ChannelKey>('direct')
  const [budget, setBudget] = useState(50000)
  const [months, setMonths] = useState(6)
  const [title, setTitle] = useState('')
  const [cName, setCName] = useState('Моя ниша')
  const [cAvgCheck, setCAvgCheck] = useState(50000)
  const [cConversion, setCConversion] = useState(20)
  const [cMargin, setCMargin] = useState(40)
  const [cBaseCpl, setCBaseCpl] = useState(800)

  const isCustom = nicheId === 'custom'
  const niche = NICHES_2026.find((n) => n.id === nicheId)
  const avgCheck = isCustom ? cAvgCheck : niche!.avgCheck
  const conversion = isCustom ? cConversion : niche!.conversion
  const margin = isCustom ? cMargin : niche!.margin
  const demandTrend = isCustom ? 0 : niche!.demandTrend
  const startCpl = isCustom ? Math.round(cBaseCpl * CHANNEL_MULTIPLIER[channel]) : niche!.cpl[channel]
  const nicheName = isCustom ? cName : niche!.name
  const category = isCustom ? 'Индивидуальная' : niche!.category

  const preview = useMemo(
    () => calculateReport({ startCpl, conversion, margin, avgCheck, budget, months, demandTrend }),
    [startCpl, conversion, margin, avgCheck, budget, months, demandTrend]
  )

  const autoTitle = `${nicheName} · ${CHANNEL_LABELS[channel]} · ${fmt(budget)} ₽/мес`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (budget < 5000) { alert('Минимальный бюджет — 5 000 ₽'); return }
    const input: ReportInput = {
      title: title.trim() || autoTitle,
      nicheName, category,
      channelName: CHANNEL_LABELS[channel],
      budget, months, avgCheck, conversion, margin, startCpl, demandTrend,
    }
    onCreate(addReport(input))
  }

  const inputCls = 'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/20'
  const labelCls = 'block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider'

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Новый отчёт</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Реалистичный прогноз на основе рынка 2026</p>
            </div>
          </div>
          <button onClick={onCancel} className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Название отчёта (опционально)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder={autoTitle} />
          </div>
          <div>
            <label className={labelCls}>Ниша</label>
            <select value={nicheId} onChange={(e) => setNicheId(e.target.value)} className={inputCls}>
              {NICHES_2026.map((n) => (<option key={n.id} value={n.id}>{n.name} · {n.category}</option>))}
              <option value="custom">✏️ Другая ниша (ввести вручную)</option>
            </select>
          </div>
          {isCustom && (
            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-orange-700 dark:text-orange-400">Параметры вашей ниши</p>
              <div>
                <label className={labelCls}>Название ниши</label>
                <input type="text" value={cName} onChange={(e) => setCName(e.target.value)} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Средний чек, ₽</label>
                  <input type="number" min="0" value={cAvgCheck} onChange={(e) => setCAvgCheck(Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Конверсия, %</label>
                  <input type="number" min="1" max="85" value={cConversion} onChange={(e) => setCConversion(Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Маржа, %</label>
                  <input type="number" min="1" max="100" value={cMargin} onChange={(e) => setCMargin(Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Базовый CPL, ₽</label>
                  <input type="number" min="50" value={cBaseCpl} onChange={(e) => setCBaseCpl(Number(e.target.value))} className={inputCls} />
                </div>
              </div>
            </div>
          )}
          <div>
            <label className={labelCls}>Канал трафика</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CHANNEL_LABELS) as ChannelKey[]).map((ch) => {
                const cpl = isCustom ? Math.round(cBaseCpl * CHANNEL_MULTIPLIER[ch]) : niche!.cpl[ch]
                return (
                  <button key={ch} type="button" onClick={() => setChannel(ch)}
                    className={`rounded-xl border p-3 text-left transition-all ${channel === ch ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 ring-2 ring-orange-200 dark:ring-orange-500/30' : 'border-slate-200 dark:border-slate-700 hover:border-orange-200'}`}>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{CHANNEL_LABELS[ch]}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">~{cpl} ₽/лид</p>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Бюджет в месяц, ₽</label>
              <input type="number" min="5000" step="5000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Горизонт прогноза</label>
              <select value={months} onChange={(e) => setMonths(Number(e.target.value))} className={inputCls}>
                <option value={3}>3 месяца</option>
                <option value={6}>6 месяцев</option>
                <option value={12}>12 месяцев</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Plus size={18} /> Создать отчёт
          </button>
        </form>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 h-fit">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <PieChart size={16} className="text-orange-500" /> Предпросмотр расчёта
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Стоимость лида', value: fmtMoney(startCpl) },
            { label: `Лидов за ${months} мес`, value: fmt(preview.totals.leads) },
            { label: 'Клиентов', value: fmt(preview.totals.clients) },
            { label: 'Выручка', value: compactMoney(preview.totals.revenue) },
            { label: 'Прибыль', value: compactMoney(preview.totals.profit) },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400">{row.label}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{row.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">ROMI</span>
            <span className={`text-lg font-extrabold ${preview.totals.romi >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{preview.totals.romi}%</span>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
            <p className="text-xs font-semibold text-emerald-100 mb-1">Окупаемость</p>
            <p className="text-2xl font-extrabold">{preview.paybackMonth ? `~${preview.paybackMonth} мес` : '> 12 мес'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ===== ДЕТАЛИ ОТЧЁТА ===== */
function ReportDetail({ report, onBack, onShare, onDelete }: { report: Report; onBack: () => void; onShare: () => void; onDelete: () => void }) {
  const { result } = report
  const t = result.totals

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors">
          <ArrowLeft size={16} /> К списку отчётов
        </button>
        <div className="flex gap-2">
          <button onClick={onShare} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg hover:border-blue-500 transition-all">
            <Copy size={14} /> Копировать
          </button>
          <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-500 text-sm font-bold rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
            <Trash2 size={14} /> Удалить
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">{report.category} · данные рынка 2026</p>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">{report.title}</h2>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full">{report.nicheName}</span>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">{report.channelName}</span>
          <span className="px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">{fmtMoney(report.budget)}/мес</span>
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">{report.months} мес</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Лиды', value: fmt(t.leads), icon: Users },
          { label: 'Клиенты', value: fmt(t.clients), icon: Target },
          { label: 'Выручка', value: compactMoney(t.revenue), icon: DollarSign },
          { label: 'Прибыль', value: compactMoney(t.profit), icon: TrendingUp },
          { label: 'ROMI', value: `${t.romi}%`, icon: BarChart3 },
          { label: 'Окупаемость', value: result.paybackMonth ? `~${result.paybackMonth} мес` : '>12 мес', icon: Clock },
        ].map((m, i) => {
          const Icon = m.icon
          return (
            <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Icon size={16} className="text-orange-500 mb-2" />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{m.label}</p>
              <p className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white truncate">{m.value}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">Выручка против вложений</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Накопительным итогом, ₽</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.months}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => compactMoney(v).replace(' ₽', '')} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: 'white', fontSize: '12px' }} formatter={(v: any) => fmtMoney(Number(v))} />
                <Legend />
                <Area type="monotone" dataKey="cumRevenue" stroke="#10b981" strokeWidth={3} fill="url(#revG)" name="Выручка" />
                <Area type="monotone" dataKey="cumBudget" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" fill="transparent" name="Вложения" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">Оптимизация стоимости лида</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Алгоритмы удешевляют лид с каждым месяцем, ₽</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: 'white', fontSize: '12px' }} formatter={(v: any) => fmtMoney(Number(v))} />
                <Line type="monotone" dataKey="cpl" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} name="Цена лида" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Помесячная детализация</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-left">
                {['Месяц', 'Лиды', 'Конв.', 'Клиенты', 'Выручка', 'Прибыль', 'Накоп. прибыль'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {result.months.map((m) => (
                <tr key={m.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{m.label}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{fmt(m.leads)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.conversion}%</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{fmt(m.clients)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{compactMoney(m.revenue)}</td>
                  <td className={`px-4 py-3 font-semibold ${m.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{compactMoney(m.profit)}</td>
                  <td className={`px-4 py-3 font-bold ${m.cumProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{compactMoney(m.cumProfit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}