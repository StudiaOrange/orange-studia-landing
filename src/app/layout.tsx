// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

const SITE_URL = 'https://cash-boom.live'

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
      { url: '/faviconn.png', sizes: 'any', type: 'image/png' },
      { url: '/faviconn.png', sizes: '32x32', type: 'image/png' },
      { url: '/faviconn.png', sizes: '64x64', type: 'image/png' },
      { url: '/faviconn.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: ['/faviconn.png'],
    apple: [{ url: '/faviconn.png', sizes: '180x180', type: 'image/png' }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Orange Studia',
      url: SITE_URL,
      logo: `${SITE_URL}/faviconn.png`,
    },
    { '@type': 'WebSite', name: 'Orange Studia', url: SITE_URL, inLanguage: 'ru' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/faviconn.png" type="image/png" />
        <link rel="shortcut icon" href="/faviconn.png" type="image/png" />
        <link rel="apple-touch-icon" href="/faviconn.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}