// src/components/Timeline.tsx
'use client'
import { motion } from 'framer-motion'
import {
  Search,
  Package,
  Settings,
  Rocket,
  ArrowRight,
  CalendarClock,
} from 'lucide-react'

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Анализ',
    period: 'День 1–3',
    desc: 'Проверяем рентабельность ниши, согласовываем KPI и фиксируем стоимость целевой заявки.',
    gradient: 'from-blue-600 to-cyan-500',
    shadow: 'shadow-blue-600/25',
    pill: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30',
  },
  {
    icon: Package,
    step: '02',
    title: 'Упаковка',
    period: '7–14 дней',
    desc: 'Глубокая разработка: создаем высококонверсионный лендинг, снимаем промо-видео, пишем продающие тексты.',
    gradient: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/25',
    pill: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30',
  },
  {
    icon: Settings,
    step: '03',
    title: 'Настройка',
    period: '3–5 дней',
    desc: 'Сбор семантики, настройка Яндекс.Директ и Авито, интеграция с платформой Cash-Boom.',
    gradient: 'from-blue-600 to-indigo-500',
    shadow: 'shadow-blue-600/25',
    pill: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Тесты и лиды',
    period: '14–21 день',
    desc: 'Вы вносите депозит 50 000 ₽. Мы запускаем трафик, обучаем алгоритмы Яндекса и приводим первые целевые заявки.',
    gradient: 'from-green-500 to-emerald-500',
    shadow: 'shadow-green-500/25',
    pill: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30',
  },
]

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Timeline() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Декоративные пятна */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 dark:bg-orange-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Центрированный заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-4 border border-blue-100 dark:border-blue-500/30">
            Дорожная карта запуска
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
            Реальные сроки запуска
          </h2>
          <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
            До 1 месяца до первых заявок
          </p>
        </motion.div>

        {/* Сетка шагов */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={item} whileHover={{ y: -8 }} className="relative h-full">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-300 p-6 md:p-7 h-full relative overflow-hidden">
                {/* Градиентная линия сверху при hover */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} opacity-0 hover:opacity-100 transition-opacity duration-300`}
                ></div>

                {/* Крупный номер-водяной знак */}
                <span className="absolute top-4 right-5 text-5xl font-extrabold text-slate-100 dark:text-slate-800 select-none leading-none">
                  {step.step}
                </span>

                {/* Иконка в градиентном квадрате */}
                <div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} shadow-lg ${step.shadow} flex items-center justify-center mb-5`}
                >
                  <step.icon className="text-white" size={22} />
                </div>

                {/* Пилюля срока */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-3 ${step.pill}`}
                >
                  {step.period}
                </span>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 relative">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed relative">{step.desc}</p>
              </div>

              {/* Стрелка-связка между карточками (десктоп) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-[22px] -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
                    <ArrowRight className="text-slate-400 dark:text-slate-500" size={14} />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Итоговая плашка с CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-10 md:mt-14 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-600/20 dark:shadow-black/40"
        >
          {/* Декор внутри плашки */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <CalendarClock className="text-white" size={26} />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-extrabold leading-snug">
                  До 30 дней — от первого созвона до первых заявок
                </p>
                <p className="text-blue-200 text-sm md:text-base mt-1">
                  Все этапы и дедлайны фиксируются в договоре — вы всегда знаете,
                  что происходит с проектом прямо сейчас.
                </p>
              </div>
            </div>
            <a
              href="#contacts"
              className="px-7 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap shadow-lg flex items-center space-x-2 group"
            >
              <span>Получить план запуска</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}