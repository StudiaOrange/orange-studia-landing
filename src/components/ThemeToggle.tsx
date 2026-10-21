// src/components/ThemeToggle.tsx
'use client'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label="Переключить тему"
      className={`flex items-center w-16 h-9 rounded-full p-1 transition-colors duration-300 ${
        isDark ? 'bg-slate-700 justify-end' : 'bg-slate-200 justify-start'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className={`w-7 h-7 rounded-full shadow-md flex items-center justify-center ${
          isDark ? 'bg-slate-900' : 'bg-white'
        }`}
      >
        {isDark ? <Moon size={14} className="text-blue-400" /> : <Sun size={14} className="text-orange-500" />}
      </motion.span>
    </button>
  )
}