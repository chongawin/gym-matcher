'use client'

import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages, Locale } from 'next-intl'
import { ReactNode } from 'react'

interface NextIntlProviderWrapperProps {
  locale: Locale
  messages: AbstractIntlMessages
  children: ReactNode
}

export function NextIntlProviderWrapper({
  locale,
  messages,
  children,
}: NextIntlProviderWrapperProps) {
  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages}
      timeZone="Asia/Bangkok"
    >
      {children}
    </NextIntlClientProvider>
  )
}
