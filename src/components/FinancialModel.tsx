// src/components/FinancialModel.tsx
'use client'
import { motion } from 'framer-motion'
import {
  Rocket,
  Wallet,
  HeartHandshake,
  Trophy,
  CheckCircle,
  Sparkles,
} from 'lucide-react'

const included = [
  'Высококонверсионный сайт',
  'Продающие тексты',
  'Дизайн промо-материалов',
  'Промо-видеоролик',
  'Настройка рекламных кампаний',
]

const keeps = [
  'Сайт',
  'Промо-материалы',
  'Промо-ролик',
  'Рекламный кабинет',
]

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function FinancialModel() {
  return (
    <section id="terms" className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Декоративные пятна */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 dark:bg-orange-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Центрированный заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100 dark:border-orange-500/30">
            Финансовая модель
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
            Честное партнерство
          </h2>
          <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Как мы делим риски 50/50
          </p>
        </motion.div>

        {/* ===== ГЛАВНАЯ КАРТОЧКА: НАШИ РИСКИ ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-black/40 border border-slate-100 dark:border-slate-700 overflow-hidden mb-8 md:mb-10"
        >
          <div className="grid md:grid-cols-5">
            {/* Левая часть — описание */}
            <div className="md:col-span-3 p-7 md:p-10">
              <div className="flex items-center space-x-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/25 flex items-center justify-center flex-shrink-0">
                  <Rocket className="text-white" size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                    Наши риски
                  </p>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                    Труд и время команды
                  </h3>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Мы бесплатно собираем сайт, пишем тексты, делаем дизайн промо-материалов,
                снимаем промо-видеоролик и настраиваем рекламные кампании. За все это студия
                взяла бы не менее{' '}
                <span className="font-bold text-slate-900 dark:text-white">180 000 ₽</span>.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {included.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700"
                  >
                    <CheckCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={18} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            {/* Правая часть — цена */}
            <div className="md:col-span-2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-7 md:p-10 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <p className="text-blue-200 text-sm font-medium mb-1">Стоимость работ на рынке</p>
                <p className="text-3xl md:text-4xl font-extrabold line-through decoration-red-400 decoration-4 opacity-70 mb-5">
                  180 000 ₽
                </p>
                <p className="text-blue-200 text-sm font-medium mb-1">Вы платите</p>
                <p className="text-6xl md:text-7xl font-extrabold tracking-tight">0 ₽</p>
              </div>
            </div>
          </div>
          {/* Нижняя полоса-акцент */}
          <div className="bg-orange-50 dark:bg-orange-500/10 border-t border-orange-100 dark:border-orange-500/20 px-6 md:px-10 py-5 flex items-center justify-center space-x-3">
            <Sparkles className="text-orange-500 dark:text-orange-400 flex-shrink-0" size={20} />
            <p className="text-sm md:text-base text-slate-800 dark:text-slate-200 font-semibold text-center">
              Вы не платите ничего!{' '}
              <span className="text-orange-600 dark:text-orange-400">В чем подвох?</span>{' '}
              А его нет — мы зарабатываем только тогда, когда зарабатываете вы.
            </p>
          </div>
        </motion.div>

        {/* ===== СЕТКА ИЗ 3 КАРТОЧЕК ===== */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Карточка 1: Ваши риски */}
          <motion.div
            variants={item}
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25 flex items-center justify-center mb-5">
              <Wallet className="text-white" size={22} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400 mb-1">
              Ваши риски
            </p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
              Прозрачный депозит 50 000 ₽
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              Вы пополняете рекламный кабинет. Деньги идут строго на трафик и лиды —
              не на работу агентства.
            </p>
            {/* Визуальное разделение депозита */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex h-3 rounded-full overflow-hidden mb-3">
                <div className="w-3/5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                <div className="w-2/5 bg-gradient-to-r from-orange-400 to-orange-500"></div>
              </div>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-0.5 flex-shrink-0"></span>
                  <p><span className="font-bold text-blue-600 dark:text-blue-400">30 000 ₽</span> — тестовая реклама на старте</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-0.5 flex-shrink-0"></span>
                  <p><span className="font-bold text-orange-500 dark:text-orange-400">20 000 ₽</span> — масштабирование после первых лидов</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
              Вторая часть включается, когда мы получим первые лиды и поймем,
              какая связка отработала лучше.
            </p>
          </motion.div>

          {/* Карточка 2: Выгодно всем */}
          <motion.div
            variants={item}
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/25 flex items-center justify-center mb-5">
              <HeartHandshake className="text-white" size={22} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              Ваша выгода и наша
            </p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
              Выгодно всем
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              Вы получаете лиды. Мы получаем постоянного партнера и работу для своих
              сотрудников. Наши интересы совпадают на 100%.
            </p>
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/30 rounded-2xl p-4">
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                Нам <span className="font-bold text-blue-700 dark:text-blue-400">невыгодно сливать ваш бюджет</span> —
                ведь на работу мы затратим куда больше усилий, чем заработаем на провале.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Вы</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">получаете целевые лиды</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Мы</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">получаем партнера надолго</p>
              </div>
            </div>
          </motion.div>

          {/* Карточка 3: Беспроигрышный тест */}
          <motion.div
            variants={item}
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-300 relative overflow-hidden"
          >
            {/* Уголок-акцент */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-xl">
              Вы в плюсе
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/25 flex items-center justify-center mb-5">
              <Trophy className="text-white" size={22} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1">
              Беспроигрышный тест
            </p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
              Даже если не сработает
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Если спустя 4 месяца мы не привели заявки или из заявок вы не получили
              ни одного клиента — все, что мы создали, остается вашим:
            </p>
            <ul className="space-y-2 mb-5">
              {keeps.map((point, i) => (
                <li key={i} className="flex items-center space-x-2.5">
                  <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={16} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{point}</span>
                </li>
              ))}
            </ul>
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/30 rounded-2xl p-4">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Плюс оставляем ваш оффер на нашей платформе для дальнейших тестов на
                постоянной основе.{' '}
                <span className="font-bold text-green-700 dark:text-green-400">
                  Не получилось сегодня — вдруг получится завтра.
                </span>{' '}
                Это выгодно нам и вам.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}