// src/context/BillingContext.tsx
'use client'
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { playBell } from './LeadsContext'

export const DEPOSIT_AMOUNT = 50000

/* Тестовый режим ЮKassa. Поставьте true, когда вставите ключи в .env */
const USE_REAL_YOOKASSA = false

export type TxType = 'topup' | 'deposit' | 'writeoff'

export interface Transaction {
  id: string
  partnerId: string
  type: TxType
  amount: number
  description: string
  createdAt: number
}

export type InvoiceStatus = 'sent' | 'confirmed' | 'written_off'

export interface Invoice {
  id: string
  partnerId: string
  number: string
  date: string
  amount: number
  description: string
  fileName: string
  fileData?: string
  status: InvoiceStatus
  createdAt: number
  confirmedAt?: number
  writtenOffAt?: number
}

export type NotifTarget = 'admin' | 'partner'

export type NotifKind =
  | 'deposit_required'
  | 'topup'
  | 'deposit_paid'
  | 'invoice_sent'
  | 'invoice_confirmed'
  | 'invoice_written_off'

export interface Notification {
  id: string
  target: NotifTarget
  partnerId?: string
  kind: NotifKind
  title: string
  message: string
  createdAt: number
  read: boolean
}

export interface Wallet {
  partnerId: string
  balance: number
  depositPaid: boolean
}

interface BillingState {
  wallets: Record<string, Wallet>
  transactions: Transaction[]
  invoices: Invoice[]
  notifications: Notification[]
}

interface BillingValue extends BillingState {
  unreadAdmin: number
  unreadPartner: (partnerId: string) => number
  getWallet: (partnerId: string) => Wallet
  topUp: (partnerId: string, amount: number) => Promise<{ ok: boolean; url?: string; error?: string }>
  payDeposit: (partnerId: string) => boolean
  sendInvoice: (partnerId: string, data: { amount: number; description: string; fileName: string; fileData?: string }) => Invoice | null
  confirmInvoice: (invoiceId: string) => void
  writeOffInvoice: (invoiceId: string) => boolean
  notifyDepositRequired: (partnerId: string, contractNumber: string) => void
  markRead: (target: NotifTarget, partnerId?: string) => void
}

