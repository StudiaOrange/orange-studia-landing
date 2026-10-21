// src/components/UsersTab.tsx
'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Edit3, KeyRound, Wallet, Ban, CheckCircle2,
  Trash2, Plus, X, ShieldAlert,
} from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  name?: string
  phone?: string
  balance: number
  blocked: boolean
  createdAt: number
}

type ModalMode = null | 'add' | 'edit' | 'password' | 'topup'

const inputCls = 'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500'

export default function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<ModalMode>(null)
  const [target, setTarget] = useState<AdminUser | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', amount: '' })
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/db', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setUsers(Array.isArray(data.users) ? data.users : [])
      }
    } catch (e) {
      console.error('users load error', e)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const show = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const send = async (action: string, payload: any, successMsg: string) => {
    setError(null)
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) { setError(data?.error || 'Ошибка операции'); return false }
      if (Array.isArray(data.users)) setUsers(data.users)
      show(successMsg)
      return true
    } catch {
      setError('Ошибка сети')
      return false
    }
  }

  const openModal = (mode: ModalMode, u: AdminUser | null = null) => {
    setTarget(u)
    setForm({ name: u?.name || '', email: u?.email || '', phone: u?.phone || '', password: '', amount: '' })
    setError(null)
    setModal(mode)
  }

  const submit = async () => {
    if (modal === 'add') {
      if (!form.email.trim() || !form.password) { setError('Заполните почту и пароль'); return }
      const ok = await send('addUser', { email: form.email, password: form.password, name: form.name, phone: form.phone }, '✅ Пользователь создан')
      if (ok) setModal(null)
    } else if (modal === 'edit' && target) {
      if (!form.email.trim()) { setError('Заполните почту'); return }
      const ok = await send('editUser', { id: target.id, email: form.email, name: form.name, phone: form.phone }, '✅ Данные обновлены')
      if (ok) setModal(null)
    } else if (modal === 'password' && target) {
      if (!form.password) { setError('Введите новый пароль'); return }
      const ok = await send('changeUserPassword', { id: target.id, password: form.password }, '✅ Пароль изменён')
      if (ok) setModal(null)
    } else if (modal === 'topup' && target) {
      const amount = Number(form.amount)
      if (!amount) { setError('Введите сумму пополнения'); return }
      const ok = await send('topUpUser', { id: target.id, amount }, `✅ Баланс пополнен на ${amount} ₽`)
      if (ok) setModal(null)
    }
  }

  const filtered = users.filter((u) =>
    `${u.email} ${u.name || ''} ${u.phone || ''}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Панель управления */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">Всего пользователей: {users.length}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Заблокировано: {users.filter((u) => u.blocked).length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск: почта, имя, телефон"
              className="pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 w-56"
            />
          </div>
          <button
            onClick={() => openModal('add')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-shadow"
          >
            <Plus size={15} /> Добавить
          </button>
        </div>
      </div>

      {/* Список пользователей */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Users size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-1">Пользователей пока нет</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Зарегистрированные партнёры появятся здесь автоматически</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all ${u.blocked ? 'border-red-300 dark:border-red-500/40' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {(u.name || u.email)[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{u.name || 'Без имени'}</p>
                      {u.blocked && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold">
                          <Ban size={10} /> Заблокирован
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {u.phone || 'телефон не указан'} · регистрация {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                    {Number(u.balance || 0).toLocaleString('ru-RU')} ₽
                  </div>
                  <button onClick={() => openModal('topup', u)} title="Пополнить баланс"
                    className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-500/20">
                    <Wallet size={15} />
                  </button>
                  <button onClick={() => openModal('edit', u)} title="Редактировать"
                    className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-500/20">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => openModal('password', u)} title="Сменить пароль"
                    className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center hover:bg-violet-100 dark:hover:bg-violet-500/20">
                    <KeyRound size={15} />
                  </button>
                  <button
                    onClick={async () => {
                      const ok = await send('toggleUserBlock', { id: u.id }, u.blocked ? '✅ Пользователь разблокирован' : '⛔ Пользователь заблокирован')
                      if (ok && !u.blocked) show('⛔ Пользователь заблокирован')
                    }}
                    title={u.blocked ? 'Разблокировать' : 'Заблокировать'}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${u.blocked ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20'}`}
                  >
                    {u.blocked ? <CheckCircle2 size={15} /> : <Ban size={15} />}
                  </button>
                  <button
                    onClick={() => { if (confirm(`Удалить пользователя ${u.email}?`)) send('deleteUser', { id: u.id }, '🗑️ Пользователь удалён') }}
                    title="Удалить"
                    className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Модальное окно */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {modal === 'add' && 'Новый пользователь'}
                  {modal === 'edit' && 'Редактирование'}
                  {modal === 'password' && 'Смена пароля'}
                  {modal === 'topup' && 'Пополнение баланса'}
                </h3>
                <button onClick={() => setModal(null)} className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {(modal === 'add' || modal === 'edit') && (
                  <>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Имя" />
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="Email" />
                    <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="Телефон" />
                  </>
                )}
                {(modal === 'add' || modal === 'password') && (
                  <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} placeholder={modal === 'add' ? 'Пароль' : 'Новый пароль'} />
                )}
                {modal === 'topup' && (
                  <>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Текущий баланс: <b>{Number(target?.balance || 0).toLocaleString('ru-RU')} ₽</b>
                    </p>
                    <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputCls} placeholder="Сумма пополнения, ₽" />
                    <div className="flex gap-2 flex-wrap">
                      {[1000, 5000, 10000, 50000].map((v) => (
                        <button key={v} type="button" onClick={() => setForm({ ...form, amount: String(v) })}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700">
                          +{v.toLocaleString('ru-RU')} ₽
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {error && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold">
                    <ShieldAlert size={14} /> {error}
                  </div>
                )}

                <button onClick={submit}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Сохранить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Тост */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600" />
            <p className="text-sm font-medium">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}