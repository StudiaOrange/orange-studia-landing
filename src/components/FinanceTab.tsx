// src/components/FinanceTab.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Bell, Wallet, ShieldCheck, FileText, Upload, Send, CheckCircle2,
  Trash2, RussianRuble, Plus, X,
} from 'lucide-react'
import { useBilling, DEPOSIT_AMOUNT, Invoice } from '@/context/BillingContext'

const fmt = (n: number) => n.toLocaleString('ru-RU')

interface PartnerListItem { id: string; fullName: string; email: string; niche?: string }

export default function FinanceTab() {
  const {
    wallets, invoices, notifications, unreadAdmin,
    sendInvoice, writeOffInvoice, markRead,
  } = useBilling()

  const [toast, setToast] = useState<string | null>(null)
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [partnersList, setPartnersList] = useState<PartnerListItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [invForm, setInvForm] = useState({
    partnerId: '', amount: '', description: '', fileName: '', fileData: '',
  })

  useEffect(() => {
    try { setPartnersList(JSON.parse(localStorage.getItem('orange_studia_partners') || '[]')) } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (unreadAdmin > 0) markRead('admin')
  }, []) // eslint-disable-line

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000) }

  const nameOf = (pid: string) => {
    const p = partnersList.find((x) => x.id === pid)
    return p ? `${p.fullName} (${p.email})` : pid
  }

  const adminNotifs = notifications.filter((n) => n.target === 'admin').slice(0, 20)
  const walletList = Object.values(wallets)
  const pendingWriteOffs = invoices.filter((i) => i.status === 'confirmed')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { showToast('❌ Файл до 2 МБ'); return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setInvForm((p) => ({ ...p, fileName: file.name, fileData: ev.target?.result as string }))
      showToast('✅ Файл прикреплён')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const submitInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(invForm.amount)
    if (!invForm.partnerId) { showToast('Выберите партнёра'); return }
    if (!amount || amount <= 0) { showToast('Укажите сумму'); return }
    if (!invForm.fileData) { showToast('Прикрепите файл с заявками'); return }
    const inv = sendInvoice(invForm.partnerId, {
      amount,
      description: invForm.description || 'Оплата подтверждённых заявок',
      fileName: invForm.fileName,
      fileData: invForm.fileData,
    })
    if (inv) {
      showToast('✅ Акт отправлен партнёру')
      setInvForm({ partnerId: '', amount: '', description: '', fileName: '', fileData: '' })
      setShowInvoiceForm(false)
    }
  }

  const handleWriteOff = (inv: Invoice) => {
    const w = wallets[inv.partnerId]
    if (w && w.balance < inv.amount) {
      showToast(`❌ У партнёра на балансе ${fmt(w.balance)} ₽, а нужно ${fmt(inv.amount)} ₽`)
      return
    }
    if (writeOffInvoice(inv.id)) showToast('✅ Сумма списана с баланса партнёра')
    else showToast('❌ Не удалось списать. Проверьте баланс партнёра.')
  }

  const statusMeta = {
    sent: { label: 'Ждёт подтверждения', cls: 'bg-amber-500' },
    confirmed: { label: 'Подтверждён', cls: 'bg-blue-500' },
    written_off: { label: 'Списан', cls: 'bg-emerald-500' },
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Уведомления */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell size={18} className="text-orange-500" /> Уведомления
          </h3>
          {unreadAdmin > 0 && <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadAdmin} новых</span>}
        </div>
        {adminNotifs.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">Уведомлений нет</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
            {adminNotifs.map((n) => (
              <div key={n.id} className={`p-4 flex gap-3 ${!n.read ? 'bg-orange-50/50 dark:bg-orange-500/5' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{n.message}</p>
                  {n.partnerId && <p className="text-[10px] text-slate-400 mt-0.5">{nameOf(n.partnerId)}</p>}
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString('ru-RU')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Балансы партнёров */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet size={18} className="text-blue-500" /> Балансы партнёров
          </h3>
          <button onClick={() => setShowInvoiceForm(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-orange-500/25 hover:shadow-xl">
            <Plus size={15} /> Отправить акт
          </button>
        </div>
        {walletList.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">Партнёров с балансом пока нет</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {walletList.map((w) => (
              <div key={w.partnerId} className="p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{nameOf(w.partnerId)}</p>
                  {w.depositPaid && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck size={11} /> Депозит внесён
                    </span>
                  )}
                </div>
                <p className="font-extrabold text-slate-900 dark:text-white">{fmt(w.balance)} ₽</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Акты, готовые к списанию */}
      {pendingWriteOffs.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-5">
          <p className="font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} /> Подтверждены партнёром — можно списать ({pendingWriteOffs.length})
          </p>
          <div className="space-y-3">
            {pendingWriteOffs.map((inv) => {
              const w = wallets[inv.partnerId]
              const enough = w ? w.balance >= inv.amount : false
              return (
                <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white">{inv.number} · {fmt(inv.amount)} ₽</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {nameOf(inv.partnerId)} · {inv.description}
                    </p>
                    <p className={`text-[11px] font-bold mt-1 ${enough ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      Баланс партнёра: {w ? fmt(w.balance) : 0} ₽ {enough ? '— достаточно' : '— недостаточно'}
                    </p>
                  </div>
                  <button onClick={() => handleWriteOff(inv)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700">
                    <RussianRuble size={13} /> Списать {fmt(inv.amount)} ₽
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Все акты */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-extrabold text-slate-900 dark:text-white">Все акты</h3>
        </div>
        {invoices.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">Актов пока нет</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{inv.number} · {fmt(inv.amount)} ₽</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{nameOf(inv.partnerId)}</p>
                </div>
                <span className={`${statusMeta[inv.status].cls} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                  {statusMeta[inv.status].label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модалка создания акта */}
      {showInvoiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInvoiceForm(false)}></div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <button onClick={() => setShowInvoiceForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText size={18} className="text-orange-500" /> Отправить акт партнёру
            </h3>
            <form onSubmit={submitInvoice} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Партнёр</label>
                <select value={invForm.partnerId} onChange={(e) => setInvForm({ ...invForm, partnerId: e.target.value })} required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500">
                  <option value="">Выберите партнёра</option>
                  {partnersList.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName} — {p.email}</option>
                  ))}
                </select>
              </div>
              <input type="number" min="1" value={invForm.amount} onChange={(e) => setInvForm({ ...invForm, amount: e.target.value })} required
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                placeholder="Сумма за заявки, ₽" />
              <textarea value={invForm.description} onChange={(e) => setInvForm({ ...invForm, description: e.target.value })} rows={2}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 resize-none"
                placeholder="Описание (например: 12 заявок по 450 ₽)" />

              <input ref={fileInputRef} type="file" accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,image/*" onChange={handleFile} className="hidden" />
              {invForm.fileName ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-500/10 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">{invForm.fileName}</span>
                  <button type="button" onClick={() => setInvForm({ ...invForm, fileName: '', fileData: '' })} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-full h-20 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-orange-500 transition-colors">
                  <Upload size={18} className="text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Прикрепить файл с заявками</span>
                </button>
              )}

              <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl flex items-center justify-center gap-2">
                <Send size={16} /> Отправить акт
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600" />
          <p className="text-sm font-medium">{toast}</p>
        </div>
      )}
    </div>
  )
}