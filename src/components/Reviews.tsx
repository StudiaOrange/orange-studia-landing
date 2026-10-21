// src/components/Reviews.tsx
'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { reviews, Review } from '@/data/reviews'

const STEP = 4

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={15}
          className={
            i <= rating
              ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
              : 'text-slate-200 dark:text-slate-600 fill-slate-200 dark:fill-slate-600'
          }
        />
      ))}
      <span className="ml-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">{rating}.0</span>
    </div>
  )
}

const gradients = [
  'from-blue-500 to-cyan-400',
  'from-orange-500 to-amber-400',
  'from-green-500 to-emerald-400',
  'from-violet-500 to-purple-400',
  'from-pink-500 to-rose-400',
]

function Avatar({ review, index }: { review: Review; index: number }) {
  const [failed, setFailed] = useState(false)
  const initials = review.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  if (review.image && !failed) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={review.image}
        alt={review.name}
        onError={() => setFailed(true)}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-md group-hover:ring-orange-400 group-hover:scale-105 transition-all duration-300 flex-shrink-0"
      />
    )
  }
  return (
    <div
      className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-slate-700 group-hover:ring-orange-400 group-hover:scale-105 transition-all duration-300 flex-shrink-0`}
    >
      {initials}
    </div>
  )
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: (index % STEP) * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-slate-800/50 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-2xl dark:hover:shadow-black/40 p-4 sm:p-5 md:p-6 flex flex-col overflow-hidden transition-shadow duration-300"
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
          review.rating >= 5
            ? 'from-green-500 to-emerald-400'
            : review.rating >= 4
            ? 'from-amber-400 to-orange-400'
            : 'from-red-400 to-rose-400'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>
      <Quote
        size={40}
        fill="currentColor"
        className="absolute top-4 right-4 text-slate-100 dark:text-slate-700/50 group-hover:text-orange-100 dark:group-hover:text-orange-500/20 transition-colors duration-300"
      />
      <div className="flex items-center space-x-3 mb-3 relative">
        <Avatar review={review} index={index} />
        <div className="min-w-0">
          <p className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight truncate">{review.name}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{review.role} · {review.company}</p>
        </div>
      </div>
      <div className="mb-3 relative"><Stars rating={review.rating} /></div>
      <p className="text-xs md:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed relative flex-1 break-words">
        {review.text}
      </p>
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between relative gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">{review.city}</span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
            review.rating >= 5
              ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
              : review.rating >= 4
              ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
              : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          {review.rating >= 5 ? 'Рекомендует' : review.rating >= 4 ? 'С оговорками' : 'Опытный клиент'}
        </span>
      </div>
    </motion.article>
  )
}

export default function Reviews() {
  const [visible, setVisible] = useState(STEP)
  const sectionRef = useRef<HTMLElement>(null)
  const left = reviews.length - visible
  const isExpanded = visible > STEP

  const handleCollapse = () => {
    setVisible(STEP)
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-14 md:py-20 lg:py-24 px-3 sm:px-4 bg-gradient-to-b from-white dark:from-[#0B1220] to-slate-50 dark:to-slate-900/60 relative overflow-hidden scroll-mt-24"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-3 sm:mb-4 border border-amber-100 dark:border-amber-500/30">
            Отзывы
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 break-words">
            Что говорят партнеры
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 break-words">
            15 честных отзывов — включая неидеальные
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reviews.slice(0, visible).map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            {/* Показать еще — компактная на мобильных */}
            {left > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setVisible((v) => Math.min(v + STEP, reviews.length))}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border-2 border-orange-500 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-orange-500/15 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white hover:border-transparent transition-all duration-300 flex items-center space-x-2 whitespace-nowrap"
              >
                <span>Посмотреть ещё отзывы</span>
                <ChevronDown size={16} className="animate-bounce" />
              </motion.button>
            )}
            {/* Свернуть — компактная на мобильных */}
            {isExpanded && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCollapse}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center space-x-2 whitespace-nowrap"
              >
                <span>Свернуть отзывы</span>
                <ChevronUp size={16} />
              </motion.button>
            )}
          </div>
          {left > 0 ? (
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-3">
              Показано {visible} из {reviews.length} · осталось {left}
            </p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 font-medium mt-3"
            >
              <CheckCircle className="text-green-500" size={16} />
              Показаны все {reviews.length} отзывов
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}