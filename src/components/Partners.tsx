// src/components/Partners.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Laptop, Hammer, Home, Sparkles, Wrench, Video, MapPin, Cpu, Brush,
  Building2, TreePine, Smartphone, Sun, ShieldCheck, Leaf,
} from 'lucide-react'

const partners = [
  { name: 'Noutbukoff', image: '/images/partners/noutbukoff.png', icon: Laptop, color: 'text-blue-600 dark:text-blue-400' },
  { name: 'RemontPro', image: '/images/partners/remontpro.png', icon: Hammer, color: 'text-orange-500 dark:text-orange-400' },
  { name: 'DomStroy16', image: '/images/partners/domstroy16.png', icon: Home, color: 'text-green-600 dark:text-green-400' },
  { name: 'CleanCity', image: '/images/partners/cleancity.png', icon: Sparkles, color: 'text-cyan-600 dark:text-cyan-400' },
  { name: 'OknaServis', image: '/images/partners/oknaservis.png', icon: Wrench, color: 'text-blue-500 dark:text-blue-400' },
  { name: 'VideoGuard', image: '/images/partners/videoguard.png', icon: Video, color: 'text-red-500 dark:text-red-400' },
  { name: 'ZemlyaAktiv', image: '/images/partners/zemlyaaktiv.png', icon: MapPin, color: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'TechSkup', image: '/images/partners/techskup.png', icon: Cpu, color: 'text-indigo-500 dark:text-indigo-400' },
  { name: 'KliningPro', image: '/images/partners/kliningpro.png', icon: Brush, color: 'text-pink-500 dark:text-pink-400' },
  { name: 'StroyDom', image: '/images/partners/stroydom.png', icon: Building2, color: 'text-amber-600 dark:text-amber-400' },
  { name: 'Uchastki72', image: '/images/partners/uchastki72.png', icon: TreePine, color: 'text-lime-600 dark:text-lime-400' },
  { name: 'PCMaster', image: '/images/partners/pcmaster.png', icon: Smartphone, color: 'text-violet-600 dark:text-violet-400' },
  { name: 'OknaLux', image: '/images/partners/oknalux.png', icon: Sun, color: 'text-sky-600 dark:text-sky-400' },
  { name: 'SmartDom', image: '/images/partners/smartdom.png', icon: ShieldCheck, color: 'text-teal-600 dark:text-teal-400' },
  { name: 'EcoClean', image: '/images/partners/ecoclean.png', icon: Leaf, color: 'text-green-500 dark:text-green-400' },
]

function PartnerLogo({ partner }: { partner: (typeof partners)[number] }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (partner.image && !imgFailed) {
    return (
      <img
        src={partner.image}
        alt={partner.name}
        onError={() => setImgFailed(true)}
        className="h-7 md:h-9 w-auto object-contain"
      />
    )
  }
  return (
    <>
      <partner.icon className={`w-5 h-5 md:w-6 md:h-6 ${partner.color}`} />
      <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 text-center leading-tight whitespace-nowrap">
        {partner.name}
      </span>
    </>
  )
}

function MarqueeRow({ items, direction, duration }: { items: typeof partners; direction: 'left' | 'right'; duration: number }) {
  const duplicatedItems = [...items, ...items, ...items, ...items]
  return (
    <div className="overflow-hidden py-1 relative group">
      <div
        className={`flex w-max gap-3 md:gap-4 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {duplicatedItems.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="w-36 md:w-44 flex-shrink-0 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-4 flex flex-col items-center justify-center gap-1.5 grayscale opacity-70 dark:grayscale-0 dark:opacity-95 hover:grayscale-0 hover:opacity-100 hover:border-orange-200 dark:hover:border-orange-500/40 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            title={partner.name}
          >
            <PartnerLogo partner={partner} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Partners() {
  const row1 = partners.slice(0, 5)
  const row2 = partners.slice(5, 10)
  const row3 = partners.slice(10, 15)

  return (
    <>
      <style jsx global>{`
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee-left { animation: marquee-left linear infinite; will-change: transform; }
        .animate-marquee-right { animation: marquee-right linear infinite; will-change: transform; }
        .group:hover .animate-marquee-left, .group:hover .animate-marquee-right { animation-play-state: paused; }
      `}</style>

      <section id="partners" className="py-14 md:py-20 bg-white dark:bg-[#0B1220] relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <span className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-4 border border-blue-100 dark:border-blue-500/30">
              Нам доверяют
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
              Компании, которые уже получают лиды
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
              15 партнеров из разных ниш работают с нами по депозитной системе
            </p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-3 md:space-y-4">
          <MarqueeRow items={row1} direction="right" duration={35} />
          <MarqueeRow items={row2} direction="left" duration={45} />
          <MarqueeRow items={row3} direction="right" duration={40} />
        </motion.div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white dark:from-[#0B1220] to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white dark:from-[#0B1220] to-transparent z-10"></div>
      </section>
    </>
  )
}