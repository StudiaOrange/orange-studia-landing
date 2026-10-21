// src/components/FooterModals.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Shield, FileText, Download, Printer, Send, User, Phone, Mail, Briefcase,
  Home, CheckCircle,
} from 'lucide-react'
import { useLeads } from '@/context/LeadsContext'

/* ============================================================
   Общие стили модалок
   ============================================================ */
const overlayCls = 'fixed inset-0 z-[80] flex items-center justify-center p-4 pointer-events-none'
const cardCls = 'relative bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl'
const headingCls = 'text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-4'
const sectionCls = 'font-bold text-base text-slate-900 dark:text-white mt-5 mb-2'
const paraCls = 'text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-2'
const closeBtn = 'w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors'

/* ============================================================
   РЕКВИЗИТЫ ИСПОЛНИТЕЛЯ (для всех договоров)
   ============================================================ */
const EXECUTOR = {
  name: 'Мокрушин Михаил Андреевич',
  status: 'Индивидуальный предприниматель',
  shortName: 'ИП Мокрушин М.А.',
  inn: '590415452100',
  ogrn: '326595800114060',
  account: '40802810220001144204',
  bank: 'ООО "Банк Точка"',
  bik: '044525104',
  bankInn: '9721194461',
  email: 'info@cash-boom.live',
  phone: '+7 (902) 830-45-70',
  address: 'г. Пермь',
}

/* ============================================================
   1. МОДАЛКА: ФОРМА ЗАЯВКИ (кнопка «Рассчитать»)
   ============================================================ */
