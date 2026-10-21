// src/components/ModalForm.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Check } from 'lucide-react'
import { openLegalModal } from './LegalModals'
import { useLeads } from '@/context/LeadsContext'

interface ModalFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function ModalForm({ isOpen, onClose }: ModalFormProps) {
  const { addLead } = useLeads()
  const [formData, setFormData] = useState({
    niche: '',
    name: '',
    phone: '',
    agree: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agree) {
      alert('Пожалуйста, примите политику конфиденциальности и пользовательское соглашение')
      return
    }
    addLead({
      source: 'modal',
      data: {
        name: formData.name,
        phone: formData.phone,
        niche: formData.niche,
      },
    })
    alert('Спасибо! Мы свяжемся с вами и пришлем расчет стоимости лида в вашей нише.')
    setFormData({ niche: '', name: '', phone: '', agree: false })
    onClose()
  }

  const canSubmit = formData.niche && formData.name && formData.phone && formData.agree

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative pointer-events-auto">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={22} />
              </button>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                  Узнать стоимость заявки
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Оставьте контакты — рассчитаем цену лида в вашей нише
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30 transition-all"
                  placeholder="Ваша ниша (например: Ремонт квартир)"
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30 transition-all"
                  placeholder="Ваше имя"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30 transition-all"
                  placeholder="+7 (999) 000-00-00"
                />
                <label className="flex items-start space-x-3 cursor-pointer select-none group">
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.agree}
                      onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                        formData.agree
                          ? 'bg-orange-500 border-orange-500'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-orange-400'
                      }`}
                    >
                      {formData.agree && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Я согласен с{' '}
                    <button
                      type="button"
                      onClick={() => openLegalModal('privacy')}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      политикой конфиденциальности
                    </button>{' '}
                    и{' '}
                    <button
                      type="button"
                      onClick={() => openLegalModal('terms')}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      пользовательским соглашением
                    </button>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full py-4 text-lg font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
                    canSubmit
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Обсудить партнерство</span>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}