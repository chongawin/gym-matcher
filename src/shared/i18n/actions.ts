'use server'

import { cookies } from 'next/headers'

import type { Locale } from 'next-intl'

import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/shared/constants'

export async function setLocale(locale: Locale) {
  const validLocale = SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])
    ? locale
    : DEFAULT_LOCALE

  const store = await cookies()
  store.set('locale', validLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
}
