// src/components/ContactForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator, Search, Users, Send, MessageCircle, CheckCircle, Plus,
  HelpCircle, TrendingUp, Target, Check, Save,
} from 'lucide-react'
import { openLegalModal } from './LegalModals'
import { useLeads } from '@/context/LeadsContext'
import { usePartner } from '@/context/PartnerContext'

/* ===== Каналы трафика ===== */
const CHANNELS = [
  { id: 'direct', name: 'Яндекс Директ', icon: Search, factor: 0.07 },
  { id: 'vk', name: 'Таргет ВК', icon: Users, factor: 0.06 },
  { id: 'tg', name: 'Telegram', icon: Send, factor: 0.05 },
  { id: 'max', name: 'Мессенджер Max', icon: MessageCircle, factor: 0.045 },
]

/* ===== FAQ ===== */
const FAQ = [
  { q: 'В чем подвох? Почему сайт и настройка бесплатные?', a: 'Подвоха нет. Мы инвестируем труд команды в упаковку вашего бизнеса и зарабатываем только тогда, когда вы получаете лиды. Нет лидов — мы остались в минусе, а сайт и материалы достались вам.' },
  { q: 'Куда идут 50 000 ₽ стартового депозита?', a: '30 000 ₽ — на тестовую рекламу на старте. 20 000 ₽ — на масштабирование после первых лидов. Все траты видны в кабинете.' },
  { q: 'Что будет, если реклама не сработает?', a: 'Сайт, промо-материалы, промо-ролик и рекламный кабинет остаются вашими. Оффер остается на платформе для дальнейших тестов.' },
  { q: 'Как я контролирую качество лидов?', a: 'В кабинете вы видите каждую заявку, слушаете записи разговоров и можете отбраковать лид. Спам и недозвоны не оплачиваются.' },
  { q: 'Когда придут первые заявки?', a: 'До 1 месяца: 1–3 дня анализ, 7–14 дней упаковка, 3–5 дней настройка, 14–21 день тесты трафика.' },
  { q: 'Мы работаем по договору?', a: 'Да. KPI, стоимость лида, сроки этапов фиксируются в договоре до старта работ.' },
]

/* ===== Хелперы ===== */
const fmt = (n: number) => n.toLocaleString('ru-RU')

function nicheModifier(niche: string) {
  let hash = 0
  for (let i = 0; i < niche.length; i++) hash = (hash * 31 + niche.charCodeAt(i)) % 997
  return 0.9 + (hash % 21) / 100
}

function calcCost(revenue: number, factor: number, modifier: number) {
  return Math.max(1000, Math.round((revenue * factor * modifier) / 10) * 10)
}

