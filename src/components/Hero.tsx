// src/components/Hero.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Bell } from 'lucide-react'
import Image from 'next/image'
import ModalForm from './ModalForm'

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(0)

  const notifications = [
    'Заявка: Ремонт ПК',
    'Заявка: Строительство домов',
    'Заявка: Продажа участков',
    'Заявка: Скупка техники',
    'Заявка: Клининг',
    'Заявка: Ремонт квартир',
    'Заявка: Видеонаблюдение',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % notifications.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const benefits = [
    { text: 'Работаем по депозиту', color: 'text-orange-500' },
    { text: 'Без предоплаты', color: 'text-blue-600 dark:text-blue-400' },
    { text: 'Все условия в договоре', color: 'text-green-600 dark:text-green-400' },
  ]

  return (
    <>
      <section
        id="top"
        className="pt-28 md:pt-36 pb-16 md:pb-24 px-4 bg-gradient-to-br from-blue-50/70 via-white to-orange-50/70 dark:from-slate-950 dark:via-[#0B1220] dark:to-slate-900 relative overflow-hidden"
      >
        {/* Декоративные пятна */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/40 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-200/40 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        {/* Точечная сетка */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.18) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        ></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Пропорция колонок: текст чуть уже, изображение шире */}
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-12 items-center">
            {/* Левая колонка */}
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-2.5 bg-white dark:bg-slate-800/80 px-4 py-2 rounded-full shadow-md border border-blue-100 dark:border-slate-700 mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Performance Marketing
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white mb-6"
              >
                Приведем горячих{' '}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                    клиентов
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-orange-400/25 dark:bg-orange-500/30 -skew-x-12 rounded-sm"></span>
                </span>
                <br />
                в ваш бизнес
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="inline-block mb-8"
              >
                <div className="bg-blue-100/80 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/30 rounded-xl px-5 py-3">
                  <p className="text-sm md:text-base text-blue-800 dark:text-blue-300 font-medium leading-snug">
                    Сайт и настройка рекламы — <span className="font-bold">0 ₽</span>.
                    Вы платите только за лиды.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                {/* ===== КНОПКА: уменьшена на мобильных ===== */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsModalOpen(true)}
                  className="group relative overflow-hidden px-5 py-3 md:px-10 md:py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm md:text-xl font-bold rounded-xl md:rounded-2xl shadow-lg md:shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-shadow flex items-center justify-center space-x-2 md:space-x-3 mx-auto md:mx-0 animate-pulse-slow"
                >
                  <span className="relative z-10">Узнать стоимость заявки</span>
                  <ArrowRight
                    className="relative z-10 group-hover:translate-x-1 transition-transform w-4 h-4 md:w-[22px] md:h-[22px]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3"
              >
                {benefits.map((benefit, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center space-x-2 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-sm rounded-full px-4 py-2"
                  >
                    <CheckCircle className={`${benefit.color} flex-shrink-0`} size={16} />
                    <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {benefit.text}
                    </span>
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Правая колонка — УВЕЛИЧЕННОЕ изображение */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="relative hidden md:block"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="relative rounded-[2rem] p-2 bg-gradient-to-br from-blue-600/25 via-white to-orange-500/25 dark:from-blue-500/30 dark:via-slate-800 dark:to-orange-500/30 shadow-2xl shadow-blue-600/10 dark:shadow-black/40">
                  <div className="relative rounded-[1.6rem] overflow-hidden ring-1 ring-slate-200/70 dark:ring-slate-700">
                    <Image
                      src="/images/headers/hero-image.png"
                      alt="Performance Marketing — привлечение клиентов"
                      width={900}
                      height={1080}
                      className="object-cover w-full h-auto"
                      priority
                    />
                    {/* Затемняющий оверлей в темной теме */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent opacity-0 dark:opacity-100 transition-opacity pointer-events-none z-10"></div>

                    {/* Всплывающие уведомления */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                      <AnimatePresence mode="wait">
                        {currentNotification % 3 === 0 && (
                          <motion.div
                            key="notif-1"
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="absolute top-8 left-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-100 dark:border-slate-700 max-w-[200px]"
                          >
                            <div className="flex items-start space-x-2">
                              <div className="bg-orange-500 rounded-lg p-1.5 flex-shrink-0">
                                <Bell className="text-white" size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                  {notifications[currentNotification]}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Только что</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        {currentNotification % 3 === 1 && (
                          <motion.div
                            key="notif-2"
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="absolute top-1/3 right-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-100 dark:border-slate-700 max-w-[200px]"
                          >
                            <div className="flex items-start space-x-2">
                              <div className="bg-orange-500 rounded-lg p-1.5 flex-shrink-0">
                                <Bell className="text-white" size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                  {notifications[currentNotification]}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Только что</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        {currentNotification % 3 === 2 && (
                          <motion.div
                            key="notif-3"
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="absolute bottom-20 left-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-100 dark:border-slate-700 max-w-[200px]"
                          >
                            <div className="flex items-start space-x-2">
                              <div className="bg-orange-500 rounded-lg p-1.5 flex-shrink-0">
                                <Bell className="text-white" size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                  {notifications[currentNotification]}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Только что</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-400 rounded-full blur-3xl opacity-30 dark:opacity-20 pointer-events-none"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-30 dark:opacity-20 pointer-events-none"></div>
            </motion.div>
          </div>
        </div>
      </section>

      <ModalForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}