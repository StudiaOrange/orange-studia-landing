// src/app/register/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Briefcase, UserPlus, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'
import { usePartner } from '@/context/PartnerContext'
import { openLegalModal } from '@/components/LegalModals'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = usePartner()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    niche: '',
    password: '',
    privacy: false,
    terms: false,
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.privacy || !form.terms) {
      setError('Необходимо принять оба документа')
      return
    }
    if (form.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }

    setLoading(true)
    setTimeout(() => {
      register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        niche: form.niche,
      })
      setLoading(false)
      router.push('/dashboard')
    }, 600)
  }

  const canSubmit = form.fullName && form.email && form.phone && form.niche && form.password && form.privacy && form.terms

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        {/* Лого */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-extrabold text-white text-3xl shadow-2xl shadow-orange-500/30 mb-4">
            O
          </div>
          <h1 className="text-2xl font-extrabold text-white">Orange Studia</h1>
          <p className="text-sm text-slate-400 mt-1">Создайте аккаунт партнёра</p>
        </div>

        {/* Форма */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-7 md:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <UserPlus size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Регистрация</h2>
              <p className="text-xs text-slate-400">Получите доступ к личному кабинету</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ФИО */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">ФИО</label>
              <div className="relative">
                <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="Иванов Иван Иванович"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Телефон */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Телефон</label>
              <div className="relative">
                <Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="+7 (999) 000-00-00"
                />
              </div>
            </div>

            {/* Ниша */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Ниша бизнеса</label>
              <div className="relative">
                <Briefcase size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.niche}
                  onChange={(e) => handleChange('niche', e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="Например: Ремонт квартир"
                />
              </div>
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Пароль</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-11 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="Минимум 6 символов"
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

            {/* Чекбоксы */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <label className="flex items-start space-x-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={form.privacy}
                  onChange={(e) => handleChange('privacy', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-white/5 text-orange-500 focus:ring-orange-500/30"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  Принимаю{' '}
                  <button
                    type="button"
                    onClick={() => openLegalModal('privacy')}
                    className="text-orange-400 hover:underline font-medium"
                  >
                    Политику конфиденциальности
                  </button>
                </span>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => handleChange('terms', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-white/5 text-orange-500 focus:ring-orange-500/30"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  Принимаю{' '}
                  <button
                    type="button"
                    onClick={() => openLegalModal('terms')}
                    className="text-orange-400 hover:underline font-medium"
                  >
                    Пользовательское соглашение
                  </button>
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Регистрация...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Зарегистрироваться</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-bold">
                Войти
              </Link>
            </p>
          </div>
        </div>

        {/* Назад */}
        <div className="mt-6 flex items-center justify-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={14} /> На главную
          </Link>
        </div>
      </motion.div>
    </div>
  )
}