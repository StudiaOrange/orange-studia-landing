'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react'
import { CaseStudy } from '@/data/cases'

interface CaseModalProps {
  caseData: CaseStudy
  onClose: () => void
}

export default function CaseModal({ caseData, onClose }: CaseModalProps) {
  // Блокируем скролл страницы при открытой модалке
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="min-h-full flex items-center justify-center p-4 md:p-8"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full relative overflow-hidden">
            {/* Шапка модалки */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 md:p-8 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>
              <p className="text-blue-200 text-sm font-medium mb-2">Кейс • {caseData.city}</p>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-1">{caseData.title}</h3>
              <div className="flex items-center space-x-2 text-blue-100 text-sm">
                <Globe size={14} />
                <span>{caseData.siteName.toLowerCase()}.ru</span>
              </div>
            </div>

            {/* Контент модалки */}
            <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
              {/* Метрики */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {caseData.metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100"
                  >
                    <p className="text-xl md:text-2xl font-extrabold text-blue-600 mb-1">{metric.value}</p>
                    <p className="text-xs text-slate-600">{metric.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Проблема */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="text-red-500" size={20} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Проблема</h4>
                </div>
                <p className="text-slate-700 leading-relaxed pl-0 md:pl-13">{caseData.problem}</p>
              </motion.div>

              {/* Решение */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="text-blue-600" size={20} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Решение</h4>
                </div>
                <p className="text-slate-700 leading-relaxed">{caseData.solution}</p>
              </motion.div>

              {/* Результат */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Результат</h4>
                </div>
                <p className="text-slate-700 leading-relaxed">{caseData.result}</p>
              </motion.div>
            </div>

            {/* Футер модалки */}
            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-600 text-center sm:text-left">
                Хотите такой же результат в своей нише?
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all whitespace-nowrap"
              >
                Закрыть кейс
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}