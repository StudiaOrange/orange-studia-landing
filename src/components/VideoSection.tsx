'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export default function VideoSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Уделите 2 минуты. Как работает наша модель?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-video bg-dark-card rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
        >
          {/* Video Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark-card to-dark-bg" />
          
          {/* Play Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent rounded-full p-6 shadow-2xl hover:bg-accent-hover transition-all duration-300"
          >
            <Play className="text-white" size={32} fill="white" />
          </motion.button>

          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-20 h-20 border-2 border-accent/20 rounded-full" />
          <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-accent/10 rounded-full" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-text-light mt-8 text-lg"
        >
          Коротко и без воды: как мы делим риски и почему вам выгодно работать за лиды.
        </motion.p>
      </div>
    </section>
  )
}