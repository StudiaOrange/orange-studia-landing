// src/components/News.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ChevronDown, Newspaper, ArrowRight, CheckCircle } from 'lucide-react'
import { useLeads } from '@/context/LeadsContext'

const STEP = 4

const GRADIENTS = [
  'from-blue-500 via-blue-600 to-cyan-400',
  'from-orange-500 via-amber-500 to-yellow-400',
  'from-violet-500 via-purple-500 to-pink-400',
  'from-emerald-500 via-teal-500 to-cyan-400',
]

export default function News() {
  const { news } = useLeads()
  const [visible, setVisible] = useState(STEP)

  const left = Math.max(0, news.length - visible)
  const hasMore = left > 0
  const isEmpty = news.length === 0

  return (
    <section id="news" className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-500/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-100 dark:bg-orange-500/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-4 border border-blue-100 dark:border-blue-500/30">
            Новости и кейсы
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
            Что нового в студии
          </h2>
          <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Свежие кейсы, обновления и инсайты команды
          </p>
        </motion.div>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 p-10 md:p-14 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
              <Newspaper size={48} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Новостей пока нет</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Следите за обновлениями — скоро здесь появятся свежие кейсы и новости команды.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.slice(0, visible).map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: (i % STEP) * 0.1 }}
                >
                  <Link href={`/news/${item.id}`} className="block h-full group">
                    <article className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-2xl dark:hover:shadow-black/40 overflow-hidden flex flex-col transition-all duration-300 group-hover:-translate-y-2 h-full">
                      {/* Картинка */}
                      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-900">
                        {item.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                            <Newspaper size={48} className="text-white/50 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-900 dark:text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                          Новость
                        </div>
                        <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-900 dark:text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow flex items-center gap-1.5">
                          <Calendar size={11} />
                          <span>
                            {new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>

                      {/* Контент */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3rem]">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3 flex-1">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <User size={12} />
                            {item.author || 'Команда'}
                          </span>
                          <span className="text-orange-500 flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all">
                            Читать <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10 md:mt-14">
              {hasMore ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setVisible((v) => Math.min(v + STEP, news.length))}
                    className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-bold rounded-2xl shadow-lg shadow-blue-500/15 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <span>Смотреть еще новости</span>
                    <ChevronDown size={18} className="animate-bounce" />
                  </motion.button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    Показано {Math.min(visible, news.length)} из {news.length} · осталось {left}
                  </p>
                </>
              ) : news.length > STEP ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 font-medium"
                >
                  <CheckCircle className="text-green-500" size={16} />
                  Показаны все {news.length} новостей
                </motion.p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  )
}