// src/context/ThemeContext.tsx
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Первичная инициализация из localStorage (только в браузере)
  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem('theme') as Theme | null
      const initialTheme = saved || 'light'
      setTheme(initialTheme)
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', initialTheme === 'dark')
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Сохранение темы при изменении
  useEffect(() => {
    if (!mounted) return
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    try {
      localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    } catch {
      /* ignore */
    }
  }, [theme, mounted])

  // Метод переключения темы (имя 'toggle' — как ожидает ThemeToggle.tsx)
  const toggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  // Предотвращаем гидратационные ошибки при SSR
  if (!mounted) return null

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}