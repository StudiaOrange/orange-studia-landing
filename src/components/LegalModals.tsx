// src/components/LegalModals.tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, FileText } from 'lucide-react'

export type LegalDoc = 'privacy' | 'terms'

export function openLegalModal(doc: LegalDoc) {
  window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: doc }))
}

const DOC_EDITION = 'Редакция от 16 октября 2026 г., 12:00 (МСК)'

const H = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-5 mb-2">{children}</h4>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{children}</p>
)

function PrivacyContent() {
  return (
    <div>
      <H>1. Общие положения</H>
      <P>1.1. Настоящая Политика конфиденциальности (далее — Политика) разработана в соответствии с п. 2 ч. 1 ст. 18.1 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных пользователей сайта.</P>
      <P>1.2. Оператор персональных данных: индивидуальный предприниматель Мокрушин Михаил Андреевич, ОГРНИП: 326595800114060, ИНН: 590415452100, e-mail: info@cash-boom.live (далее — Оператор).</P>
      <P>1.3. Используя сайт, заполняя формы и нажимая кнопки отправки, пользователь выражает согласие на обработку персональных данных и принимает условия настоящей Политики.</P>

      <H>2. Состав обрабатываемых данных</H>
      <P>2.1. Оператор может обрабатывать следующие данные: имя; номер контактного телефона; адрес электронной почты; сведения о сфере деятельности (нише); файлы cookie и обезличенные технические данные (IP-адрес, тип браузера и устройства).</P>
      <P>2.2. Пользователь не передает Оператору специальные категории персональных данных, биометрические данные и иные данные, требующие особой защиты.</P>

      <H>3. Цели обработки</H>
      <P>3.1. Обработка осуществляется в целях: обратной связи и подготовки коммерческого предложения; заключения и исполнения договоров; направления сервисных уведомлений; анализа качества работы сайта и улучшения услуг.</P>
      <P>3.2. Оператор не осуществляет продажу персональных данных третьим лицам и не использует их для целей, не указанных в настоящей Политике.</P>

      <H>4. Правовые основания и принципы</H>
      <P>4.1. Правовым основанием обработки является согласие пользователя (ст. 6, 9 ФЗ № 152-ФЗ), а также заключаемые с Оператором договоры.</P>
      <P>4.2. Обработка осуществляется на принципах законности, ограничения конкретными целями, недопустимости объединения несовместимых баз данных, достоверности и хранения в форме, позволяющей идентифицировать субъекта, не дольше требуемого срока.</P>

      <H>5. Порядок и условия обработки</H>
      <P>5.1. Обработка ведется с использованием средств автоматизации и без них.</P>
      <P>5.2. Запись персональных данных осуществляется в базы данных на серверах, находящихся на территории Российской Федерации (ч. 5 ст. 18 ФЗ № 152-ФЗ).</P>
      <P>5.3. Данные хранятся до достижения целей обработки либо до момента отзыва согласия пользователем.</P>

      <H>6. Файлы cookie</H>
      <P>6.1. Сайт использует файлы cookie для корректной работы и анализа посещаемости. Пользователь может отключить cookie в настройках браузера; при этом отдельные функции сайта могут работать некорректно.</P>

      <H>7. Права субъекта данных</H>
      <P>7.1. Пользователь вправе запрашивать сведения об обработке своих данных, требовать их уточнения, блокирования или уничтожения, а также отозвать согласие, направив обращение на e-mail: info@cash-boom.live.</P>
      <P>7.2. Оператор рассматривает обращение и отвечает на него в срок, не превышающий 10 рабочих дней с момента получения.</P>

      <H>8. Меры защиты</H>
      <P>8.1. Оператор применяет необходимые организационные и технические меры защиты персональных данных в соответствии с требованиями ФЗ № 152-ФЗ и нормативных актов ФСТЭК России.</P>

      <H>9. Заключительные положения</H>
      <P>9.1. Оператор вправе изменять Политику. Актуальная редакция публикуется на сайте. {DOC_EDITION}.</P>
    </div>
  )
}

