// src/components/AdminAuth.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, User, LogIn, Eye, EyeOff, ShieldAlert } from 'lucide-react'

const ADMIN_LOGIN = 'admin'
const ADMIN_PASSWORD = 'orange2026'
const SESSION_KEY = 'orange_studia_admin_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 дней

export function checkAdminSession(): boolean {
  if (typeof window === 'undefined') return false
  const session = localStorage.getItem(SESSION_KEY)
  if (!session) return false
  try {
    const { token, expires } = JSON.parse(session)
    if (token === btoa(`${ADMIN_LOGIN}:${ADMIN_PASSWORD}`) && expires > Date.now()) {
      return true
    }
    localStorage.removeItem(SESSION_KEY)
    return false
  } catch {
    return false
  }
}

export function createAdminSession() {
  const token = btoa(`${ADMIN_LOGIN}:${ADMIN_PASSWORD}`)
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ token, expires: Date.now() + SESSION_DURATION })
  )
}

export function clearAdminSession() {
  localStorage.removeItem(SESSION_KEY)
}

export default function AdminAuth() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (login.trim() === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
        createAdminSession()
        window.location.reload()
      } else {
        setError('Неверный логин или пароль')
        setShake(true)
        setTimeout(() => setShake(false), 500)
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Декоративные пятна */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: shake ? [0, -10, 10, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.5, x: { duration: 0.4 } }}
        className="relative w-full max-w-md"
      >
        {/* Лого сверху */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-extrabold text-white text-3xl shadow-2xl shadow-orange-500/30 mb-4">
            O
          </div>
          <h1 className="text-2xl font-extrabold text-white">Orange Studia</h1>
          <p className="text-sm text-slate-400 mt-1">Панель управления</p>
        </div>

        {/* Форма */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-7 md:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ShieldAlert size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Вход в систему</h2>
              <p className="text-xs text-slate-400">Доступ только для администраторов</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Логин
              </label>
              <div className="relative">
                <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Пароль
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-11 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/15 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 flex items-center gap-2"
                >
                  <ShieldAlert size={16} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Проверка...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Войти в админку</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/10 flex items-start gap-2 text-[11px] text-slate-400">
            <ShieldAlert size={14} className="flex-shrink-0 mt-0.5 text-orange-400" />
            <p className="leading-relaxed">
              Все действия в админке логируются. Несанкционированный доступ запрещен.
            </p>
          </div>
        </div>

        {/* Подсказка под формой (для вас) */}
        <div className="mt-5 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-[11px] text-blue-200 text-center">
          💡 <span className="font-bold">Подсказка:</span> логин <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono">admin</code>, пароль <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono">orange2026</code>
        </div>
      </motion.div>
    </div>
  )
}