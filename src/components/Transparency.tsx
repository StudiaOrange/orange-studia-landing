// src/components/Transparency.tsx
'use client'
import { motion } from 'framer-motion'
import { Eye, Phone, XCircle, TrendingUp, Wallet, Radio } from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: 'Баланс и заявки в реальном времени',
    desc: 'Вы видите остаток депозита, расход на рекламу и каждую заявку в кабинете Cash-Boom. Никаких скрытых платежей и «тумана войны».',
    gradient: 'from-blue-600 to-cyan-500',
    shadow: 'shadow-blue-600/25',
  },
  {
    icon: Phone,
    title: 'Прослушивание разговоров',
    desc: 'Слушайте записи звонков и сами оценивайте качество лидов. Полная прозрачность каждого обращения до оплаты.',
    gradient: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/25',
  },
  {
    icon: XCircle,
    title: 'Кнопка «Отбраковать лид»',
    desc: 'Спам, ошибка номером, недозвон? Отбраковываете лид прямо в CRM — деньги мгновенно возвращаются на ваш баланс.',
    gradient: 'from-green-500 to-emerald-500',
    shadow: 'shadow-green-500/25',
  },
]

const leads = [
  { name: 'Иван', niche: 'Ремонт квартир', status: 'Новая', pill: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30' },
  { name: 'Мария', niche: 'Скупка техники', status: 'В работе', pill: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30' },
  { name: 'Алексей', niche: 'Клининг', status: 'Принята', pill: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30' },
]

const chartBars = [40, 65, 50, 80, 60, 95, 75]

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Transparency() {
  return (
    <section className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Декоративные пятна */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 dark:bg-orange-500/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-4 border border-green-100 dark:border-green-500/30">
            Прозрачность и контроль
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
            Полный контроль расходов
          </h2>
          <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            в личном кабинете Cash-Boom
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Левая колонка — преимущества */}
          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="space-y-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ x: 8 }}
                className="group bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-300 p-6 md:p-7 flex items-start space-x-5"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadow} flex items-center justify-center flex-shrink-0`}
                >
                  <feature.icon className="text-white" size={22} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Правая колонка — дашборд */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-black/40 border border-slate-100 dark:border-slate-700 p-6 md:p-8 relative overflow-hidden">
              {/* Шапка дашборда */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/25">
                    <Radio className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white leading-none">Cash-Boom</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Личный кабинет партнера</p>
                  </div>
                </div>
                <span className="flex items-center space-x-1.5 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Live</span>
                </span>
              </div>

              {/* Показатели */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <Wallet className="text-blue-600 dark:text-blue-400" size={15} />
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Баланс</p>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">50 000 ₽</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <TrendingUp className="text-orange-500 dark:text-orange-400" size={15} />
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Конверсия</p>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">8,5%</p>
                </div>
              </div>

              {/* График */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 mb-6">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Заявки за неделю</p>
                <div className="flex items-end justify-between h-20 gap-2">
                  {chartBars.map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      className={`flex-1 rounded-t-lg ${i === chartBars.length - 2 ? 'bg-gradient-to-t from-orange-500 to-amber-400' : 'bg-gradient-to-t from-blue-600 to-cyan-400'}`}
                    ></motion.div>
                  ))}
                </div>
              </div>

              {/* Список лидов */}
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Последние заявки
              </p>
              <div className="space-y-2.5">
                {leads.map((lead, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{lead.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{lead.niche}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${lead.pill}`}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Примечание */}
              <div className="mt-5 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/30 rounded-xl px-4 py-3 flex items-center space-x-2.5">
                <XCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={16} />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Лид нецелевой? Один клик — и деньги вернулись на баланс.
                </p>
              </div>
            </div>

            {/* Свечение за дашбордом */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-30 dark:opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-400 rounded-full blur-3xl opacity-30 dark:opacity-20 pointer-events-none"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}