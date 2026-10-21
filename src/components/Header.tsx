// src/components/Header.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, UserPlus, ExternalLink, BarChart3 } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { usePartner } from '@/context/PartnerContext'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated } = usePartner()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#how-it-works', label: 'Как работаем' },
    { href: '#terms', label: 'Условия' },
    { href: '#cases', label: 'Кейсы' },
    { href: '#reviews', label: 'Отзывы' },
    { href: '#partners', label: 'Нам доверяют' },
    { href: '#news', label: 'Новости' },
    { href: '#contacts', label: 'Контакты' },
  ]

  const renderAuthButtons = (mobile = false) => {
    const base = mobile
      ? 'w-full flex items-center justify-center space-x-2 px-4 py-3 font-bold rounded-xl text-sm'
      : 'flex items-center space-x-1.5 px-3 lg:px-4 py-2.5 text-xs lg:text-sm font-bold rounded-xl'

    if (isAuthenticated) {
      return (
        <>
          <Link href="/dashboard" className={`${base} bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25`}>
            <BarChart3 size={mobile ? 16 : 14} />
            <span>Мой кабинет</span>
          </Link>
          <a href="https://cash-boom.live/register" target="_blank" rel="noopener noreferrer" className={`${base} bg-blue-600 text-white shadow-lg shadow-blue-600/25`}>
            <ExternalLink size={mobile ? 16 : 14} />
            <span>Перейти в CRM</span>
          </a>
        </>
      )
    }

    return (
      <>
        <Link href="/login" className={`${base} border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200`}>
          <LogIn size={mobile ? 16 : 14} />
          <span>Войти</span>
        </Link>
        <Link href="/register" className={`${base} bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25`}>
          <UserPlus size={mobile ? 16 : 14} />
          <span>Регистрация</span>
        </Link>
        <a href="https://cash-boom.live/register" target="_blank" rel="noopener noreferrer" className={`${base} bg-blue-600 text-white shadow-lg shadow-blue-600/25`}>
          <ExternalLink size={mobile ? 16 : 14} />
          <span>CRM</span>
        </a>
      </>
    )
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-[#0B1220]/85 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-3 sm:px-4 py-3 lg:py-3.5">
        <div className="flex items-center justify-between gap-2">
          <motion.a href="#top" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight shrink-0">
            <span className="text-slate-900 dark:text-white">Orange</span>
            <span className="text-orange-500">Studia</span>
          </motion.a>

          <nav className="hidden xl:flex items-center space-x-5">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            {renderAuthButtons(false)}
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white" aria-label="Меню">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden mt-3 overflow-hidden">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 space-y-2">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium">
                    {link.label}
                  </a>
                ))}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2.5">
                  {renderAuthButtons(true)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}