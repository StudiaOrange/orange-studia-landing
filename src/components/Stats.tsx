// src/components/Stats.tsx
'use client'
import { motion } from 'framer-motion'
import { Wallet, Timer, Scale, FileSignature } from 'lucide-react'

const stats = [
  {
    icon: Wallet,
    value: '50 000 ₽',
    label: 'Стартовый депозит',
    sub: 'идёт только на трафик и оплату лидов',
    gradient: 'from-blue-600 to-cyan-500',
    shadow: 'shadow-blue-600/25',
  },
  {
    icon: Timer,
    value: '1 месяц',
    label: 'До первых заявок',
    sub: 'от анализа ниши до целевых лидов',
    gradient: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/25',
  },
  {
    icon: Scale,
    value: '50/50',
    label: 'Разделение рисков',
    sub: 'мы инвестируем труд и время команды',
    gradient: 'from-blue-600 to-indigo-500',
    shadow: 'shadow-blue-600/25',
  },
  {
    icon: FileSignature,
    value: 'Договор',
    label: 'Работаем по договору',
    sub: 'KPI и стоимость лида фиксированы',
    gradient: 'from-orange-500 to-rose-500',
    shadow: 'shadow-orange-500/25',
  },
]

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Stats() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Декоративные пятна фона */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-100 dark:bg-orange-500/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Заголовок блока */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-4 border border-blue-100 dark:border-blue-500/30">
            Условия партнерства
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
            Прозрачные условия{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              в цифрах
            </span>
          </h2>
        </motion.div>

        {/* Сетка карточек */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8 }}
              className="group relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 md:p-7 shadow-sm hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-300 overflow-hidden"
            >
              {/* Градиентная линия сверху при hover */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>

              {/* Крупная полупрозрачная иконка на фоне */}
              <stat.icon
                className="absolute -bottom-5 -right-5 w-24 h-24 text-slate-100 dark:text-slate-700 group-hover:text-slate-200/80 dark:group-hover:text-slate-600/60 transition-colors duration-300"
                strokeWidth={1.5}
              />

              {/* Иконка в градиентном квадрате */}
              <div
                className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow} flex items-center justify-center mb-5`}
              >
                <stat.icon className="text-white" size={22} />
              </div>

              {/* Значение */}
              <p
                className={`relative text-3xl md:text-4xl font-extrabold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}
              >
                {stat.value}
              </p>

              {/* Подпись */}
              <p className="relative text-base font-bold text-slate-800 dark:text-white mb-1.5">{stat.label}</p>
              <p className="relative text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Нижняя строка доверия */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm md:text-base text-slate-500 dark:text-slate-400 mt-8 md:mt-10"
        >
          Все условия фиксируются в договоре до старта работ — без скрытых платежей и доплат.
        </motion.p>
      </div>
    </section>
  )
}