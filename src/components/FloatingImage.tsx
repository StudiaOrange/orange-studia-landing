// src/components/FloatingImage.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell } from 'lucide-react'

export default function FloatingImage() {
  const [showPopup, setShowPopup] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const notifications = [
    'Заявка для сайта окон',
    'Заявка для сайта видеонаблюдение',
    'Заявка для сайта скупка',
    'Заявка для сайта клининг',
    'Заявка для сайта ремонт квартир',
    'Заявка для сайта строительство домов',
    'Заявка для сайта продажа участков',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPopup(true)
      setTimeout(() => {
        setShowPopup(false)
        setCurrentIndex((prev) => (prev + 1) % notifications.length)
      }, 3000)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-30">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Основное изображение */}
        <div className="w-64 h-80 bg-gradient-to-br from-blue-100 to-orange-100 rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
          <img
            src="/floating-image.png"
            alt="Performance Marketing"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjMyMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5NGEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7QoNC+0YPRg9C30YI8L3RleHQ+PC9zdmc+'
            }}
          />
        </div>

        {/* Всплывающее уведомление */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="absolute -left-4 top-4 bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 min-w-[280px]"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 rounded-full p-2 flex-shrink-0">
                  <Bell className="text-white" size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Новая заявка</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {notifications[currentIndex]}
                  </p>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}