// src/components/ReelsWidget.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, Volume2, VolumeX, Video } from 'lucide-react'

export default function ReelsWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsExpanded(true), 3500)
    return () => clearTimeout(timer)
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => setIsMuted(true))
    }
    setIsPlaying(!isPlaying)
    setShowHint(false)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div className="fixed left-4 md:left-6 bottom-6 z-40">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="relative w-[240px] md:w-[260px]"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white dark:ring-slate-700 bg-black">
              <div className="relative aspect-[9/16]">
                {/* ВИДЕО: pointer-events-none — курсор не наводится на video,
                    поэтому Яндекс Браузер не показывает «Субтитры» */}
                <video
                  ref={videoRef}
                  src="/videos/reel.mp4"
                  poster="/videos/reel-poster.jpg"
                  playsInline
                  loop
                  muted={isMuted}
                  disablePictureInPicture
                  disableRemotePlayback
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onLoadedData={(e) => {
                    const v = e.currentTarget
                    v.muted = true
                    v.play().catch(() => {})
                  }}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                />

                {/* Прозрачный оверлей: перехватывает клики (play/pause),
                    находится НАД видео, но ПОД кнопками управления */}
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
                  className="absolute inset-0 z-10 cursor-pointer focus:outline-none"
                />

                {/* Градиент снизу для читаемости кнопок */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10"></div>

                {/* Кнопка закрыть */}
                <button
                  onClick={() => setIsExpanded(false)}
                  aria-label="Свернуть видео"
                  className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors flex items-center justify-center"
                >
                  <X size={16} />
                </button>

                {/* Лейбл Reels */}
                <div className="absolute top-3 left-3 z-20 bg-orange-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg pointer-events-none">
                  Reels
                </div>

                {/* Подсказка при загрузке */}
                {showHint && !isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white pointer-events-none"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 animate-pulse">
                      <Play size={22} fill="white" />
                    </div>
                    <p className="text-xs font-bold">Нажмите для звука</p>
                  </motion.div>
                )}

                {/* Нижние контролы */}
                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
                  <button
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors flex items-center justify-center"
                    aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
                  >
                    {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors flex items-center justify-center"
                    aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsExpanded(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl shadow-orange-500/40 flex items-center justify-center text-white"
            aria-label="Открыть видео"
          >
            <Video size={22} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}