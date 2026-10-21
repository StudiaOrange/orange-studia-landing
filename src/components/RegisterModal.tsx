// src/components/RegisterModal.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, Check, Mail } from 'lucide-react'
import { openLegalModal } from './LegalModals'
import { usePartner } from '@/context/PartnerContext'

export function openRegisterModal() {
  window.dispatchEvent(new CustomEvent('open-register-modal'))
}

export default function RegisterModal() {
  const { register } = usePartner()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    niche: '', fullName: '', email: '', phone: '', password: '',
    privacy: false, terms: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.privacy || !form.terms) {
      alert('Необходимо принять оба документа')
      return
    }
    if (!form.password || form.password.length < 6) {
      alert('Пароль должен содержать минимум 6 символов')
      return
    }
    setLoading(true)
    register(
      {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        niche: form.niche,
        password: form.password,
      },
      form.password,
    )
    // Ждём, пока PartnerContext создаст пользователя и войдёт
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setSubmitted(false)
        setForm({ niche: '', fullName: '', email: '', phone: '', password: '', privacy: false, terms: false })
      }, 2000)
    }, 1500)
  }

  const close = () => { if (!submitted && !loading) setIsOpen(false) }

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('open-register-modal', handler)
    return () => window.removeEventListener('open-register-modal', handler)
  }, [])

  const canSubmit = form.niche && form.fullName && form.email && form.phone && form.password && form.privacy && form.terms

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden pointer-events-auto my-8">
              {!submitted ? (
                <>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
                    <button onClick={close} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
                      <X size={18} />
                    </button>
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                        <UserPlus size={22} />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold">Регистрация</h3>
                        <p className="text-orange-100 text-xs mt-0.5">Создайте аккаунт партнёра</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="text" value={form.niche} onChange={(e) => handleChange('niche', e.target.value)} required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30"
                      placeholder="Ниша бизнеса" />
                    <input type="text" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30"
                      placeholder="ФИО" />
                    <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30"
                      placeholder="E-mail" />
                    <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30"
                      placeholder="+7 (999) 000-00-00" />
                    <input type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} required minLength={6}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30"
                      placeholder="Придумайте пароль (мин. 6 символов)" />
                    <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <CheckboxRow checked={form.privacy} onChange={(v) => handleChange('privacy', v)}
                        label={<>Принимаю <button type="button" onClick={(e) => { e.stopPropagation(); openLegalModal('privacy') }} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Политику конфиденциальности</button></>} />
                      <CheckboxRow checked={form.terms} onChange={(v) => handleChange('terms', v)}
                        label={<>Принимаю <button type="button" onClick={(e) => { e.stopPropagation(); openLegalModal('terms') }} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Пользовательское соглашение</button></>} />
                    </div>
                    <button type="submit" disabled={!canSubmit || loading}
                      className={`w-full py-3.5 font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
                        canSubmit && !loading ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}>
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Создаём аккаунт...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={18} />
                          <span>Зарегистрироваться</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                      Запомните пароль — он понадобится для входа в кабинет
                    </p>
                  </form>
                </>
              ) : (
                <div className="p-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                    <Check size={32} className="text-white" />
                  </motion.div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Успешно!</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center justify-center space-x-2">
                    <Mail size={16} />
                    <span>Вы вошли в кабинет как {form.email}</span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CheckboxRow({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode }) {
  return (
    <label className="flex items-start space-x-3 cursor-pointer select-none group">
      <div className="relative mt-0.5 flex-shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
          checked ? 'bg-orange-500 border-orange-500' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-orange-400'
        }`}>
          {checked && <Check size={14} className="text-white" strokeWidth={3} />}
        </div>
      </div>
      <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{label}</span>
    </label>
  )
}