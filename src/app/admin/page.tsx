// src/app/admin/page.tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Inbox, Newspaper, Trash2, Send, LogOut, Home, FileText, User, Phone,
  Briefcase, Calendar, Menu, X, TrendingUp, CheckCircle2, Clock, BarChart3,
  ArrowRight, Mail, ExternalLink, Edit3, Image as ImageIcon, Upload, Eye,
  Star, MapPin, Plus, Wallet as WalletIcon,
} from 'lucide-react'
import { useLeads, LeadSource, Lead, NewsItem, Case } from '@/context/LeadsContext'
import AdminAuth, { checkAdminSession, clearAdminSession } from '@/components/AdminAuth'
import FinanceTab from '@/components/FinanceTab'
import { useBilling } from '@/context/BillingContext'

const SOURCE_META: Record<LeadSource, { label: string; color: string; hex: string; icon: React.ElementType }> = {
  hero: { label: 'Hero-форма', color: 'bg-orange-500', hex: '#f97316', icon: Home },
  modal: { label: 'Модальная', color: 'bg-blue-500', hex: '#3b82f6', icon: FileText },
  contact: { label: 'Калькулятор', color: 'bg-emerald-500', hex: '#10b981', icon: Briefcase },
  register: { label: 'Регистрация', color: 'bg-violet-500', hex: '#8b5cf6', icon: User },
}

const STATUS_META: Record<Lead['status'], { label: string; color: string; icon: React.ElementType }> = {
  new: { label: 'Новая', color: 'bg-blue-500', icon: Clock },
  processing: { label: 'В работе', color: 'bg-amber-500', icon: TrendingUp },
  closed: { label: 'Закрыта', color: 'bg-emerald-500', icon: CheckCircle2 },
}

type Tab = 'dashboard' | 'leads' | 'news' | 'cases' | 'finance'

const MAX_FEATURED = 4

const EMPTY_NEWS_FORM = {
  title: '', excerpt: '', content: '',
  author: 'Команда Orange Studia',
  date: new Date().toISOString().slice(0, 10),
  image: '',
}

function renderPreview(text: string) {
  return text
    .split(/\n\n+/)
    .map((block) => {
      const lines = block.split('\n')
      const isList = lines.every((l) => l.trim().startsWith('- '))
      const inline = (s: string) =>
        s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')
      if (isList) {
        const items = lines.map((l) => `<li class="mb-1">${inline(l.trim().slice(2))}</li>`).join('')
        return `<ul class="list-disc pl-5 space-y-1 my-3">${items}</ul>`
      }
      return `<p class="mb-3 leading-relaxed">${inline(block).replace(/\n/g, '<br/>')}</p>`
    })
    .join('')
}

/* ============================================================
   СОБСТВЕННЫЕ ДИАГРАММЫ (без Recharts — рисуются всегда)
============================================================ */

