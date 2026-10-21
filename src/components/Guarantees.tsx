// src/components/Guarantees.tsx
'use client'
import { motion } from 'framer-motion'
import { FileText, ShieldCheck, Server, BadgeCheck } from 'lucide-react'

const guarantees = [
  {
    icon: FileText,
    title: 'Официальный договор',
    desc: 'Заключаем договор на лидогенерацию. Все условия, KPI и стоимость лида зафиксированы на бумаге до старта работ.',
    tag: 'Зафиксировано на бумаге',
    gradient: 'from-blue-600 to-cyan-500',
    shadow: 'shadow-blue-600/25',
  },
  {
    icon: ShieldCheck,
    title: 'Отбраковка нецелевых',
    desc: 'Не берем деньги за спам, автоответчики и ошибки номером. Платите только за качественные целевые лиды.',
    tag: 'Оплата только за качество',
    gradient: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/25',
  },
  {
    icon: Server,
    title: 'Инфраструктура остается вам',
    desc: 'Если партнерство не окупается — разработанный сайт, промо-материалы и рекламный кабинет переходят в вашу собственность.',
    tag: 'Ваше при любом сценарии',
    gradient: 'from-green-500 to-emerald-500',
    shadow: 'shadow-green-500/25',
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

export default function Guarantees() {
  return (
    <section className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Декоративные пятна */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 dark:bg-green-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Центрированный заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-4 border border-blue-100 dark:border-blue-500/30">
            Надежность и безопасность
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
            Наши гарантии
          </h2>
          <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
            Работаем прозрачно и честно
          </p>
        </motion.div>

        {/* Сетка гарантий */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8 }}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-300 p-7 md:p-8 relative overflow-hidden flex flex-col"
            >
              {/* Градиентная линия сверху при наведении */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${guarantee.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>

              {/* Водяной знак иконки */}
              <guarantee.icon
                className="absolute -bottom-5 -right-5 w-24 h-24 text-slate-100 dark:text-slate-800 group-hover:text-slate-200/80 dark:group-hover:text-slate-700/80 transition-colors duration-300"
                strokeWidth={1.5}
              />

              {/* Иконка в градиентном квадрате */}
              <div
                className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${guarantee.gradient} shadow-lg ${guarantee.shadow} flex items-center justify-center mb-5`}
              >
                <guarantee.icon className="text-white" size={22} />
              </div>

              <h3 className="relative text-xl font-extrabold text-slate-900 dark:text-white mb-3">
                {guarantee.title}
              </h3>
              <p className="relative text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {guarantee.desc}
              </p>

              {/* Тег-резюме */}
              <div className="relative mt-auto">
                <span className="inline-flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-full px-4 py-2">
                  <BadgeCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={15} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{guarantee.tag}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Нижняя строка доверия */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm md:text-base text-slate-500 dark:text-slate-400 mt-8 md:mt-10 max-w-2xl mx-auto"
        >
          Мы играем вдолгую: наша цель — партнер на годы, а не разовая сделка.
          Поэтому каждая гарантия подкреплена договором, а не обещаниями.
        </motion.p>
      </div>
    </section>
  )
}