export function FooterLeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addLead } = useLeads()
  const [form, setForm] = useState({ name: '', phone: '', niche: '', city: '' })
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    addLead({ source: 'modal', data: { ...form, from: 'footer' } })
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setForm({ name: '', phone: '', niche: '', city: '' })
      onClose()
    }, 2500)
  }

  const inputCls = 'w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/20'

  return (
    <AnimatePresence>
      {open && (
        <div className={overlayCls}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className={cardCls} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Send size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">Рассчитать стоимость лида</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Оставьте контакты — мы свяжемся за 15 минут</p>
                </div>
              </div>
              <button onClick={onClose} className={closeBtn}><X size={18} /></button>
            </div>

            {sent ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                  <CheckCircle size={30} className="text-white" />
                </div>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Заявка отправлена!</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Мы перезвоним в течение 15 минут</p>
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Ваше имя *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                      className={`${inputCls} pl-10`} placeholder="Иван Иванов" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Телефон *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required
                      className={`${inputCls} pl-10`} placeholder="+7 (___) ___-__-__" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Ниша</label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })}
                        className={`${inputCls} pl-10`} placeholder="Ремонт, окна..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Город</label>
                    <div className="relative">
                      <Home size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className={`${inputCls} pl-10`} placeholder="Москва" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  Отправляя форму, вы соглашаетесь с политикой обработки персональных данных.
                </p>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  <Send size={16} /> Отправить заявку
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ============================================================
   2. МОДАЛКА: ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ (ФЗ-152)
   ============================================================ */
export function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className={overlayCls}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className={cardCls} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">Политика конфиденциальности</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">ФЗ-152 «О персональных данных»</p>
                </div>
              </div>
              <button onClick={onClose} className={closeBtn}><X size={18} /></button>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Редакция от 01.01.2026</p>

              <h3 className={sectionCls}>1. Общие положения</h3>
              <p className={paraCls}>
                Настоящая Политика в отношении обработки персональных данных (далее — «Политика») разработана
                в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»
                (далее — «ФЗ-152») и определяет порядок обработки персональных данных и меры по обеспечению
                их безопасности, предпринимаемые {EXECUTOR.status} {EXECUTOR.name}, ИНН {EXECUTOR.inn}
                (далее — «Оператор»).
              </p>
              <p className={paraCls}>
                Использование сайта cash-boom.live (далее — «Сайт») означает безоговорочное согласие Пользователя
                с настоящей Политикой и указанными в ней условиями обработки его персональных данных.
              </p>

              <h3 className={sectionCls}>2. Оператор персональных данных</h3>
              <p className={paraCls}>
                <strong>Оператор:</strong> {EXECUTOR.status} {EXECUTOR.name}<br />
                ОГРНИП: {EXECUTOR.ogrn} · ИНН: {EXECUTOR.inn}<br />
                Адрес: {EXECUTOR.address}<br />
                Email: {EXECUTOR.email} · Телефон: {EXECUTOR.phone}
              </p>

              <h3 className={sectionCls}>3. Собираемые персональные данные</h3>
              <p className={paraCls}>В ходе использования Сайта Оператор может получать следующие персональные данные Пользователя:</p>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li>фамилия, имя, отчество;</li>
                <li>номер контактного телефона;</li>
                <li>адрес электронной почты;</li>
                <li>наименование компании, город, ниша бизнеса;</li>
                <li>данные файлов cookie (IP-адрес, информация о браузере, время посещения, страницы).</li>
              </ul>

              <h3 className={sectionCls}>4. Цели обработки персональных данных</h3>
              <p className={paraCls}>Обработка персональных данных осуществляется в следующих целях:</p>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li>идентификация Пользователя в рамках исполнения договора;</li>
                <li>предоставление Пользователю услуг по лидогенерации;</li>
                <li>связь с Пользователем, направление уведомлений, запросов, касающихся использования Сайта;</li>
                <li>улучшение качества работы Сайта и услуг;</li>
                <li>проведение статистических и иных исследований на основе обезличенных данных;</li>
                <li>исполнение требований законодательства Российской Федерации.</li>
              </ul>

              <h3 className={sectionCls}>5. Правовые основания обработки (ст. 6 ФЗ-152)</h3>
              <p className={paraCls}>
                Обработка персональных данных осуществляется на следующих правовых основаниях:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li>согласие субъекта персональных данных на обработку (п. 1 ч. 1 ст. 6 ФЗ-152);</li>
                <li>исполнение договора, стороной которого является субъект ПДн (п. 5 ч. 1 ст. 6 ФЗ-152);</li>
                <li>исполнение возложенных законодательством обязанностей (п. 2 ч. 1 ст. 6 ФЗ-152).</li>
              </ul>

              <h3 className={sectionCls}>6. Порядок и условия обработки</h3>
              <p className={paraCls}>
                Оператор осуществляет сбор, запись, систематизацию, накопление, хранение, уточнение,
                извлечение, использование, передачу, обезличивание, блокирование, удаление и уничтожение
                персональных данных. Обработка осуществляется как с использованием средств автоматизации,
                так и без их использования.
              </p>
              <p className={paraCls}>
                Персональные данные не передаются третьим лицам, за исключением случаев, предусмотренных
                законодательством РФ, а также для исполнения обязательств перед Пользователем в рамках
                договора (например, передача данных партнёру для оказания услуг).
              </p>
              <p className={paraCls}>
                Срок хранения персональных данных — до момента отзыва согласия субъектом ПДн либо до
                достижения целей обработки, если иное не предусмотрено законом.
              </p>

              <h3 className={sectionCls}>7. Права субъекта персональных данных (ст. 14 ФЗ-152)</h3>
              <p className={paraCls}>Пользователь имеет право:</p>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li>получать информацию, касающуюся обработки его персональных данных;</li>
                <li>требовать уточнения, блокирования или уничтожения своих ПДн;</li>
                <li>отозвать согласие на обработку ПДн;</li>
                <li>обжаловать действия Оператора в Роскомнадзор или в суд.</li>
              </ul>
              <p className={paraCls}>
                Для реализации прав Пользователь может направить запрос на email: {EXECUTOR.email}.
                Срок ответа — не более 10 рабочих дней с момента получения запроса.
              </p>

              <h3 className={sectionCls}>8. Защита персональных данных (ст. 19 ФЗ-152)</h3>
              <p className={paraCls}>
                Оператор принимает необходимые правовые, организационные и технические меры для защиты
                персональных данных от неправомерного или случайного доступа, уничтожения, изменения,
                блокирования, копирования, распространения, а также от иных неправомерных действий
                третьих лиц. В том числе применяются:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li>шифрование передаваемых данных (SSL/TLS);</li>
                <li>ограничение доступа к ПДн (ролевая модель);</li>
                <li>ведение журналов доступа и событий безопасности;</li>
                <li>регулярная оценка эффективности мер защиты.</li>
              </ul>

              <h3 className={sectionCls}>9. Файлы cookie</h3>
              <p className={paraCls}>
                Сайт использует файлы cookie для обеспечения работоспособности, сбора статистики посещений
                (в том числе Яндекс.Метрика, Google Analytics) и персонализации контента. Пользователь может
                отключить cookie в настройках браузера, однако это может повлиять на работу отдельных
                разделов Сайта.
              </p>

              <h3 className={sectionCls}>10. Заключительные положения</h3>
              <p className={paraCls}>
                Оператор вправе вносить изменения в настоящую Политику. Новая редакция вступает в силу
                с момента её размещения на Сайте. Действующая редакция всегда доступна по адресу
                https://cash-boom.live/privacy.
              </p>
              <p className={paraCls}>
                Все вопросы, связанные с обработкой персональных данных, рассматриваются в соответствии
                с законодательством Российской Федерации.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ============================================================
   3. МОДАЛКА: ДОГОВОР-ОФЕРТА (ГК РФ ст. 435–449)
   ============================================================ */
export function OfferModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className={overlayCls}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className={cardCls} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <FileText size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">Договор-оферта</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Публичная оферта · ГК РФ ст. 435–449</p>
                </div>
              </div>
              <button onClick={onClose} className={closeBtn}><X size={18} /></button>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Редакция от 01.01.2026</p>

              <p className={paraCls}>
                Настоящий документ является официальным предложением (публичной офертой) {EXECUTOR.status} {EXECUTOR.name}
                (ОГРНИП {EXECUTOR.ogrn}, ИНН {EXECUTOR.inn}), именуемого в дальнейшем <strong>«Исполнитель»</strong>,
                и содержит все существенные условия оказания услуг по лидогенерации (привлечению целевых клиентов).
                В соответствии со ст. 437 Гражданского кодекса Российской Федерации, в случае принятия
                изложенных ниже условий, физическое или юридическое лицо, производящее акцепт настоящей
                оферты, становится <strong>«Заказчиком»</strong>.
              </p>

              <h3 className={sectionCls}>1. Термины и определения</h3>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li><strong>Акцепт</strong> — полное и безоговорочное принятие Заказчиком условий оферты путём заполнения заявки на Сайте и внесения стартового депозита.</li>
                <li><strong>Лид (целевой лид)</strong> — обращение потенциального клиента Заказчика, соответствующее согласованным критериям.</li>
                <li><strong>Стартовый депозит</strong> — авансовый платёж в размере 50 000 (пятидесяти тысяч) рублей, вносимый Заказчиком после акцепта оферты.</li>
                <li><strong>Сайт</strong> — интернет-ресурс по адресу https://cash-boom.live.</li>
              </ul>

              <h3 className={sectionCls}>2. Предмет оферты</h3>
              <p className={paraCls}>
                2.1. Исполнитель обязуется оказать Заказчику услуги по привлечению целевых клиентов
                (лидогенерации), включая: разработку сайта (лендинга), создание промо-материалов,
                настройку рекламных кампаний, привлечение и передачу целевых заявок.
              </p>
              <p className={paraCls}>
                2.2. Разработка сайта и промо-материалов осуществляется за счёт Исполнителя и не
                оплачивается Заказчиком отдельно.
              </p>
              <p className={paraCls}>
                2.3. Оплата производится исключительно за фактически полученные целевые лиды по
                стоимости, согласованной Сторонами.
              </p>

              <h3 className={sectionCls}>3. Порядок заключения договора</h3>
              <p className={paraCls}>
                3.1. Акцептом оферты является совершение Заказчиком следующих действий:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li>заполнение заявки на Сайте с указанием контактных данных;</li>
                <li>согласование критериев целевых лидов и стоимости услуг;</li>
                <li>внесение стартового депозита в размере 50 000 ₽.</li>
              </ul>
              <p className={paraCls}>
                3.2. Договор считается заключённым с момента поступления депозита на расчётный счёт Исполнителя.
              </p>

              <h3 className={sectionCls}>4. Стоимость услуг и порядок расчётов</h3>
              <p className={paraCls}>
                4.1. Стоимость одного целевого лида согласовывается Сторонами индивидуально и фиксируется
                в переписке (email / мессенджер). НДС не облагается в связи с применением Исполнителем
                упрощённой системы налогообложения (ст. 346.11 НК РФ).
              </p>
              <p className={paraCls}>
                4.2. Стартовый депозит в размере 50 000 ₽ вносится Заказчиком после акцепта оферты и
                расходуется исключительно на закупку рекламного трафика и оплату целевых лидов.
              </p>
              <p className={paraCls}>
                4.3. Оплата сверх суммы депозита производится по факту получения лидов на основании
                выставленных Исполнителем актов с приложением файла-отчёта по заявкам.
              </p>
              <p className={paraCls}>
                4.4. Неиспользованный остаток депозита подлежит возврату Заказчику в течение 10
                (десяти) рабочих дней по его письменному требованию.
              </p>

              <h3 className={sectionCls}>5. Права и обязанности Исполнителя</h3>
              <p className={paraCls}><strong>Исполнитель обязуется:</strong></p>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li>оказывать услуги надлежащего качества и в согласованные сроки;</li>
                <li>согласовывать с Заказчиком параметры рекламных кампаний;</li>
                <li>предоставлять доступ к системе учёта заявок;</li>
                <li>соблюдать ФЗ-38 «О рекламе» и ФЗ-152 «О персональных данных».</li>
              </ul>
              <p className={paraCls}><strong>Исполнитель вправе:</strong></p>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li>самостоятельно определять методы оказания услуг;</li>
                <li>приостановить оказание услуг при просрочке оплаты более 10 рабочих дней.</li>
              </ul>

              <h3 className={sectionCls}>6. Права и обязанности Заказчика</h3>
              <p className={paraCls}><strong>Заказчик обязуется:</strong></p>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li>предоставлять достоверную информацию и материалы;</li>
                <li>своевременно оплачивать услуги;</li>
                <li>обрабатывать полученные ПДн в соответствии с ФЗ-152.</li>
              </ul>
              <p className={paraCls}><strong>Заказчик вправе:</strong></p>
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                <li>контролировать ход оказания услуг;</li>
                <li>подтверждать или отбраковывать заявки;</li>
                <li>запрашивать отчётность.</li>
              </ul>

              <h3 className={sectionCls}>7. Ответственность сторон</h3>
              <p className={paraCls}>
                7.1. За неисполнение обязательств Стороны несут ответственность по ст. 393, 395, 401 ГК РФ.
              </p>
              <p className={paraCls}>
                7.2. При просрочке оплаты Заказчик уплачивает неустойку 0,1% от суммы задолженности
                за каждый день просрочки (ст. 330 ГК РФ).
              </p>
              <p className={paraCls}>
                7.3. Исполнитель не гарантирует конкретный коммерческий результат, но гарантирует
                надлежащее качество услуг и привлечение целевых лидов.
              </p>

              <h3 className={sectionCls}>8. Персональные данные</h3>
              <p className={paraCls}>
                8.1. Обработка ПДн осуществляется в соответствии с ФЗ-152 «О персональных данных»
                и Политикой конфиденциальности Исполнителя.
              </p>
              <p className={paraCls}>
                8.2. Заказчик выступает оператором ПДн в отношении полученных лидов и обязуется
                обрабатывать их на законных основаниях (ст. 6, 7, 18.1 ФЗ-152).
              </p>

              <h3 className={sectionCls}>9. Обстоятельства непреодолимой силы</h3>
              <p className={paraCls}>
                Стороны освобождаются от ответственности за неисполнение обязательств вследствие
                обстоятельств непреодолимой силы (форс-мажор): стихийные бедствия, военные действия,
                акты государственных органов, сбои в сетях связи и иные обстоятельства, которые
                Стороны не могли предвидеть и предотвратить.
              </p>

              <h3 className={sectionCls}>10. Разрешение споров</h3>
              <p className={paraCls}>
                10.1. Споры разрешаются путём переговоров. Срок ответа на претензию — 15 календарных дней.
              </p>
              <p className={paraCls}>
                10.2. При недостижении согласия спор передаётся в суд в соответствии с процессуальным
                законодательством РФ (ст. 450, 451 ГК РФ).
              </p>

              <h3 className={sectionCls}>11. Срок действия оферты</h3>
              <p className={paraCls}>
                11.1. Настоящая оферта вступает в силу с момента размещения на Сайте и действует
                бессрочно до её отзыва Исполнителем.
              </p>
              <p className={paraCls}>
                11.2. Исполнитель вправе изменить условия оферты в одностороннем порядке, разместив
                новую редакцию на Сайте.
              </p>

              <h3 className={sectionCls}>12. Реквизиты Исполнителя</h3>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <p><strong>{EXECUTOR.status} {EXECUTOR.name}</strong></p>
                <p>ИНН: {EXECUTOR.inn} · ОГРНИП: {EXECUTOR.ogrn}</p>
                <p>Р/с: {EXECUTOR.account}</p>
                <p>Банк: {EXECUTOR.bank}</p>
                <p>БИК: {EXECUTOR.bik} · ИНН банка: {EXECUTOR.bankInn}</p>
                <p>Email: {EXECUTOR.email}</p>
                <p>Телефон: {EXECUTOR.phone}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ============================================================
   4. МОДАЛКА: ОБРАЗЕЦ ДОГОВОРА (с возможностью скачать)
   ============================================================ */
export function SampleContractModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const handlePrint = () => { window.print() }

  return (
    <AnimatePresence>
      {open && (
        <div className={overlayCls}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className={cardCls} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10 no-print">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <FileText size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">Образец договора</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Договор на оказание услуг лидогенерации</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                  <Download size={14} /> Скачать PDF
                </button>
                <button onClick={onClose} className={closeBtn}><X size={18} /></button>
              </div>
            </div>

            <div id="sample-contract-print-area" className="p-6 md:p-10 bg-white text-slate-900 contract-doc">
              <h1 className="text-center font-extrabold text-lg md:text-xl mb-1">ДОГОВОР № ОБРАЗЕЦ-2026-001</h1>
              <p className="text-center font-bold text-sm md:text-base mb-1">на оказание услуг по привлечению клиентов (лидогенерации)</p>
              <div className="flex justify-between text-xs md:text-sm mb-6 mt-4">
                <span>г. Пермь</span>
                <span>«__» _________ 2026 г.</span>
              </div>

              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                <strong>{EXECUTOR.status} {EXECUTOR.name}</strong>, ОГРНИП {EXECUTOR.ogrn}, ИНН {EXECUTOR.inn},
                именуемый в дальнейшем <strong>«Исполнитель»</strong>, действующий на основании
                государственной регистрации, с одной стороны, и
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                <strong>__________________________</strong>, именуемый(ая) в дальнейшем <strong>«Заказчик»</strong>,
                с другой стороны, совместно именуемые «Стороны», заключили настоящий Договор о нижеследующем:
              </p>

              <h3 className="font-bold text-center my-4 text-sm md:text-base">1. ПРЕДМЕТ ДОГОВОРА</h3>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                1.1. Исполнитель обязуется оказать Заказчику услуги по привлечению целевых клиентов (лидогенерации),
                включая разработку сайта (лендинга), создание промо-материалов, настройку рекламных кампаний
                и привлечение целевых заявок (лидов), а Заказчик обязуется принять и оплатить оказанные
                услуги в порядке и на условиях, предусмотренных настоящим Договором.
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                1.2. Разработка сайта и промо-материалов осуществляется за счёт Исполнителя и не оплачивается
                Заказчиком отдельно.
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                1.3. Настоящий Договор заключён в соответствии со статьями 420, 421, 432, 434, 779, 780
                Гражданского кодекса Российской Федерации.
              </p>

              <h3 className="font-bold text-center my-4 text-sm md:text-base">2. ПОРЯДОК И СРОКИ ОКАЗАНИЯ УСЛУГ</h3>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                2.1. Исполнитель приступает к оказанию услуг после подписания настоящего Договора и внесения
                Заказчиком стартового депозита в размере 50 000 (пятидесяти тысяч) рублей.
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                2.2. Целевым лидом признаётся обращение потенциального клиента, соответствующее согласованным
                критериям. Обращения, не соответствующие критериям (спам, ошибочные номера, автоответчики,
                недозвоны), целевыми не признаются и оплате не подлежат.
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                2.3. Услуги оказываются в соответствии с требованиями ФЗ от 13.03.2006 № 38-ФЗ «О рекламе».
              </p>

              <h3 className="font-bold text-center my-4 text-sm md:text-base">3. СТОИМОСТЬ УСЛУГ И ПОРЯДОК РАСЧЁТОВ</h3>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                3.1. Стоимость одного целевого лида согласовывается Сторонами индивидуально (НДС не облагается
                на основании ст. 346.11 Налогового кодекса РФ).
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                3.2. Стартовый депозит 50 000 ₽ расходуется на закупку рекламного трафика и оплату целевых лидов.
                Неиспользованный остаток возвращается Заказчику в течение 10 рабочих дней по его требованию.
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                3.3. Расчёты между Сторонами производятся в безналичной форме в российских рублях.
              </p>

              <h3 className="font-bold text-center my-4 text-sm md:text-base">4. ПРАВА И ОБЯЗАННОСТИ СТОРОН</h3>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                4.1. Исполнитель обязуется оказывать услуги надлежащего качества, предоставлять доступ
                к статистике заявок и соблюдать законодательство о рекламе и персональных данных.
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                4.2. Заказчик обязуется предоставлять достоверную информацию, своевременно оплачивать
                услуги и обрабатывать полученные ПДн в соответствии с ФЗ-152 «О персональных данных».
              </p>

              <h3 className="font-bold text-center my-4 text-sm md:text-base">5. ОТВЕТСТВЕННОСТЬ СТОРОН</h3>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                5.1. За неисполнение обязательств Стороны несут ответственность в соответствии с
                законодательством РФ (ст. 393, 395, 401 ГК РФ).
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                5.2. При просрочке оплаты Заказчик уплачивает неустойку 0,1% от суммы за каждый день просрочки.
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                5.3. Исполнитель не гарантирует достижение конкретного коммерческого результата, но гарантирует
                оказание услуг надлежащего качества и привлечение целевых лидов.
              </p>

              <h3 className="font-bold text-center my-4 text-sm md:text-base">6. ПЕРСОНАЛЬНЫЕ ДАННЫЕ</h3>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                6.1. Обработка персональных данных осуществляется в соответствии с ФЗ от 27.07.2006 № 152-ФЗ.
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                6.2. Заказчик выступает оператором ПДн в отношении полученных лидов (ст. 6, 7, 18.1 ФЗ-152).
              </p>

              <h3 className="font-bold text-center my-4 text-sm md:text-base">7. ФОРС-МАЖОР</h3>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                Стороны освобождаются от ответственности за неисполнение обязательств вследствие обстоятельств
                непреодолимой силы (ст. 401 п. 3 ГК РФ). Уведомление — в течение 5 календарных дней.
              </p>

              <h3 className="font-bold text-center my-4 text-sm md:text-base">8. РАЗРЕШЕНИЕ СПОРОВ</h3>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                8.1. Споры разрешаются путём переговоров. Срок ответа на претензию — 15 календарных дней.
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                8.2. При недостижении согласия спор передаётся в суд (ст. 450, 451 ГК РФ).
              </p>

              <h3 className="font-bold text-center my-4 text-sm md:text-base">9. СРОК ДЕЙСТВИЯ И РАСТОРЖЕНИЕ</h3>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                9.1. Договор действует 12 (двенадцать) месяцев, а в части расчётов — до полного исполнения.
              </p>
              <p className="mb-2 leading-relaxed text-justify text-[13px] md:text-sm">
                9.2. Каждая Сторона вправе отказаться от Договора в одностороннем порядке (ст. 782 ГК РФ),
                уведомив другую Сторону за 10 календарных дней.
              </p>

              <h3 className="font-bold text-center my-4 text-sm md:text-base">10. АДРЕСА И РЕКВИЗИТЫ СТОРОН</h3>
              <div className="grid grid-cols-2 gap-6 mt-4 text-[13px]">
                <div>
                  <p className="font-bold mb-2">ИСПОЛНИТЕЛЬ</p>
                  <p className="font-bold">{EXECUTOR.status} {EXECUTOR.name}</p>
                  <p>ИНН: {EXECUTOR.inn}</p>
                  <p>ОГРНИП: {EXECUTOR.ogrn}</p>
                  <p>Р/с: {EXECUTOR.account}</p>
                  <p>Банк: {EXECUTOR.bank}</p>
                  <p>БИК: {EXECUTOR.bik}</p>
                  <p>ИНН банка: {EXECUTOR.bankInn}</p>
                  <div className="mt-8 pt-2 border-t border-slate-400">
                    <p>_________________ / {EXECUTOR.shortName} /</p>
                    <p className="text-xs mt-1">М.П.</p>
                  </div>
                </div>
                <div>
                  <p className="font-bold mb-2">ЗАКАЗЧИК</p>
                  <p className="font-bold">_________________________</p>
                  <p>ИНН: _______________</p>
                  <p>ОГРН/ОГРНИП: _______________</p>
                  <p className="whitespace-pre-wrap">Реквизиты: ___________________</p>
                  <div className="mt-8 pt-2 border-t border-slate-400">
                    <p>_________________ / __________ /</p>
                    <p className="text-xs mt-1">М.П.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}