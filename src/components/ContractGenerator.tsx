// src/components/ContractGenerator.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Printer, Save, Eye, Trash2, ArrowLeft, Lock, Plus, Download,
} from 'lucide-react'
import { useBilling } from '@/context/BillingContext'
import { usePartner } from '@/context/PartnerContext'

/* ===== РЕКВИЗИТЫ ИСПОЛНИТЕЛЯ — ЗАФИКСИРОВАНЫ ===== */
const EXECUTOR = Object.freeze({
  status: 'Индивидуальный предприниматель',
  name: 'Мокрушин Михаил Андреевич',
  shortName: 'ИП Мокрушин М.А.',
  inn: '590415452100',
  ogrn: '326595800114060',
  account: '40802810220001144204',
  bank: 'ООО "Банк Точка"',
  bik: '044525104',
  bankInn: '9721194461',
})

export interface ContractData {
  clientFio: string
  clientOgrn: string
  clientInn: string
  clientRequisites: string
  leadPrice: string
  orderPrice: string
}

export interface SavedContract extends ContractData {
  id: string
  number: string
  date: string
  createdAt: number
}

const CONTRACTS_KEY = 'orange_studia_contracts'
const EMPTY_FORM: ContractData = {
  clientFio: '', clientOgrn: '', clientInn: '', clientRequisites: '',
  leadPrice: '', orderPrice: '',
}