/* График-столбцы: заявки за 30 дней */
function LeadsBarChart({ data }: { data: { date: string; leads: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Нет данных для отображения</p>
      </div>
    )
  }
  const max = Math.max(...data.map((d) => d.leads), 1)
  const total = data.reduce((s, d) => s + d.leads, 0)
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-end gap-[3px] flex-1 min-h-0">
        {data.map((d, i) => (
          <div key={i} className="flex-1 h-full flex items-end group relative" title={`${d.date}: ${d.leads} заявок`}>
            <div
              className={`w-full rounded-t transition-all group-hover:opacity-100 ${d.leads > 0 ? 'bg-gradient-to-t from-orange-500 to-amber-400' : 'bg-slate-200 dark:bg-slate-700 opacity-40'}`}
              style={{ height: `${Math.max((d.leads / max) * 100, 2)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 dark:text-slate-400">
        <span>{data[0]?.date}</span>
        <span className="font-bold text-slate-700 dark:text-slate-200">Всего за 30 дней: {total}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}

/* Кольцевая диаграмма: источники заявок (conic-gradient) */
function SourceDonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, x) => s + x.value, 0)
  if (total === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Нет данных для отображения</p>
      </div>
    )
  }
  let acc = 0
  const stops = data
    .map((s) => {
      const from = (acc / total) * 360
      acc += s.value
      const to = (acc / total) * 360
      return `${s.color} ${from}deg ${to}deg`
    })
    .join(', ')
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full" style={{ background: `conic-gradient(${stops})` }}>
          <div className="absolute inset-[26%] rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{total}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">заявок</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-3">
        {data.map((s) => (
          <div key={s.name} className="flex items-center gap-2 min-w-0" title={`${s.name}: ${s.value}`}>
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{s.name}</span>
            <span className="ml-auto text-xs font-bold text-slate-900 dark:text-white flex-shrink-0">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Горизонтальные бары: топ городов */
function CityBarChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Нет данных для отображения</p>
      </div>
    )
  }
  const max = Math.max(...data.map((c) => c.value), 1)
  return (
    <div className="h-full flex flex-col justify-center space-y-3">
      {data.map((c) => (
        <div key={c.name}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{c.name}</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white flex-shrink-0">{c.value}</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
              style={{ width: `${(c.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  useEffect(() => { setAuthorized(checkAdminSession()) }, [])

  const {
    leads, news, cases, unread, dailyStats,
    addNews, editNews, deleteNews, markAllRead,
    updateLeadStatus, deleteLead,
    addCase, editCase, deleteCase, toggleCaseFeatured,
  } = useLeads()
  const { unreadAdmin } = useBilling()

  const [tab, setTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [newsForm, setNewsForm] = useState(EMPTY_NEWS_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { const t = setTimeout(markAllRead, 1500); return () => clearTimeout(t) }, [markAllRead])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (e: Event) => {
      const lead = (e as CustomEvent).detail as Lead
      setToast(`🔔 Новая заявка: ${lead.data.name || lead.data.niche}`)
      setTimeout(() => setToast(null), 3500)
    }
    window.addEventListener('lead-created', handler)
    return () => window.removeEventListener('lead-created', handler)
  }, [])

  const totalLeads = leads.length
  const newLeads = leads.filter((l) => l.status === 'new').length
  const closedLeads = leads.filter((l) => l.status === 'closed').length
  const conversionRate = totalLeads ? Math.round((closedLeads / totalLeads) * 100) : 0

  const sourceStats = (Object.keys(SOURCE_META) as LeadSource[]).map((src) => ({
    name: SOURCE_META[src].label,
    value: leads.filter((l) => l.source === src).length,
    color: SOURCE_META[src].hex,
  }))
  const activeSources = sourceStats.filter((s) => s.value > 0)

  const cityStats = (() => {
    const map: Record<string, number> = {}
    leads.forEach((l) => { const city = l.data.city || 'Не указан'; map[city] = (map[city] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6)
  })()

  const navItems = [
    { id: 'dashboard' as Tab, label: 'Дашборд', icon: BarChart3 },
    { id: 'leads' as Tab, label: 'Заявки', icon: Inbox, badge: newLeads },
    { id: 'news' as Tab, label: 'Новости', icon: Newspaper, badge: news.length },
    { id: 'cases' as Tab, label: 'Кейсы', icon: Star, badge: cases.length },
    { id: 'finance' as Tab, label: 'Финансы', icon: WalletIcon, badge: unreadAdmin },
  ]

  const handleLogout = () => { if (confirm('Выйти из админки?')) { clearAdminSession(); setAuthorized(false) } }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setToast('❌ Файл должен быть изображением'); setTimeout(() => setToast(null), 3000); return }
    if (file.size > 2 * 1024 * 1024) { setToast('❌ Файл слишком большой (макс 2 МБ)'); setTimeout(() => setToast(null), 3000); return }
    setImageUploading(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      setNewsForm((prev) => ({ ...prev, image: event.target?.result as string }))
      setImageUploading(false)
      setToast('✅ Изображение загружено'); setTimeout(() => setToast(null), 2000)
    }
    reader.onerror = () => { setImageUploading(false); setToast('❌ Ошибка загрузки'); setTimeout(() => setToast(null), 2500) }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const insertFormat = (before: string, after: string = before) => {
    if (typeof document === 'undefined') return
    const textarea = document.getElementById('news-content') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart, end = textarea.selectionEnd
    const text = newsForm.content
    const selected = text.substring(start, end)
    setNewsForm((prev) => ({ ...prev, content: text.substring(0, start) + before + selected + after + text.substring(end) }))
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + before.length, end + before.length) }, 0)
  }

  const submitNews = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsForm.title.trim() || !newsForm.excerpt.trim()) return
    if (editingId) { editNews(editingId as string, newsForm); setToast('✅ Новость обновлена') }
    else { addNews(newsForm); setToast('✅ Новость опубликована') }
    setNewsForm(EMPTY_NEWS_FORM); setEditingId(null); setPreviewMode(false)
    setTimeout(() => setToast(null), 2500)
  }

  const startEditing = (n: NewsItem) => {
    setNewsForm({ title: n.title, excerpt: n.excerpt, content: n.content || '', author: n.author || 'Команда', date: n.date, image: n.image || '' })
    setEditingId(n.id); setPreviewMode(false)
    if (typeof document !== 'undefined') {
      setTimeout(() => document.getElementById('news-form-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }

  const cancelEdit = () => { setNewsForm(EMPTY_NEWS_FORM); setEditingId(null); setPreviewMode(false) }

  if (!authorized) return <AdminAuth />

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
              <p className="text-[10px] text-slate-400 leading-tight">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 px-3 py-2 font-bold">Главное меню</p>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false) }}
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
          <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-all">
            <Home size={18} /> <span className="text-sm font-semibold">На сайт</span>
          </a>
          <a href="https://cash-boom.live/register" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-all">
            <ExternalLink size={18} /> <span className="text-sm font-semibold">Перейти в CRM</span>
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all mt-2">
            <LogOut size={18} /> <span className="text-sm font-semibold">Выйти</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-sm">АД</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Администратор</p>
              <p className="text-[10px] text-slate-400 truncate">online</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
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
                  {tab === 'dashboard' ? 'Дашборд' : tab === 'leads' ? 'Заявки' : tab === 'news' ? 'Новости' : tab === 'cases' ? 'Кейсы' : 'Финансы'}
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Управление партнерами, заявками и контентом</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <a href="/" className="hidden md:flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors">
                <Home size={15} /> <span className="hidden lg:inline">На сайт</span>
              </a>
              <a href="https://cash-boom.live/register" target="_blank" rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-xl transition-shadow">
                <ExternalLink size={15} /> <span className="hidden lg:inline">Перейти в</span> CRM
              </a>
              <button className="relative w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* ===== ДАШБОРД ===== */}
          {tab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Добро пожаловать</p>
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Панель управления Orange Studia</h2>
                  <p className="text-blue-100 text-sm md:text-base max-w-xl">Отслеживайте заявки, управляйте новостями, кейсами и финансами в реальном времени.</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Всего заявок', value: totalLeads, change: '+12%', icon: Inbox, gradient: 'from-blue-500 to-cyan-500' },
                  { label: 'Новые', value: newLeads, change: `${newLeads}`, icon: Bell, gradient: 'from-orange-500 to-amber-500' },
                  { label: 'Закрыто', value: closedLeads, change: `${conversionRate}%`, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500' },
                  { label: 'Кейсы', value: cases.length, change: `${cases.filter((c) => c.featured).length} на главной`, icon: Star, gradient: 'from-violet-500 to-purple-500' },
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                          <Icon size={20} className="text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{stat.change}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                      <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                    </motion.div>
                  )
                })}
              </div>

              {/* ✅ График: заявки за 30 дней (собственные столбцы) */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">Заявки за 30 дней</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Динамика поступления заявок</p>
                <div className="h-56 md:h-64">
                  <LeadsBarChart data={dailyStats} />
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* ✅ Кольцо: источники заявок */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">Источники заявок</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Распределение по формам сайта</p>
                  <div className="h-64">
                    <SourceDonutChart data={activeSources} />
                  </div>
                </motion.div>

                {/* ✅ Бары: топ городов */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">Топ городов</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Откуда приходят заявки</p>
                  <div className="h-64">
                    <CityBarChart data={cityStats} />
                  </div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Последние 5 заявок</h3>
                  <button onClick={() => setTab('leads')} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    Все заявки <ArrowRight size={13} />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {(lead.data.name || lead.data.fullName || 'A')[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{lead.data.name || lead.data.fullName || 'Без имени'}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{lead.data.niche} · {lead.data.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`${SOURCE_META[lead.source].color} text-white text-[10px] font-bold px-2 py-1 rounded-full`}>{SOURCE_META[lead.source].label}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {leads.length === 0 && <div className="p-10 text-center text-sm text-slate-500">Заявок пока нет</div>}
                </div>
              </motion.div>
            </div>
          )}

          {/* ===== ЗАЯВКИ ===== */}
          {tab === 'leads' && (
            <div className="max-w-7xl mx-auto space-y-4">
              {leads.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                  <Inbox size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-1">Заявок пока нет</p>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between flex-wrap gap-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">{leads.length}</span> заявок всего
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(STATUS_META).map(([k, m]) => {
                        const count = leads.filter((l) => l.status === k).length
                        return (
                          <div key={k} className="flex items-center gap-1.5 text-xs">
                            <span className={`w-2 h-2 rounded-full ${m.color}`}></span>
                            <span className="text-slate-600 dark:text-slate-300">{m.label}:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {leads.map((lead) => {
                    const StatusIcon = STATUS_META[lead.status].icon
                    return (
                      <motion.div key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`${SOURCE_META[lead.source].color} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>{SOURCE_META[lead.source].label}</span>
                            <span className={`${STATUS_META[lead.status].color} text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1`}>
                              <StatusIcon size={11} /> {STATUS_META[lead.status].label}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Calendar size={12} /> {new Date(lead.createdAt).toLocaleString('ru-RU')}
                            </span>
                          </div>
                          <button onClick={() => deleteLead(lead.id)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20">
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          {(lead.data.name || lead.data.fullName) && (
                            <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2.5">
                              <User size={15} className="text-blue-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Имя</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{lead.data.name || lead.data.fullName}</p>
                              </div>
                            </div>
                          )}
                          {lead.data.phone && (
                            <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2.5">
                              <Phone size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Телефон</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{lead.data.phone}</p>
                              </div>
                            </div>
                          )}
                          {lead.data.email && (
                            <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2.5">
                              <Mail size={15} className="text-violet-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Email</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{lead.data.email}</p>
                              </div>
                            </div>
                          )}
                          {lead.data.niche && (
                            <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2.5">
                              <Briefcase size={15} className="text-orange-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Ниша</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{lead.data.niche}</p>
                              </div>
                            </div>
                          )}
                          {lead.data.city && (
                            <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2.5">
                              <Home size={15} className="text-cyan-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Город</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{lead.data.city}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">Статус:</span>
                          {(Object.keys(STATUS_META) as Lead['status'][]).map((s) => (
                            <button key={s} onClick={() => updateLeadStatus(lead.id, s)}
                              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${lead.status === s ? `${STATUS_META[s].color} text-white shadow` : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                              {STATUS_META[s].label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </>
              )}
            </div>
          )}

          {/* ===== НОВОСТИ ===== */}
          {tab === 'news' && (
            <div className="max-w-7xl mx-auto">
              <div id="news-form-anchor"></div>
              <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 h-fit lg:sticky lg:top-24">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <Edit3 size={17} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{editingId ? 'Редактирование' : 'Новая новость'}</h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{editingId ? 'Измените данные и сохраните' : 'Появится на главной странице'}</p>
                      </div>
                    </div>
                    {editingId && (
                      <button onClick={cancelEdit} className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 flex items-center justify-center">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <form onSubmit={submitNews} className="space-y-3">
                    <input type="text" value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} required maxLength={120}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      placeholder="Заголовок новости..." />

                    <textarea value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} required rows={2} maxLength={250}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 resize-none"
                      placeholder="Краткое описание..." />

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Полный текст</label>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => setPreviewMode(false)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${!previewMode ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                            <Edit3 size={11} /> Редактор
                          </button>
                          <button type="button" onClick={() => setPreviewMode(true)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${previewMode ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                            <Eye size={11} /> Превью
                          </button>
                        </div>
                      </div>

                      {!previewMode ? (
                        <>
                          <div className="flex flex-wrap gap-1 mb-1.5 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button type="button" onClick={() => insertFormat('**')} className="w-8 h-8 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">Ж</button>
                            <button type="button" onClick={() => insertFormat('*')} className="w-8 h-8 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 italic">К</button>
                            <button type="button" onClick={() => insertFormat('\n- ')} className="w-8 h-8 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">•</button>
                          </div>
                          <textarea id="news-content" value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} rows={5}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 resize-none font-mono"
                            placeholder={'Подробный текст...\nИспользуйте **жирный** и *курсив*'} />
                        </>
                      ) : (
                        <div className="min-h-[140px] px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white">
                          {newsForm.content ? (
                            <div dangerouslySetInnerHTML={{ __html: renderPreview(newsForm.content) }} />
                          ) : (<p className="text-slate-400 italic">Предпросмотр будет здесь...</p>)}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Обложка</label>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      {newsForm.image ? (
                        <div className="relative group">
                          <img src={newsForm.image} alt="Preview" className="w-full h-36 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1">
                              <Upload size={12} /> Заменить
                            </button>
                            <button type="button" onClick={() => setNewsForm({ ...newsForm, image: '' })} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                              <X size={12} /> Удалить
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}
                          className="w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all disabled:opacity-50">
                          {imageUploading ? (
                            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (<>
                            <ImageIcon size={20} className="text-slate-400" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Загрузить изображение</span>
                          </>)}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input type="date" value={newsForm.date} onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500" />
                      <input type="text" value={newsForm.author} onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                        placeholder="Автор" />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl flex items-center justify-center gap-2">
                        {editingId ? <><Send size={16} /> Сохранить</> : <><Send size={16} /> Опубликовать</>}
                      </button>
                      {editingId && (
                        <button type="button" onClick={cancelEdit} className="px-5 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700">Отмена</button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Опубликованные ({news.length})</h2>
                  {news.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center">
                      <Newspaper size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">Новостей пока нет</p>
                    </div>
                  ) : (
                    news.map((n) => (
                      <motion.div key={n.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden transition-all ${editingId === n.id ? 'border-orange-500 ring-2 ring-orange-200 dark:ring-orange-500/30' : 'border-slate-200 dark:border-slate-800'}`}>
                        <div className="flex gap-3 p-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                            {n.image ? (
                              <img src={n.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-slate-400" /></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">{n.date} · {n.author}</p>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-sm line-clamp-2">{n.title}</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{n.excerpt}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 px-4 pb-3">
                          <button onClick={() => startEditing(n)} className="flex-1 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-500/20">
                            <Edit3 size={12} /> Редактировать
                          </button>
                          <button onClick={() => { if (confirm('Удалить новость?')) deleteNews(n.id) }} className="py-2 px-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== КЕЙСЫ ===== */}
          {tab === 'cases' && (
            <CasesAdminTab
              cases={cases}
              onAdd={addCase}
              onEdit={editCase}
              onDelete={deleteCase}
              onToggleFeatured={toggleCaseFeatured}
            />
          )}

          {/* ===== ФИНАНСЫ ===== */}
          {tab === 'finance' && <FinanceTab />}
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40, x: 40 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: 20, x: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
            <Bell size={18} className="text-orange-400 dark:text-orange-600" />
            <p className="text-sm font-medium">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ============================================================
ВКЛАДКА КЕЙСОВ
============================================================ */
function CasesAdminTab({
  cases, onAdd, onEdit, onDelete, onToggleFeatured,
}: {
  cases: Case[]
  onAdd: (c: Omit<Case, 'id' | 'createdAt'>) => void
  onEdit: (id: string, u: Partial<Omit<Case, 'id' | 'createdAt'>>) => void
  onDelete: (id: string) => void
  onToggleFeatured: (id: string) => void
}) {
  const emptyMetrics = [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }]
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Case, 'id' | 'createdAt'>>({
    niche: '', title: '', siteName: '', siteUrl: '', city: '',
    before: '', after: '', metrics: emptyMetrics, featured: false,
  })
  const [localToast, setLocalToast] = useState<string | null>(null)

  const featuredCount = cases.filter((c) => c.featured).length

  const showLocalToast = (msg: string) => { setLocalToast(msg); setTimeout(() => setLocalToast(null), 2500) }

  const resetForm = () => {
    setForm({ niche: '', title: '', siteName: '', siteUrl: '', city: '', before: '', after: '', metrics: emptyMetrics, featured: false })
    setEditingId(null)
  }

  const startEdit = (c: Case) => {
    setForm({
      niche: c.niche, title: c.title, siteName: c.siteName, siteUrl: c.siteUrl || '',
      city: c.city, before: c.before, after: c.after,
      metrics: c.metrics.length ? [...c.metrics, ...emptyMetrics].slice(0, 3) : emptyMetrics,
      featured: c.featured,
    })
    setEditingId(c.id)
    if (typeof document !== 'undefined') {
      setTimeout(() => document.getElementById('cases-form-anchor')?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  const updateMetric = (i: number, field: 'value' | 'label', val: string) => {
    setForm((prev) => ({ ...prev, metrics: prev.metrics.map((m, idx) => idx === i ? { ...m, [field]: val } : m) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanMetrics = form.metrics.filter((m) => m.value.trim() && m.label.trim())
    if (!form.niche || !form.title || !form.before || !form.after) { showLocalToast('❌ Заполните обязательные поля'); return }
    const payload = { ...form, metrics: cleanMetrics }
    if (editingId) { onEdit(editingId, payload); showLocalToast('✅ Кейс обновлён') }
    else { onAdd(payload); showLocalToast('✅ Кейс добавлен') }
    resetForm()
  }

  const inputCls = 'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/20'
  const labelCls = 'block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider'

  return (
    <div className="max-w-7xl mx-auto">
      <div id="cases-form-anchor"></div>
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Edit3 size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{editingId ? 'Редактирование кейса' : 'Новый кейс'}</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{editingId ? 'Измените данные и сохраните' : 'Будет доступен для выбора на главную'}</p>
              </div>
            </div>
            {editingId && (
              <button onClick={resetForm} className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 flex items-center justify-center">
                <X size={16} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Ниша *</label>
                <input type="text" value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} required className={inputCls} placeholder="Ремонт квартир" />
              </div>
              <div>
                <label className={labelCls}>Город *</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className={inputCls} placeholder="Москва" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Заголовок кейса *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={120} className={inputCls} placeholder="RemontPro — 67 заявок за месяц" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Название компании *</label>
                <input type="text" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} required className={inputCls} placeholder="RemontPro" />
              </div>
              <div>
                <label className={labelCls}>Ссылка на сайт</label>
                <input type="url" value={form.siteUrl} onChange={(e) => setForm({ ...form, siteUrl: e.target.value })} className={inputCls} placeholder="https://..." />
              </div>
            </div>

            <div>
              <label className={labelCls}>Было (проблема) *</label>
              <textarea value={form.before} onChange={(e) => setForm({ ...form, before: e.target.value })} required rows={3} className={`${inputCls} resize-none`} placeholder="Опишите проблему до работы с нами..." />
            </div>

            <div>
              <label className={labelCls}>Стало (решение и результат) *</label>
              <textarea value={form.after} onChange={(e) => setForm({ ...form, after: e.target.value })} required rows={3} className={`${inputCls} resize-none`} placeholder="Что получили после работы с нами..." />
            </div>

            <div>
              <label className={labelCls}>Метрики (до 3)</label>
              <div className="space-y-2">
                {form.metrics.map((m, i) => (
                  <div key={i} className="grid grid-cols-[1fr_2fr] gap-2">
                    <input type="text" value={m.value} onChange={(e) => updateMetric(i, 'value', e.target.value)} className={inputCls} placeholder="145" />
                    <input type="text" value={m.label} onChange={(e) => updateMetric(i, 'label', e.target.value)} className={inputCls} placeholder="заявок/мес" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Пример: 145 · заявок/мес</p>
            </div>

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl flex items-center justify-center gap-2">
              {editingId ? <><Edit3 size={16} /> Сохранить изменения</> : <><Plus size={16} /> Добавить кейс</>}
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Все кейсы ({cases.length})</h3>
            <div className="flex items-center gap-2">
              <Star size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                На главной: <span className="text-orange-500">{featuredCount}</span> / {MAX_FEATURED}
              </span>
            </div>
          </div>

          {cases.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center">
              <Star size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Кейсов пока нет. Добавьте первый!</p>
            </div>
          ) : (
            cases.map((c) => (
              <motion.div key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden transition-all ${editingId === c.id ? 'border-orange-500 ring-2 ring-orange-200 dark:ring-orange-500/30' : 'border-slate-200 dark:border-slate-800'}`}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded-full uppercase tracking-wider">{c.niche}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1"><MapPin size={10} /> {c.city}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{c.title}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        {c.siteName}
                        {c.siteUrl && <ExternalLink size={10} />}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">{c.after}</p>
                </div>

                <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={c.featured} onChange={() => onToggleFeatured(c.id)}
                      disabled={!c.featured && featuredCount >= MAX_FEATURED}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed" />
                    <span className={`text-xs font-bold flex items-center gap-1 ${c.featured ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      <Star size={12} fill={c.featured ? 'currentColor' : 'none'} /> На главную
                    </span>
                  </label>

                  <div className="flex gap-1.5 ml-auto">
                    <button onClick={() => startEdit(c)} className="py-1.5 px-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-500/20">
                      <Edit3 size={12} /> Ред.
                    </button>
                    <button onClick={() => { if (confirm('Удалить кейс?')) onDelete(c.id) }} className="py-1.5 px-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {localToast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600" />
            <p className="text-sm font-medium">{localToast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}