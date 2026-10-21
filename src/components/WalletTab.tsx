// src/components/WalletTab.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet, ShieldCheck, ShieldAlert, Download, CheckCircle,
  FileText, CreditCard, Clock, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { usePartner } from '@/context/PartnerContext'
import { useBilling, DEPOSIT_AMOUNT, Invoice } from '@/context/BillingContext'

const fmt = (n: number) => n.toLocaleString('ru-RU')

export default function WalletTab() {
  const { partner } = usePartner()
  const { getWallet, transactions, invoices, topUp, payDeposit, confirmInvoice, markRead, unreadPartner } = useBilling()
  const [topUpAmount, setTopUpAmount] = useState('50000')
  const [processing, setProcessing] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (partner && unreadPartner(partner.id) > 0) markRead('partner', partner.id)
  }, []) // eslint-disable-line

  if (!partner) return null
  const wallet = getWallet(partner.id)
  const myTx = transactions.filter((t) => t.partnerId === partner.id)
  const myInvoices = invoices.filter((i) => i.partnerId === partner.id)
  const pendingInvoices = myInvoices.filter((i) => i.status === 'sent')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000) }

  const handleTopUp = async () => {
    const amount = Number(topUpAmount)
    if (!amount || amount < 1000) { showToast('Минимум 1 000 ₽'); return }
    setProcessing(true)
    const res = await topUp(partner.id, amount)
    setProcessing(false)
    if (res.ok && res.url) {
      window.open(res.url, '_blank')
      showToast('Перенаправляем в ЮKassa…')
    } else if (res.ok) {
      showToast('✅ Баланс пополнен (тестовый режим)')
    } else {
      showToast(res.error || 'Ошибка')
    }
  }

  const handlePayDeposit = () => {
    if (payDeposit(partner.id)) showToast('✅ Депозит внесён! Гарантированный платёж активирован.')
    else showToast('Недостаточно средств: на балансе должно быть не меньше 50 000 ₽')
  }

  const downloadFile = (inv: Invoice) => {
    if (!inv.fileData) { showToast('Файл не прикреплён'); return }
    const a = document.createElement('a')
    a.href = inv.fileData
    a.download = inv.fileName || 'act'
    a.click()
  }

  const statusMeta = {
    sent: { label: 'Ждёт подтверждения', cls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    confirmed: { label: 'Подтверждён', cls: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    written_off: { label: 'Оплачен', cls: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Баланс + депозит */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Баланс */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-2 mb-2 text-blue-100"><Wallet size={16} /><p className="text-xs font-bold uppercase tracking-wider">Баланс</p></div>
          <p className="text-4xl font-extrabold mb-4">{fmt(wallet.balance)} ₽</p>
          <div className="flex gap-2">
            <input type="number" min="1000" step="1000" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-100 text-sm focus:outline-none focus:border-white"
              placeholder="Сумма, ₽" />
            <button onClick={handleTopUp} disabled={processing}
              className="px-4 py-2.5 bg-white text-blue-600 font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-blue-50 transition-colors disabled:opacity-60">
              {processing ? <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span> : <CreditCard size={16} />}
              Пополнить
            </button>
          </div>
          <p className="text-[10px] text-blue-100 mt-2">Оплата через ЮKassa. Минимум 1 000 ₽.</p>
        </motion.div>

        {/* Депозит */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 border shadow-sm ${wallet.depositPaid
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
          <div className="flex items-center gap-2 mb-2">
            {wallet.depositPaid
              ? <ShieldCheck size={18} className="text-emerald-500" />
              : <ShieldAlert size={18} className="text-amber-500" />}
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Стартовый депозит</p>
          </div>
          {wallet.depositPaid ? (
            <>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">Гарантированный платёж внесён</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Депозит {fmt(DEPOSIT_AMOUNT)} ₽ активирован. Эти средства находятся на вашем балансе и расходуются на оплату подтверждённых заявок.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                <CheckCircle size={13} /> Внесён
              </span>
            </>
          ) : (
            <>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{fmt(DEPOSIT_AMOUNT)} ₽</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Пополните баланс минимум на {fmt(DEPOSIT_AMOUNT)} ₽ и внесите депозит. Средства останутся на балансе и пойдут на оплату заявок.
              </p>
              <button onClick={handlePayDeposit}
                disabled={wallet.balance < DEPOSIT_AMOUNT}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed">
                Внести депозит
              </button>
              {wallet.balance < DEPOSIT_AMOUNT && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2">
                  Пополните баланс ещё на {fmt(DEPOSIT_AMOUNT - wallet.balance)} ₽, чтобы внести депозит.
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Акты на подтверждение */}
      {pendingInvoices.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5">
          <p className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
            <FileText size={16} /> Акты, ожидающие вашего подтверждения ({pendingInvoices.length})
          </p>
          <div className="space-y-3">
            {pendingInvoices.map((inv) => (
              <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white">{inv.number} · {fmt(inv.amount)} ₽</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{inv.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => downloadFile(inv)} className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700">
                    <Download size={13} /> Скачать файл
                  </button>
                  <button onClick={() => { confirmInvoice(inv.id); showToast('✅ Акт подтверждён. Администратор уведомлён.') }}
                    className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600">
                    <CheckCircle size={13} /> Подтвердить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* История актов */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-extrabold text-slate-900 dark:text-white">История актов</h3>
        </div>
        {myInvoices.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">Актов пока нет</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {myInvoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{inv.number}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{inv.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-white">{fmt(inv.amount)} ₽</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusMeta[inv.status].cls}`}>{statusMeta[inv.status].label}</span>
                  {inv.fileData && (
                    <button onClick={() => downloadFile(inv)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-500">
                      <Download size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* История операций */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-extrabold text-slate-900 dark:text-white">История операций</h3>
        </div>
        {myTx.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">Операций пока нет</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {myTx.map((tx) => {
              const isTopUp = tx.type === 'topup'
              const isWriteOff = tx.type === 'writeoff'
              const isDeposit = tx.type === 'deposit'
              return (
                <div key={tx.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isTopUp ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'
                        : isWriteOff ? 'bg-red-50 dark:bg-red-500/10 text-red-500'
                        : 'bg-blue-50 dark:bg-blue-500/10 text-blue-500'
                    }`}>
                      {isTopUp ? <ArrowUpRight size={16} /> : isWriteOff ? <ArrowDownRight size={16} /> : <ShieldCheck size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{tx.description}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> {new Date(tx.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <p className={`font-extrabold ${
                    isTopUp ? 'text-emerald-600 dark:text-emerald-400'
                      : isWriteOff ? 'text-red-500'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {isTopUp ? '+' : isWriteOff ? '−' : ''}{fmt(tx.amount)} ₽{isDeposit ? ' (депозит)' : ''}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-400 dark:text-emerald-600" />
          <p className="text-sm font-medium">{toast}</p>
        </div>
      )}
    </div>
  )
}