export default function ContactForm() {
  const { addLead } = useLeads()
  const { isAuthenticated, addCalculation } = usePartner()
  const router = useRouter()

  const [niche, setNiche] = useState('')
  const [revenue, setRevenue] = useState('')
  const [channel, setChannel] = useState('direct')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [saved, setSaved] = useState(false)

  const revenueNum = Number(revenue)
  const hasData = niche.trim().length > 1 && revenueNum > 0
  const modifier = nicheModifier(niche.trim().toLowerCase())

  const currentChannel = CHANNELS.find((c) => c.id === channel)!
  const currentCost = hasData ? calcCost(revenueNum, currentChannel.factor, modifier) : 0
  const leadsFromDeposit = currentCost ? Math.floor(50000 / currentCost) : 0
  const potentialRevenue = Math.round(leadsFromDeposit * revenueNum * 0.2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agree) {
      alert('Пожалуйста, примите политику конфиденциальности и пользовательское соглашение')
      return
    }
    addLead({
      source: 'contact',
      data: {
        name,
        phone,
        niche,
        channel: currentChannel.name,
        calculatedCost: `${currentCost} ₽`,
      },
    })
    alert('Спасибо! Мы свяжемся с вами и пришлем точный расчет по вашей нише.')
    setName('')
    setPhone('')
    setAgree(false)
  }

  const handleSaveCalculation = () => {
    if (!hasData) {
      alert('Сначала заполните нишу и доход с клиента')
      return
    }
    if (!isAuthenticated) {
      alert('Для сохранения расчётов необходимо войти или зарегистрироваться')
      router.push('/register')
      return
    }
    addCalculation({
      niche,
      revenuePerClient: revenueNum,
      channel: currentChannel.name,
      costPerLead: currentCost,
      leadsFromDeposit,
      potentialRevenue,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <section id="contacts" className="py-14 md:py-20 lg:py-24 px-3 sm:px-4 bg-white dark:bg-[#0B1220] relative overflow-hidden">
      {/* Декоративные пятна */}
      <div className="absolute top-0 left-0 w-72 md:w-96 h-72 md:h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-72 md:w-96 h-72 md:h-96 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-3 sm:mb-4 border border-orange-100 dark:border-orange-500/30">
            Расчет и ответы на вопросы
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 break-words">
            Готовы начать?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 break-words">
            Давайте рассчитаем стоимость заявки
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* ===== КАЛЬКУЛЯТОР + ФОРМА ===== */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-slate-800/50 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 sm:p-6 md:p-8 relative overflow-hidden"
          >
            <div className="flex items-center space-x-3 sm:space-x-4 mb-5 sm:mb-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25 flex items-center justify-center flex-shrink-0">
                <Calculator className="text-white" size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white break-words">
                  Калькулятор стоимости лида
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Введите данные — получите цену заявки по каналам
                </p>
              </div>
            </div>

            {/* Поля: ниша и доход */}
            <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/20 transition-all"
                placeholder="Ваша ниша (например: Ремонт квартир)"
              />
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/20 transition-all"
                placeholder="Доход с 1 клиента, ₽ (например: 50 000)"
              />
            </div>

            {/* Выбор канала */}
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Канал трафика</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
              {CHANNELS.map((ch) => {
                const isActive = channel === ch.id
                const cost = hasData ? calcCost(revenueNum, ch.factor, modifier) : 0
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setChannel(ch.id)}
                    className={`rounded-xl sm:rounded-2xl border p-3 sm:p-3.5 text-left transition-all duration-200 ${
                      isActive
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 ring-2 ring-orange-200 dark:ring-orange-500/30'
                        : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                          isActive
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                            : 'bg-white dark:bg-slate-800 text-orange-500 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <ch.icon size={14} />
                      </div>
                      {isActive && <CheckCircle size={14} className="text-orange-500" />}
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 leading-tight break-words">
                      {ch.name}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 dark:text-white">
                      {cost ? `${fmt(cost)} ₽` : '— ₽'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">за заявку</p>
                  </button>
                )
              })}
            </div>

            {/* Панель результата */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white relative overflow-hidden mb-5 sm:mb-6">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              {hasData ? (
                <div className="relative">
                  <div className="flex items-end justify-between flex-wrap gap-2 sm:gap-3 mb-4">
                    <div>
                      <p className="text-blue-200 text-[11px] sm:text-xs font-semibold mb-1">
                        Стоимость заявки · {currentChannel.name}
                      </p>
                      <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight break-words">≈ {fmt(currentCost)} ₽</p>
                    </div>
                    <span className="bg-white/15 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold">минимум 1 000 ₽</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <Target size={13} className="text-blue-200 flex-shrink-0" />
                        <p className="text-[10px] sm:text-[11px] text-blue-200 font-semibold leading-tight">Лидов с депозита 50 000 ₽</p>
                      </div>
                      <p className="text-lg sm:text-xl font-extrabold">~{leadsFromDeposit}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <TrendingUp size={13} className="text-blue-200 flex-shrink-0" />
                        <p className="text-[10px] sm:text-[11px] text-blue-200 font-semibold leading-tight">Потенциал (20% сделок)</p>
                      </div>
                      <p className="text-lg sm:text-xl font-extrabold break-words">~{fmt(potentialRevenue)} ₽</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="relative text-blue-100 text-xs sm:text-sm md:text-base leading-relaxed">
                  Укажите нишу и доход с 1 клиента — и калькулятор покажет стоимость заявки по каждому каналу.
                </p>
              )}
            </div>

            {/* Форма заявки */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/20 transition-all"
                  placeholder="Ваше имя"
                />
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/20 transition-all"
                  placeholder="+7 (999) 000-00-00"
                />
              </div>

              {/* Чекбокс согласия */}
              <label className="flex items-start space-x-3 cursor-pointer select-none group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                      agree
                        ? 'bg-orange-500 border-orange-500'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-orange-400'
                    }`}
                  >
                    {agree && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Я согласен с{' '}
                  <button type="button" onClick={() => openLegalModal('privacy')} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    политикой конфиденциальности
                  </button>{' '}
                  и{' '}
                  <button type="button" onClick={() => openLegalModal('terms')} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    пользовательским соглашением
                  </button>
                </span>
              </label>

              {/* Кнопка отправки */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-base sm:text-lg font-bold rounded-xl shadow-xl shadow-orange-500/30 hover:shadow-2xl transition-shadow flex items-center justify-center space-x-2"
              >
                <span>Получить точный расчет</span>
                <Send size={18} />
              </motion.button>

              {/* Кнопка сохранения в кабинет */}
              <button
                type="button"
                onClick={handleSaveCalculation}
                className="w-full py-3 sm:py-3.5 bg-white dark:bg-slate-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-blue-500/15 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>{saved ? '✅ Сохранено!' : 'Сохранить расчёт в кабинете'}</span>
              </button>

              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                Расчет предварительный. Точную стоимость лида скажем после бесплатного анализа ниши.
              </p>
            </form>
          </motion.div>

          {/* ===== FAQ ===== */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center space-x-3 mb-5 sm:mb-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/25 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="text-white" size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white break-words">Частые вопросы</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Отвечаем честно и без воды</p>
              </div>
            </div>
            <div className="space-y-3">
              {FAQ.map((item, i) => {
                const isOpen = openFaq === i
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`bg-white dark:bg-slate-800/50 rounded-xl sm:rounded-2xl border shadow-md overflow-hidden transition-colors duration-300 ${
                      isOpen ? 'border-orange-200 dark:border-orange-500/40' : 'border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 text-left"
                    >
                      <span className="font-bold text-slate-900 dark:text-white text-sm md:text-base leading-snug break-words">
                        {item.q}
                      </span>
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isOpen
                            ? 'bg-orange-500 text-white rotate-45'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Plus size={16} />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}