export default function ContractGenerator() {
  const { notifyDepositRequired } = useBilling()
  const { partner } = usePartner()

  const [mode, setMode] = useState<'list' | 'form' | 'preview'>('list')
  const [saved, setSaved] = useState<SavedContract[]>([])
  const [current, setCurrent] = useState<SavedContract | null>(null)
  const [form, setForm] = useState<ContractData>(EMPTY_FORM)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem(CONTRACTS_KEY) || '[]')) } catch { /* ignore */ }
  }, [])

  const persist = (list: SavedContract[]) => {
    setSaved(list)
    try { localStorage.setItem(CONTRACTS_KEY, JSON.stringify(list)) } catch { /* ignore */ }
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const hasPricing = form.leadPrice.trim() !== '' || form.orderPrice.trim() !== ''

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientFio.trim()) { showToast('❌ Укажите ФИО или наименование заказчика'); return }
    if (!hasPricing) { showToast('❌ Укажите стоимость лида и/или заявки'); return }
    const num = `ДЛ-${new Date().getFullYear()}-${String(saved.length + 1).padStart(3, '0')}`
    setCurrent({ ...form, id: '', number: num, date: new Date().toISOString().slice(0, 10), createdAt: Date.now() })
    setMode('preview')
  }

  const handleSave = () => {
    if (!current) return
    const contract: SavedContract = {
      ...current,
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    }
    persist([contract, ...saved])
    // Уведомляем админку о необходимости стартового депозита
    if (partner) notifyDepositRequired(partner.id, contract.number)
    showToast('✅ Договор сохранён. Администратор уведомлён о депозите 50 000 ₽.')
    setMode('list')
  }

  const handleDownload = () => { window.print() }

  const openSaved = (c: SavedContract) => { setCurrent(c); setMode('preview') }

  const deleteSaved = (id: string) => {
    if (!confirm('Удалить договор?')) return
    persist(saved.filter((c) => c.id !== id))
    showToast('Договор удалён')
  }

  const startNew = () => { setForm(EMPTY_FORM); setMode('form') }

  const inputCls = 'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/20'
  const labelCls = 'block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider'

  return (
    <div className="max-w-5xl mx-auto">
      {mode === 'list' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Договоры</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Создано: {saved.length}</p>
            </div>
            <button onClick={startNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-shadow">
              <Plus size={16} /> Создать договор
            </button>
          </div>

          {saved.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-1">Договоров пока нет</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Создайте первый договор — заполните данные заказчика и скачайте готовый документ</p>
              <button onClick={startNew} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25">
                <Plus size={16} /> Создать договор
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {saved.map((c) => (
                <motion.div key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white">{c.number}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.clientFio} · от {new Date(c.date).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openSaved(c)} className="py-2 px-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-500/20">
                      <Eye size={13} /> Открыть
                    </button>
                    <button onClick={() => deleteSaved(c.id)} className="py-2 px-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === 'form' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <FileText size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Новый договор</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Заполните данные заказчика</p>
              </div>
            </div>
            <button onClick={() => setMode('list')} className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700">
              <ArrowLeft size={16} />
            </button>
          </div>

          <form onSubmit={handlePreview} className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={14} className="text-orange-500" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Исполнитель (нельзя изменить)</p>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{EXECUTOR.status} {EXECUTOR.name}</p>
              <div className="grid sm:grid-cols-3 gap-2 mt-2 text-xs text-slate-600 dark:text-slate-400">
                <p>ИНН: {EXECUTOR.inn}</p>
                <p>ОГРНИП: {EXECUTOR.ogrn}</p>
                <p>Банк: {EXECUTOR.bank}</p>
              </div>
            </div>

            <div>
              <label className={labelCls}>ФИО / Наименование заказчика *</label>
              <input type="text" value={form.clientFio} onChange={(e) => setForm({ ...form, clientFio: e.target.value })} required className={inputCls} placeholder="Иванов Иван Иванович" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>ОГРН / ОГРНИП</label>
                <input type="text" value={form.clientOgrn} onChange={(e) => setForm({ ...form, clientOgrn: e.target.value })} className={inputCls} placeholder="324774600000000" />
              </div>
              <div>
                <label className={labelCls}>ИНН</label>
                <input type="text" value={form.clientInn} onChange={(e) => setForm({ ...form, clientInn: e.target.value })} className={inputCls} placeholder="770000000000" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Реквизиты заказчика (банковский счёт и т.д.)</label>
              <textarea value={form.clientRequisites} onChange={(e) => setForm({ ...form, clientRequisites: e.target.value })} rows={2} className={`${inputCls} resize-none`} placeholder="Расчётный счёт, банк, БИК..." />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Стоимость лида, ₽</label>
                <input type="number" min="0" value={form.leadPrice} onChange={(e) => setForm({ ...form, leadPrice: e.target.value })} className={inputCls} placeholder="Например: 850" />
              </div>
              <div>
                <label className={labelCls}>Стоимость заявки, ₽</label>
                <input type="number" min="0" value={form.orderPrice} onChange={(e) => setForm({ ...form, orderPrice: e.target.value })} className={inputCls} placeholder="Например: 1200" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-2">Можно указать и стоимость лида, и стоимость заявки, либо что-то одно.</p>

            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2">
              <Eye size={18} /> Предпросмотр договора
            </button>
          </form>
        </motion.div>
      )}

      {mode === 'preview' && current && (
        <div>
          <div className="no-print flex items-center justify-between flex-wrap gap-3 mb-4">
            <button onClick={() => setMode(current.id ? 'list' : 'form')} className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors">
              <ArrowLeft size={16} /> Назад
            </button>
            <div className="flex gap-2">
              {!current.id && (
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-orange-500/25 hover:shadow-xl">
                  <Save size={15} /> Сохранить договор
                </button>
              )}
              <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-600/25 hover:bg-blue-700">
                <Download size={15} /> Скачать (Сохранить как PDF)
              </button>
            </div>
          </div>

          <div id="contract-print-area" className="bg-white text-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-sm">
            <ContractDocument data={current} />
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <Printer size={18} className="text-orange-400 dark:text-orange-600" />
          <p className="text-sm font-medium">{toast}</p>
        </div>
      )}
    </div>
  )
}

/* ===== ПОЛНЫЙ ТЕКСТ ДОГОВОРА ===== */
function ContractDocument({ data }: { data: SavedContract }) {
  const fmtDate = new Date(data.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  const hasLead = data.leadPrice.trim() !== ''
  const hasOrder = data.orderPrice.trim() !== ''

  const p = 'mb-2 leading-relaxed text-justify text-[13px] md:text-sm'
  const h = 'font-bold text-center my-4 text-sm md:text-base'
  const sub = 'font-bold mt-4 mb-2 text-sm md:text-base'

  return (
    <div className="contract-doc">
      <h1 className="text-center font-extrabold text-lg md:text-xl mb-1">ДОГОВОР № {data.number}</h1>
      <p className="text-center font-bold text-sm md:text-base mb-1">на оказание услуг по привлечению клиентов (лидогенерации)</p>
      <div className="flex justify-between text-xs md:text-sm mb-4 mt-4">
        <span>г. Пермь</span>
        <span>«{fmtDate}»</span>
      </div>

      <div className={p}>
        <strong>{EXECUTOR.status} {EXECUTOR.name}</strong>, ОГРНИП {EXECUTOR.ogrn}, ИНН {EXECUTOR.inn}, именуемый в дальнейшем <strong>«Исполнитель»</strong>, действующий на основании государственной регистрации, с одной стороны, и
      </div>
      <div className={p}>
        <strong>{data.clientFio}</strong>{data.clientOgrn ? `, ОГРН/ОГРНИП ${data.clientOgrn}` : ''}{data.clientInn ? `, ИНН ${data.clientInn}` : ''}, именуемый(ая) в дальнейшем <strong>«Заказчик»</strong>, с другой стороны, совместно именуемые «Стороны», заключили настоящий Договор (далее — «Договор») о нижеследующем:
      </div>

      <h2 className={h}>1. ПРЕДМЕТ ДОГОВОРА</h2>
      <div className={p}>1.1. Исполнитель обязуется оказать Заказчику услуги по привлечению целевых клиентов (лидогенерации), включая разработку сайта (лендинга), создание промо-материалов, настройку рекламных кампаний и привлечение целевых заявок (лидов), а Заказчик обязуется принять и оплатить оказанные услуги в порядке и на условиях, предусмотренных настоящим Договором.</div>
      <div className={p}>1.2. Разработка сайта и промо-материалов осуществляется за счёт Исполнителя и не оплачивается Заказчиком отдельно, если иное прямо не предусмотрено настоящим Договором.</div>
      <div className={p}>1.3. Оплата производится Заказчиком исключительно за фактически полученные целевые лиды и/или заявки по стоимости, согласованной Сторонами в разделе 3 настоящего Договора.</div>
      <div className={p}>1.4. Настоящий Договор заключён в соответствии со статьями 420, 421, 432, 434, 779, 780 Гражданского кодекса Российской Федерации.</div>

      <h2 className={h}>2. ПОРЯДОК И СРОКИ ОКАЗАНИЯ УСЛУГ</h2>
      <div className={p}>2.1. Исполнитель приступает к оказанию услуг после подписания настоящего Договора и внесения Заказчиком стартового депозита в размере 50 000 (пятидесяти тысяч) рублей.</div>
      <div className={p}>2.2. Каналы привлечения трафика, целевая аудитория и требования к лидам согласовываются Сторонами дополнительно до запуска рекламных кампаний.</div>
      <div className={p}>2.3. Целевым лидом признаётся обращение потенциального клиента, соответствующее согласованным критериям. Обращения, не соответствующие критериям (спам, ошибочные номера, автоответчики, недозвоны), целевыми не признаются и оплате не подлежат.</div>
      <div className={p}>2.4. Исполнитель предоставляет Заказчику доступ к системе учёта заявок для контроля качества и количества лидов в режиме реального времени.</div>
      <div className={p}>2.5. Услуги оказываются в соответствии с требованиями Федерального закона от 13.03.2006 № 38-ФЗ «О рекламе» и иных применимых нормативных правовых актов Российской Федерации.</div>

      <h2 className={h}>3. СТОИМОСТЬ УСЛУГ И ПОРЯДОК РАСЧЁТОВ</h2>
      {hasLead && <div className={p}>3.1. Стоимость одного целевого лида составляет <strong>{data.leadPrice} рублей 00 копеек</strong> (НДС не облагается в связи с применением Исполнителем упрощённой системы налогообложения на основании ст. 346.11 Налогового кодекса Российской Федерации).</div>}
      {hasOrder && <div className={p}>3.2. Стоимость одной заявки составляет <strong>{data.orderPrice} рублей 00 копеек</strong> (НДС не облагается на основании ст. 346.11 Налогового кодекса Российской Федерации).</div>}
      <div className={p}>3.3. Стартовый депозит в размере 50 000 (пятидесяти тысяч) рублей вносится Заказчиком после подписания Договора и расходуется на закупку рекламного трафика и оплату целевых лидов/заявок.</div>
      <div className={p}>3.4. Оплата за фактически полученные лиды и/или заявки свыше депозита производится Заказчиком на основании выставленных Исполнителем актов в порядке, согласованном Сторонами.</div>
      <div className={p}>3.5. Неиспользованный остаток депозита подлежит возврату Заказчику в течение 10 (десяти) рабочих дней с момента поступления соответствующего требования.</div>
      <div className={p}>3.6. Расчёты между Сторонами производятся в безналичной форме в российских рублях.</div>

      <h2 className={h}>4. ПРАВА И ОБЯЗАННОСТИ ИСПОЛНИТЕЛЯ</h2>
      <div className={p}>4.1. Исполнитель обязуется: оказывать услуги надлежащего качества и в согласованные сроки; согласовывать с Заказчиком ключевые параметры рекламных кампаний; предоставлять Заказчику доступ к статистике и учёту заявок; соблюдать требования законодательства Российской Федерации о рекламе и персональных данных.</div>
      <div className={p}>4.2. Исполнитель вправе: самостоятельно определять методы и инструменты оказания услуг, если они не противоречат законодательству и согласованным параметрам; приостановить оказание услуг в случае просрочки оплаты Заказчиком более чем на 10 (десять) рабочих дней.</div>

      <h2 className={h}>5. ПРАВА И ОБЯЗАННОСТИ ЗАКАЗЧИКА</h2>
      <div className={p}>5.1. Заказчик обязуется: предоставлять Исполнителю достоверную информацию и материалы, необходимые для оказания услуг; своевременно производить оплату; согласовывать критерии целевых лидов; обрабатывать полученные персональные данные в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</div>
      <div className={p}>5.2. Заказчик вправе: контролировать ход оказания услуг; запрашивать отчётность; подтверждать или отбраковывать поступившие заявки в согласованном порядке.</div>

      <h2 className={h}>6. ОТВЕТСТВЕННОСТЬ СТОРОН</h2>
      <div className={p}>6.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему Договору Стороны несут ответственность в соответствии с действующим законодательством Российской Федерации (ст. 393, 395, 401 Гражданского кодекса Российской Федерации).</div>
      <div className={p}>6.2. В случае просрочки оплаты Заказчик уплачивает Исполнителю неустойку в размере 0,1% от суммы задолженности за каждый день просрочки (ст. 330 Гражданского кодекса Российской Федерации).</div>
      <div className={p}>6.3. Исполнитель не гарантирует достижение конкретного коммерческого результата (количество продаж, объём выручки Заказчика), поскольку результат зависит от факторов, находящихся вне контроля Исполнителя. Исполнитель гарантирует оказание услуг надлежащего качества и привлечение целевых лидов в согласованном порядке.</div>
      <div className={p}>6.4. Стороны освобождаются от ответственности за частичное или полное неисполнение обязательств вследствие обстоятельств непреодолимой силы (ст. 401 п. 3 Гражданского кодекса Российской Федерации).</div>

      <h2 className={h}>7. ПЕРСОНАЛЬНЫЕ ДАННЫЕ И КОНФИДЕНЦИАЛЬНОСТЬ</h2>
      <div className={p}>7.1. Обработка персональных данных осуществляется Сторонами в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</div>
      <div className={p}>7.2. Заказчик, получая от Исполнителя персональные данные потенциальных клиентов, выступает оператором персональных данных и обязуется обрабатывать их на законных основаниях, обеспечивать их защиту и не передавать третьим лицам без согласия субъектов персональных данных (ст. 6, 7, 18.1 ФЗ № 152-ФЗ).</div>
      <div className={p}>7.3. Стороны обязуются сохранять конфиденциальность информации, полученной в ходе исполнения настоящего Договора, и не разглашать её третьим лицам без письменного согласия другой Стороны.</div>

      <h2 className={h}>8. ОБСТОЯТЕЛЬСТВА НЕПРЕОДОЛИМОЙ СИЛЫ</h2>
      <div className={p}>8.1. Стороны освобождаются от ответственности за неисполнение обязательств, вызванное обстоятельствами непреодолимой силы (форс-мажор): стихийные бедствия, военные действия, акты государственных органов, сбои в работе сетей связи и иные обстоятельства, которые Стороны не могли предвидеть и предотвратить.</div>
      <div className={p}>8.2. Сторона, для которой наступили обстоятельства непреодолимой силы, обязана уведомить другую Сторону в течение 5 (пяти) календарных дней с момента их наступления.</div>

      <h2 className={h}>9. РАЗРЕШЕНИЕ СПОРОВ</h2>
      <div className={p}>9.1. Все споры и разногласия разрешаются путём переговоров. Срок ответа на претензию — 15 (пятнадцать) календарных дней с момента её получения.</div>
      <div className={p}>9.2. При недостижении согласия спор передаётся на рассмотрение суда в соответствии с законодательством Российской Федерации (ст. 450, 451 Гражданского кодекса Российской Федерации).</div>

      <h2 className={h}>10. СРОК ДЕЙСТВИЯ, ИЗМЕНЕНИЕ И РАСТОРЖЕНИЕ</h2>
      <div className={p}>10.1. Настоящий Договор вступает в силу с момента его подписания и действует в течение 12 (двенадцати) месяцев, а в части взаиморасчётов — до полного исполнения Сторонами своих обязательств.</div>
      <div className={p}>10.2. Договор может быть изменён или расторгнут по соглашению Сторон либо по основаниям, предусмотренным ст. 450–453 Гражданского кодекса Российской Федерации.</div>
      <div className={p}>10.3. Каждая из Сторон вправе отказаться от исполнения Договора в одностороннем порядке в соответствии со ст. 782 Гражданского кодекса Российской Федерации, письменно уведомив другую Сторону не менее чем за 10 (десять) календарных дней.</div>

      <h2 className={h}>11. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h2>
      <div className={p}>11.1. Во всём, что не предусмотрено настоящим Договором, Стороны руководствуются действующим законодательством Российской Федерации.</div>
      <div className={p}>11.2. Любые изменения и дополнения к Договору действительны при условии их совершения в письменной форме и подписания обеими Сторонами.</div>
      <div className={p}>11.3. Договор составлен в двух экземплярах, имеющих равную юридическую силу, по одному для каждой из Сторон.</div>
      <div className={p}>11.4. Стороны признают юридическую силу документов и уведомлений, направленных по электронной почте и в мессенджерах, указанных в разделе 12 Договора.</div>

      <h2 className={h}>12. АДРЕСА, РЕКВИЗИТЫ И ПОДПИСИ СТОРОН</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-[13px] md:text-sm">
        <div>
          <p className={sub}>ИСПОЛНИТЕЛЬ</p>
          <p className="font-bold">{EXECUTOR.status} {EXECUTOR.name}</p>
          <p>ИНН: {EXECUTOR.inn}</p>
          <p>ОГРНИП: {EXECUTOR.ogrn}</p>
          <p>Р/с: {EXECUTOR.account}</p>
          <p>Банк: {EXECUTOR.bank}</p>
          <p>БИК: {EXECUTOR.bik}</p>
          <p>ИНН банка: {EXECUTOR.bankInn}</p>
          <div className="mt-10 pt-2 border-t border-slate-400">
            <p>_________________ / {EXECUTOR.shortName} /</p>
            <p className="text-xs mt-1">М.П.</p>
          </div>
        </div>
        <div>
          <p className={sub}>ЗАКАЗЧИК</p>
          <p className="font-bold">{data.clientFio}</p>
          {data.clientInn && <p>ИНН: {data.clientInn}</p>}
          {data.clientOgrn && <p>ОГРН/ОГРНИП: {data.clientOgrn}</p>}
          {data.clientRequisites && <p className="whitespace-pre-wrap">{data.clientRequisites}</p>}
          <div className="mt-10 pt-2 border-t border-slate-400">
            <p>_________________ / ____________________ /</p>
            <p className="text-xs mt-1">М.П.</p>
          </div>
        </div>
      </div>
    </div>
  )
}