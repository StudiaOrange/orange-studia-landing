// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

const SITE_URL = 'https://cash-boom.live'

/* ===== КРИТИЧНО ДЛЯ МОБИЛЬНЫХ: правильный viewport ===== */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1220' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Orange Studia — сайт и реклама бесплатно, оплата только за лиды',
    template: '%s | Orange Studia',
  },
  description:
    'Performance-агентство Orange Studia: бесплатно разработаем сайт, промо-материалы и настроим рекламу. Вы платите только за целевые лиды.',
  icons: {
    icon: [
      { url: '/images/favicon.png', sizes: 'any', type: 'image/png' },
      { url: '/images/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon.png', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: ['/images/favicon.png'],
    apple: [{ url: '/images/favicon.png', sizes: '180x180', type: 'image/png' }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Orange Studia',
      url: SITE_URL,
      logo: `${SITE_URL}/images/favicon.png`,
    },
    { '@type': 'WebSite', name: 'Orange Studia', url: SITE_URL, inLanguage: 'ru' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}