function TermsContent() {
  return (
    <div>
      <H>1. Общие положения</H>
      <P>1.1. Настоящее Пользовательское соглашение (далее — Соглашение) определяет условия использования сайта и получения услуг и является публичной офертой в соответствии со ст. 437 ГК РФ.</P>
      <P>1.2. Использование сайта, направление заявок и осуществление платежей означают полное и безоговорочное принятие условий Соглашения (акцепт оферты).</P>
      <P>1.3. Оператор: индивидуальный предприниматель Мокрушин Михаил Андреевич, ОГРНИП: 326595800114060, ИНН: 590415452100, e-mail: info@cash-boom.live.</P>

      <H>2. Термины и определения</H>
      <P>2.1. Сайт — совокупность информации и программных средств, размещенных в сети Интернет. Услуги — услуги в сфере маркетинга: разработка сайта, промо-материалов, настройка рекламных кампаний, лидогенерация. Заявка — обращение пользователя через формы сайта. Депозит — денежные средства, вносимые заказчиком для закупки трафика и оплаты лидов.</P>

      <H>3. Предмет Соглашения</H>
      <P>3.1. Оператор оказывает заказчику услуги согласно выбранной модели сотрудничества: разработка сайта и рекламных инфраструктур осуществляется за счет Оператора, заказчик оплачивает целевые лиды в рамках внесенного депозита.</P>
      <P>3.2. Конкретные условия, сроки, KPI и стоимость лида фиксируются в отдельном договоре, заключаемом сторонами в письменной форме.</P>

      <H>4. Порядок заключения договора</H>
      <P>4.1. Заявка на сайте является выражением намерения заключить договор и не создает обязательств до подписания договора сторонами.</P>
      <P>4.2. Договор считается заключенным с момента его подписания обеими сторонами либо акцепта оферты, если это предусмотрено текстом договора.</P>

      <H>5. Оплата и расчеты</H>
      <P>5.1. Заказчик вносит депозит, который расходуется исключительно на закупку рекламного трафика и оплату целевых лидов по согласованной стоимости.</P>
      <P>5.2. Нецелевые обращения (спам, ошибки номером, автоответчики, недозвоны) подлежат отбраковке; средства за них возвращаются на баланс депозита.</P>
      <P>5.3. Все расходы отображаются в личном кабинете платформы в режиме реального времени.</P>

      <H>6. Ответственность сторон и оговорки</H>
      <P>6.1. Информация на сайте, включая результаты калькуляторов и прогнозные показатели, носит справочный характер, не является гарантией результата и не может рассматриваться как публичная оферта соответствующих финансовых условий.</P>
      <P>6.2. Стороны несут ответственность в соответствии с законодательством Российской Федерации и условиями заключенного договора.</P>
      <P>6.3. Стороны освобождаются от ответственности за неисполнение обязательств вследствие обстоятельств непреодолимой силы (форс-мажор).</P>

      <H>7. Интеллектуальная собственность</H>
      <P>7.1. Контент сайта является собственностью Оператора и охраняется законодательством РФ.</P>
      <P>7.2. Права на результаты работ (сайт, промо-материалы, рекламные кабинеты) передаются заказчику на условиях и в сроки, предусмотренные договором.</P>

      <H>8. Разрешение споров</H>
      <P>8.1. Споры разрешаются путем переговоров. Срок ответа на претензию — 15 календарных дней с момента получения.</P>
      <P>8.2. При недостижении согласия спор передается на рассмотрение суда в соответствии с законодательством Российской Федерации.</P>

      <H>9. Заключительные положения</H>
      <P>9.1. Оператор вправе изменять условия Соглашения с публикацией новой редакции на сайте. {DOC_EDITION}.</P>
    </div>
  )
}

export default function LegalModals() {
  const [active, setActive] = useState<LegalDoc | null>(null)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      setActive((e as CustomEvent<LegalDoc>).detail)
      setScrolledToBottom(false)
    }
    window.addEventListener('open-legal-modal', handler)
    return () => window.removeEventListener('open-legal-modal', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [active])

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && scrolledToBottom && setActive(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [scrolledToBottom])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setScrolledToBottom(true)
    }
  }

  const docs = {
    privacy: { title: 'Политика конфиденциальности', icon: ShieldCheck, content: <PrivacyContent /> },
    terms: { title: 'Пользовательское соглашение', icon: FileText, content: <TermsContent /> },
  }

  const handleClose = () => {
    if (scrolledToBottom) setActive(null)
  }

  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full relative overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]">
              {/* Шапка */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 md:p-6 text-white flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const Icon = docs[active].icon
                      return <Icon size={20} />
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-extrabold">{docs[active].title}</h3>
                    <p className="text-blue-200 text-xs mt-0.5">{DOC_EDITION}</p>
                  </div>
                </div>
              </div>

              {/* Контент с прокруткой */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="p-5 md:p-7 overflow-y-auto flex-1"
              >
                {docs[active].content}

                {!scrolledToBottom && (
                  <div className="mt-6 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                    <span className="inline-block w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                    <span>Прокрутите документ до конца для подтверждения</span>
                  </div>
                )}
                {scrolledToBottom && (
                  <div className="mt-6 flex items-center space-x-2 text-xs text-green-600 dark:text-green-400 font-bold">
                    <ShieldCheck size={16} />
                    <span>Документ прочитан полностью</span>
                  </div>
                )}
              </div>

              {/* Футер */}
              <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left leading-relaxed">
                  ИП Мокрушин М.А. · ИНН 590415452100 · ОГРНИП 326595800114060
                </p>
                <button
                  onClick={handleClose}
                  disabled={!scrolledToBottom}
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                    scrolledToBottom
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {scrolledToBottom ? 'Подтверждаю' : 'Прочтите полностью ↓'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}