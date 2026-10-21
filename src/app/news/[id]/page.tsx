// src/app/news/[id]/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Newspaper, ArrowRight, Home } from 'lucide-react'
import { useLeads } from '@/context/LeadsContext'

/* Простой markdown → HTML */
function renderContent(text: string) {
  return text
    .split(/\n\n+/)
    .map((block) => {
      const lines = block.split('\n')
      const isList = lines.every((l) => l.trim().startsWith('- '))
      const inline = (s: string) =>
        s
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      if (isList) {
        const items = lines.map((l) => `<li class="mb-1">${inline(l.trim().slice(2))}</li>`).join('')
        return `<ul class="list-disc pl-5 space-y-1 my-4">${items}</ul>`
      }
      return `<p class="mb-4 leading-relaxed">${inline(block).replace(/\n/g, '<br/>')}</p>`
    })
    .join('')
}

export default function NewsArticlePage() {
  const params = useParams()
  const id = params?.id as string
  const { news } = useLeads()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (news.length > 0) {
      setReady(true)
      return
    }
    const t = setTimeout(() => setReady(true), 800)
    return () => clearTimeout(t)
  }, [news.length])

  const article = news.find((n) => n.id === id)
  const related = news.filter((n) => n.id !== id).slice(0, 3)

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-10 md:p-14 text-center max-w-md shadow-xl">
          <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <Newspaper size={40} className="text-slate-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Новость не найдена</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Возможно, она была удалена или ссылка устарела.
          </p>
          <Link
            href="/#news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25"
          >
            <ArrowLeft size={16} /> Ко всем новостям
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] py-10 md:py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Назад */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/#news"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Ко всем новостям
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden"
        >
          {/* Баннер */}
          <div className="relative h-64 md:h-96 bg-slate-100 dark:bg-slate-900 overflow-hidden">
            {article.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-400 flex items-center justify-center">
                <Newspaper size={72} className="text-white/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-5 flex items-center gap-3 text-white text-xs font-semibold flex-wrap">
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Calendar size={12} />
                {new Date(article.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <User size={12} />
                {article.author || 'Команда'}
              </span>
            </div>
          </div>

          {/* Контент */}
          <div className="p-6 md:p-10">
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-5">
              {article.title}
            </h1>

            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 font-medium leading-relaxed mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
              {article.excerpt}
            </p>

            {article.content ? (
              <div
                className="text-slate-600 dark:text-slate-300 text-base md:text-lg"
                dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
              />
            ) : (
              <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* CTA */}
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
                Хотите такие же результаты в своей нише?
              </p>
              <Link
                href="/#contacts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-shadow whitespace-nowrap"
              >
                Обсудить партнерство <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.article>

        {/* Похожие новости */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-5">Читайте также</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((n) => (
                <Link key={n.id} href={`/news/${n.id}`} className="group">
                  <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-md hover:shadow-xl transition-all group-hover:-translate-y-1 h-full">
                    <div className="h-24 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                      {n.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={n.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                          <Newspaper size={24} className="text-white/50" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {n.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Домой */}
        <div className="mt-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Home size={15} /> На главную
          </Link>
        </div>
      </div>
    </div>
  )
}