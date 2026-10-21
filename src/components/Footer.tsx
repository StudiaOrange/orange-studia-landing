// src/components/Footer.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Phone, Mail, MapPin, Send,
  User, Clock, ArrowRight, Sparkles, Shield, Newspaper,
  MessageCircle, BookOpen, Scale,
} from 'lucide-react'
import {
  FooterLeadModal, PrivacyModal, OfferModal, SampleContractModal,
} from './FooterModals'

/* ===== Ссылки на мессенджеры ===== */
const TELEGRAM_URL = 'https://t.me/studia_orange'
const MAX_URL = 'https://max.ru/join/eohzEFpkT6zM6YOkTSwfrhaAYuEAaUeney0mrnqPOe8'

/* ===== КОНТАКТЫ: номер меняется ТОЛЬКО здесь, в одном месте ===== */
const PHONE_DISPLAY = '+7 (993) 196-05-76'
const PHONE_TEL = 'tel:+79931960576'
const EMAIL = 'info@cash-boom.live'

export default function Footer() {
  const pathname = usePathname()
  const [leadOpen, setLeadOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const [sampleOpen, setSampleOpen] = useState(false)

  /* Ссылка на новости: на главной — плавный скролл, на других страницах — переход на /#news */
  const handleNewsClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault()
      document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-[#0B1220] text-white pt-16 pb-8 overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* О компании */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-extrabold text-lg shadow-lg shadow-orange-500/30">O</div>
              <div>
                <p className="text-base font-extrabold leading-tight">Orange</p>
                <p className="text-[10px] text-slate-400 leading-tight">Performance-агентство</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Разрабатываем сайты и настраиваем рекламу бесплатно — вы платите только за целевые лиды.
              Работаем по договору с депозитом 50 000 ₽.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield size={14} className="text-emerald-400" />
              <span>ИП Мокрушин М.А. · ИНН 590415452100</span>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Меню сайта</p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-orange-400 transition-colors group">
                  <Home size={14} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
                  <span>Главная</span>
                </Link>
              </li>
              <li>
                {pathname === '/' ? (
                  <button onClick={handleNewsClick} className="w-full flex items-center gap-2.5 text-sm text-slate-300 hover:text-orange-400 transition-colors group">
                    <Newspaper size={14} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
                    <span>Новости</span>
                  </button>
                ) : (
                  <Link href="/#news" onClick={handleNewsClick} className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-orange-400 transition-colors group">
                    <Newspaper size={14} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
                    <span>Новости</span>
                  </Link>
                )}
              </li>
              <li>
                <Link href="/login" className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-orange-400 transition-colors group">
                  <User size={14} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
                  <span>Кабинет партнёра</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты: звонок и письмо */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Контакты</p>
            <ul className="space-y-3">
              <li>
                <a href={PHONE_TEL} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <Phone size={14} className="text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Телефон (нажмите — позвоним)</p>
                    <p className="text-sm text-slate-200 hover:text-orange-400 transition-colors">{PHONE_DISPLAY}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <Mail size={14} className="text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Email (нажмите — напишем)</p>
                    <p className="text-sm text-slate-200 hover:text-orange-400 transition-colors truncate">{EMAIL}</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Офис</p>
                    <p className="text-sm text-slate-200">г. Пермь</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Clock size={14} className="text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Работа</p>
                    <p className="text-sm text-slate-200">Пн–Пт, 09:00–20:00</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Соцсети + документы */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Мы в мессенджерах</p>
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Send size={18} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white">Telegram</p>
                  <p className="text-[10px] text-slate-400">@studia_orange</p>
                </div>
              </a>
              <a href={MAX_URL} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white">Max</p>
                  <p className="text-[10px] text-slate-400">max.ru</p>
                </div>
              </a>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Документы</p>
            <div className="space-y-2">
              <button onClick={() => setPrivacyOpen(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all group text-left">
                <Shield size={15} className="text-blue-400" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-orange-400">Политика конфиденциальности</span>
              </button>
              <button onClick={() => setOfferOpen(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all group text-left">
                <Scale size={15} className="text-orange-400" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-orange-400">Договор-оферта</span>
              </button>
              <button onClick={() => setSampleOpen(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all group text-left">
                <BookOpen size={15} className="text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-orange-400">Образец договора (скачать)</span>
              </button>
            </div>
          </div>
        </div>

        {/* CTA блок: кнопка «Рассчитать» открывает форму заявки */}
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm md:text-base">Получите первых клиентов уже через месяц</p>
              <p className="text-xs text-slate-400">Разработка сайта и настройка рекламы — 0 ₽</p>
            </div>
          </div>
          <button onClick={() => setLeadOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-shadow whitespace-nowrap">
            Рассчитать <ArrowRight size={14} />
          </button>
        </div>

        {/* Нижняя строка */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {year} Orange Studia. Все права защищены.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-orange-400 transition-colors">
              Политика конфиденциальности
            </button>
            <button onClick={() => setOfferOpen(true)} className="hover:text-orange-400 transition-colors">
              Договор-оферта
            </button>
            <button onClick={() => setSampleOpen(true)} className="hover:text-orange-400 transition-colors">
              Образец договора
            </button>
            <Link href="/login" className="hover:text-orange-400 transition-colors flex items-center gap-1">
              <User size={12} /> Кабинет партнёра
            </Link>
          </div>
        </div>
      </div>

      {/* ===== МОДАЛЬНЫЕ ОКНА ===== */}
      <FooterLeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <OfferModal open={offerOpen} onClose={() => setOfferOpen(false)} />
      <SampleContractModal open={sampleOpen} onClose={() => setSampleOpen(false)} />
    </footer>
  )
}