const BillingContext = createContext<BillingValue | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
const KEY = 'orange_studia_billing_v1'
const CHANNEL_NAME = 'orange-studia-billing'
const EMPTY: BillingState = { wallets: {}, transactions: [], invoices: [], notifications: [] }

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BillingState>(EMPTY)
  const [initialized, setInitialized] = useState(false)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const stateRef = useRef<BillingState>(EMPTY)

  const reload = useCallback(() => {
    try {
      const raw = localStorage.getItem(KEY)
      const next = raw ? JSON.parse(raw) : EMPTY
      stateRef.current = next
      setState(next)
    } catch {
      stateRef.current = EMPTY
      setState(EMPTY)
    }
  }, [])

  useEffect(() => {
    reload()
    setInitialized(true)
  }, [reload])

  const commit = useCallback((next: BillingState, notify = true) => {
    stateRef.current = next
    setState(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* quota */
    }
    if (notify && channelRef.current) channelRef.current.postMessage({ type: 'billing-changed' })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return
    const bc = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = bc
    bc.onmessage = (e) => {
      if (e.data?.type === 'billing-changed') reload()
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) reload()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      bc.close()
      channelRef.current = null
      window.removeEventListener('storage', onStorage)
    }
  }, [reload])

  const getWallet = useCallback((partnerId: string): Wallet => {
    return stateRef.current.wallets[partnerId] || { partnerId, balance: 0, depositPaid: false }
  }, [])

  const pushNotification = (s: BillingState, n: Omit<Notification, 'id' | 'createdAt' | 'read'>): BillingState => {
    const notif: Notification = { ...n, id: uid(), createdAt: Date.now(), read: false }
    return { ...s, notifications: [notif, ...s.notifications] }
  }

  const pushTx = (s: BillingState, t: Omit<Transaction, 'id' | 'createdAt'>): BillingState => {
    const tx: Transaction = { ...t, id: uid(), createdAt: Date.now() }
    return { ...s, transactions: [tx, ...s.transactions] }
  }

  /* ===== Пополнение баланса ===== */
  const topUp = useCallback(async (partnerId: string, amount: number) => {
    if (amount < 1000) return { ok: false, error: 'Минимальная сумма пополнения — 1 000 ₽' }
    if (USE_REAL_YOOKASSA) {
      try {
        const res = await fetch('/api/yookassa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, description: 'Пополнение баланса', partnerId }),
        })
        const data = await res.json()
        if (data.testMode) {
          doTopUp(partnerId, amount)
          return { ok: true }
        }
        if (data.confirmationUrl) return { ok: true, url: data.confirmationUrl }
        return { ok: false, error: 'Не удалось создать платёж' }
      } catch {
        return { ok: false, error: 'Ошибка платежа' }
      }
    }
    doTopUp(partnerId, amount)
    return { ok: true }
  }, [])

  const doTopUp = (partnerId: string, amount: number) => {
    let s = stateRef.current
    const w = s.wallets[partnerId] || { partnerId, balance: 0, depositPaid: false }
    s = { ...s, wallets: { ...s.wallets, [partnerId]: { ...w, balance: w.balance + amount } } }
    s = pushTx(s, { partnerId, type: 'topup', amount, description: 'Пополнение баланса через ЮKassa' })
    s = pushNotification(s, {
      target: 'admin',
      partnerId,
      kind: 'topup',
      title: 'Пополнение баланса',
      message: `Партнёр пополнил баланс на ${amount.toLocaleString('ru-RU')} ₽`,
    })
    commit(s)
  }

  /* ===== Оплата депозита ===== */
  const payDeposit = useCallback((partnerId: string): boolean => {
    const s0 = stateRef.current
    const w = s0.wallets[partnerId] || { partnerId, balance: 0, depositPaid: false }
    if (w.depositPaid) return false
    if (w.balance < DEPOSIT_AMOUNT) return false
    let s = { ...s0, wallets: { ...s0.wallets, [partnerId]: { ...w, depositPaid: true } } }
    s = pushTx(s, {
      partnerId,
      type: 'deposit',
      amount: DEPOSIT_AMOUNT,
      description: 'Стартовый депозит внесён (аванс на оплату заявок)',
    })
    s = pushNotification(s, {
      target: 'admin',
      partnerId,
      kind: 'deposit_paid',
      title: 'Депозит внесён ✅',
      message: `Партнёр внёс стартовый депозит ${DEPOSIT_AMOUNT.toLocaleString('ru-RU')} ₽. Средства зарезервированы на балансе для оплаты заявок.`,
    })
    commit(s)
    playBell()
    return true
  }, [commit])

  /* ===== Акт от администратора ===== */
  const sendInvoice = useCallback(
    (partnerId: string, data: { amount: number; description: string; fileName: string; fileData?: string }): Invoice | null => {
      if (data.amount <= 0) return null
      const s0 = stateRef.current
      const num = `АКТ-${new Date().getFullYear()}-${String(s0.invoices.length + 1).padStart(3, '0')}`
      const invoice: Invoice = {
        id: uid(),
        partnerId,
        number: num,
        date: new Date().toISOString().slice(0, 10),
        amount: data.amount,
        description: data.description,
        fileName: data.fileName,
        fileData: data.fileData,
        status: 'sent',
        createdAt: Date.now(),
      }
      let s = { ...s0, invoices: [invoice, ...s0.invoices] }
      s = pushNotification(s, {
        target: 'partner',
        partnerId,
        kind: 'invoice_sent',
        title: 'Новый акт на подтверждение',
        message: `Администратор направил акт ${num} на ${data.amount.toLocaleString('ru-RU')} ₽. Скачайте файл и подтвердите.`,
      })
      commit(s)
      return invoice
    },
    [commit]
  )

  /* ===== Партнёр подтверждает акт ===== */
  const confirmInvoice = useCallback(
    (invoiceId: string) => {
      const s0 = stateRef.current
      const inv = s0.invoices.find((i) => i.id === invoiceId)
      if (!inv || inv.status !== 'sent') return
      let s = {
        ...s0,
        invoices: s0.invoices.map((i) =>
          i.id === invoiceId ? { ...i, status: 'confirmed' as InvoiceStatus, confirmedAt: Date.now() } : i
        ),
      }
      s = pushNotification(s, {
        target: 'admin',
        partnerId: inv.partnerId,
        kind: 'invoice_confirmed',
        title: 'Акт подтверждён ✅',
        message: `Партнёр подтвердил акт ${inv.number} на ${inv.amount.toLocaleString('ru-RU')} ₽. Можно списать.`,
      })
      commit(s)
    },
    [commit]
  )

  /* ===== Админ списывает по подтверждённому акту ===== */
  const writeOffInvoice = useCallback(
    (invoiceId: string): boolean => {
      const s0 = stateRef.current
      const inv = s0.invoices.find((i) => i.id === invoiceId)
      if (!inv || inv.status !== 'confirmed') return false
      const w = s0.wallets[inv.partnerId] || { partnerId: inv.partnerId, balance: 0, depositPaid: false }
      if (w.balance < inv.amount) return false
      let s = {
        ...s0,
        wallets: { ...s0.wallets, [inv.partnerId]: { ...w, balance: w.balance - inv.amount } },
      }
      s = {
        ...s,
        invoices: s.invoices.map((i) =>
          i.id === invoiceId ? { ...i, status: 'written_off' as InvoiceStatus, writtenOffAt: Date.now() } : i
        ),
      }
      s = pushTx(s, {
        partnerId: inv.partnerId,
        type: 'writeoff',
        amount: inv.amount,
        description: `Оплата заявок по акту ${inv.number}`,
      })
      s = pushNotification(s, {
        target: 'partner',
        partnerId: inv.partnerId,
        kind: 'invoice_written_off',
        title: 'Списание произведено',
        message: `С баланса списано ${inv.amount.toLocaleString('ru-RU')} ₽ по акту ${inv.number}.`,
      })
      commit(s)
      return true
    },
    [commit]
  )

  /* ===== Уведомление о депозите при сохранении договора ===== */
  const notifyDepositRequired = useCallback(
    (partnerId: string, contractNumber: string) => {
      let s = stateRef.current
      if (!s.wallets[partnerId]) {
        s = { ...s, wallets: { ...s.wallets, [partnerId]: { partnerId, balance: 0, depositPaid: false } } }
      }
      s = pushNotification(s, {
        target: 'admin',
        partnerId,
        kind: 'deposit_required',
        title: 'Требуется стартовый депозит',
        message: `По договору ${contractNumber} необходимо внести стартовый депозит ${DEPOSIT_AMOUNT.toLocaleString('ru-RU')} ₽.`,
      })
      commit(s)
    },
    [commit]
  )

  const markRead = useCallback(
    (target: NotifTarget, partnerId?: string) => {
      const s0 = stateRef.current
      const next = s0.notifications.map((n) =>
        n.target === target && (target === 'admin' || !partnerId || n.partnerId === partnerId)
          ? { ...n, read: true }
          : n
      )
      commit({ ...s0, notifications: next }, false)
    },
    [commit]
  )

  const unreadAdmin = state.notifications.filter((n) => n.target === 'admin' && !n.read).length
  const unreadPartner = (partnerId: string) =>
    state.notifications.filter((n) => n.target === 'partner' && n.partnerId === partnerId && !n.read).length

  return (
    <BillingContext.Provider
      value={{
        ...state,
        unreadAdmin,
        unreadPartner,
        getWallet,
        topUp,
        payDeposit,
        sendInvoice,
        confirmInvoice,
        writeOffInvoice,
        notifyDepositRequired,
        markRead,
      }}
    >
      {children}
    </BillingContext.Provider>
  )
}

export const useBilling = () => {
  const ctx = useContext(BillingContext)
  if (!ctx) throw new Error('useBilling must be used inside BillingProvider')
  return ctx
}