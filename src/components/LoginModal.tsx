// src/components/LoginModal.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LogIn, Eye, EyeOff } from 'lucide-react'

export function openLoginModal() {
  window.dispatchEvent(new CustomEvent('open-login-modal'))
}

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  useState(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('open-login-modal', handler)
    return () => window.removeEventListener('open-login-modal', handler)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Имитация входа
    setTimeout(() => {
      setLoading(false)
      alert('Вход выполнен. Перенаправляем в CRM...')
      setIsOpen(false)
      setForm({ email: '', password: '' })
    }, 1200)
  }

  const canSubmit = form.email && form.password

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden pointer-events-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                    <LogIn size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold">Вход в кабинет</h3>
                    <p className="text-blue-200 text-xs mt-0.5">Войдите в CRM Orange Studia</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">Пароль</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      className="w-full px-4 py-3 pr-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Показать пароль"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-slate-600 dark:text-slate-300">Запомнить меня</span>
                  </label>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Забыли пароль?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className={`w-full py-3.5 font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
                    canSubmit && !loading
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Входим...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Войти</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                  Нет аккаунта?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      setTimeout(() => window.dispatchEvent(new CustomEvent('open-register-modal')), 200)
                    }}
                    className="text-orange-600 dark:text-orange-400 hover:underline font-bold"
                  >
                    Зарегистрироваться
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}