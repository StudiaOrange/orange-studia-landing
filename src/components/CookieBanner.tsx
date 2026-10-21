// src/components/CookieBanner.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie } from 'lucide-react'
import { openLegalModal } from './LegalModals'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && !localStorage.getItem('cookiesAccepted')) {
        setIsVisible(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Cookie className="text-orange-500" size={18} />
                </div>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Мы используем cookie-файлы для улучшения работы сайта. Продолжая
                  использование, вы соглашаетесь с{' '}
                  <button
                    type="button"
                    onClick={() => openLegalModal('privacy')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Политикой конфиденциальности
                  </button>
                  .
                </p>
              </div>
              <button
                onClick={handleAccept}
                aria-label="Закрыть уведомление"
                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <button
              onClick={handleAccept}
              className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Согласен
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}