// src/components/Providers.tsx
'use client'
import { ThemeProvider } from '@/context/ThemeContext'
import { LeadsProvider } from '@/context/LeadsContext'
import { PartnerProvider } from '@/context/PartnerContext'
import { BillingProvider } from '@/context/BillingContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LeadsProvider>
        <PartnerProvider>
          <BillingProvider>{children}</BillingProvider>
        </PartnerProvider>
      </LeadsProvider>
    </ThemeProvider>
  )
}