// src/components/Cases.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowDown, X, Globe, XCircle, CheckCircle, MapPin, ExternalLink } from 'lucide-react'
import { useLeads, Case } from '@/context/LeadsContext'

const MAX_VISIBLE = 4

export default function Cases() {
  const { cases } = useLeads()
  const [selected, setSelected] = useState<Case | null>(null)

  // Берём только featured-кейсы, максимум 4
  const visibleCases = cases.filter((c) => c.featured).slice(0, MAX_VISIBLE)

  return (
    <section id="cases" className="py-14 md:py-20 lg:py-24 px-3 sm:px-4 bg-white dark:bg-[#0B1220] relative overflow-hidden">
      {/* Декоративные пятна */}
      <div className="absolute top-0 left-0 w-72 md:w-96 h-72 md:h-96 bg-orange-100 dark:bg-orange-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-72 md:w-96 h-72 md:h-96 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-3 sm:mb-4 border border-orange-100 dark:border-orange-500/30">
            Кейсы и результаты
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 break-words">
            Результаты наших партнеров
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-3 break-words">
            Проблема, решение, цифры — все как есть
          </p>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Нажмите «Подробнее», чтобы увидеть полную историю каждого проекта.
          </p>
        </motion.div>

        {visibleCases.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 dark:text-slate-400">Кейсы скоро появятся</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {visibleCases.map((caseItem, i) => (
              <CaseCard key={caseItem.id} caseItem={caseItem} index={i} onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <CaseModal caseItem={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}

/* ===== КАРТОЧКА КЕЙСА С АНИМИРОВАННОЙ ПОДСВЕТКОЙ ===== */
function CaseCard({ caseItem, index, onSelect }: { caseItem: Case; index: number; onSelect: (c: Case) => void }) {
  const gradients = [
    'from-orange-500 via-amber-500 to-yellow-400',
    'from-blue-500 via-cyan-500 to-teal-400',
    'from-violet-500 via-purple-500 to-pink-400',
    'from-emerald-500 via-green-500 to-teal-400',
  ]
  const gradient = gradients[index % gradients.length]

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={() => onSelect(caseItem)}
      className="group relative cursor-pointer rounded-2xl p-[2px] transition-all duration-500 hover:shadow-2xl dark:hover:shadow-orange-500/20"
    >
      {/* Анимированный градиентный бордер при наведении */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>

      {/* Внутренняя карточка */}
      <div className="relative h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 group-hover:border-transparent transition-colors duration-500 flex flex-col">
        {/* Градиентная шапка с номером кейса */}
        <div className={`relative bg-gradient-to-br ${gradient} p-4 sm:p-5 overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <div className="relative flex items-start justify-between gap-2">
            <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white/30 leading-none select-none">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="px-2 sm:px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/30 whitespace-nowrap">
              {caseItem.niche}
            </span>
          </div>
          <h3 className="relative mt-2 sm:mt-3 text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] break-words">
            {caseItem.title}
          </h3>
        </div>

        {/* Контент */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col">
          {/* Компания и город */}
          <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3 pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white truncate">{caseItem.siteName}</p>
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 flex-shrink-0">
              <MapPin size={9} /> {caseItem.city}
            </span>
          </div>

          {/* Было */}
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/25 rounded-lg sm:rounded-xl p-2 sm:p-2.5 mb-2">
            <div className="flex items-center gap-1.5 mb-1">
              <XCircle className="text-red-500 dark:text-red-400 flex-shrink-0" size={11} />
              <p className="text-[8px] sm:text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Было</p>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 leading-snug line-clamp-3 break-words">{caseItem.before}</p>
          </div>

          {/* Стрелка вниз */}
          <div className="flex justify-center my-0.5 sm:my-1">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow flex items-center justify-center">
              <ArrowDown className="text-orange-500" size={9} />
            </div>
          </div>

          {/* Стало */}
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/25 rounded-lg sm:rounded-xl p-2 sm:p-2.5 mb-2.5 sm:mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={11} />
              <p className="text-[8px] sm:text-[9px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Стало</p>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 leading-snug line-clamp-3 break-words">{caseItem.after}</p>
          </div>

          {/* Метрики-чипсы */}
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-3">
            {caseItem.metrics.slice(0, 2).map((m, i) => (
              <span key={i} className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-200">
                <span className="text-blue-600 dark:text-blue-400">{m.value}</span> {m.label}
              </span>
            ))}
          </div>

          {/* Кнопка */}
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(caseItem) }}
            className="mt-auto w-full py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-1 sm:gap-1.5 group/btn"
          >
            <span>Подробнее</span>
            <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

/* ===== МОДАЛКА ДЕТАЛЕЙ КЕЙСА — компактные метрики ===== */
function CaseModal({ caseItem, onClose }: { caseItem: Case; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap">
              {caseItem.niche}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin size={10} /> {caseItem.city}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 break-words">
            {caseItem.title}
          </h2>
          <div className="flex items-center gap-2 mb-4 sm:mb-6 flex-wrap">
            <Globe size={13} className="text-blue-500" />
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">{caseItem.siteName}</span>
            {caseItem.siteUrl && (
              <a
                href={caseItem.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Перейти на сайт <ExternalLink size={10} />
              </a>
            )}
          </div>

          {/* Было */}
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/25 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="text-red-500 flex-shrink-0" size={16} />
              <p className="text-[10px] sm:text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Было</p>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words">{caseItem.before}</p>
          </div>

          {/* Стрелка */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <ArrowDown className="text-white" size={16} />
            </div>
          </div>

          {/* Стало */}
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/25 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={16} />
              <p className="text-[10px] sm:text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Стало</p>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words">{caseItem.after}</p>
          </div>

          {/* МЕТРИКИ — компактные, в одну строку на мобильных */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {caseItem.metrics.map((m, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center">
                <p className="text-base sm:text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-0.5 sm:mb-1 break-words">
                  {m.value}
                </p>
                <p className="text-[8px] sm:text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold leading-tight break-words">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}