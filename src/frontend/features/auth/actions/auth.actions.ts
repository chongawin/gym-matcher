'use server'

import { cookies } from 'next/headers'

const COOKIE_OPTS = {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
} as const

export async function setLoginCookies(profileComplete: boolean) {
  const store = await cookies()
  store.set('auth_logged_in', '1', {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  if (profileComplete) {
    store.set('profile_complete', '1', {
      ...COOKIE_OPTS,
      maxAge: 60 * 60 * 24 * 365,
    })
  } else {
    store.delete('profile_complete')
  }
}

export async function setProfileCompleteCookie() {
  const store = await cookies()
  store.set('profile_complete', '1', {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 365,
  })
}

export async function clearAuthCookies() {
  const store = await cookies()
  store.delete('auth_logged_in')
  store.delete('profile_complete')
}
