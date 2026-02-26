import React from 'react'
import type { Metadata } from 'next'

import { QueryClientProvider, AuthListener } from '@/frontend/components'
import { Navbar } from '@/shared/components'
import { LocalizationProvider } from '@/shared/components/providers'

export const metadata: Metadata = {
  title: 'Next.js ChadCN Project',
  description: 'Monolithic Next.js with Payload CMS',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocalizationProvider>
      <QueryClientProvider>
        <AuthListener />
        <Navbar />
        <main className="pt-16 pb-16 md:pt-20 md:pb-0">{children}</main>
      </QueryClientProvider>
    </LocalizationProvider>
  )
}
