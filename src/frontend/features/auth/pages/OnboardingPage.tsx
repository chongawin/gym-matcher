'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { useTranslations } from 'next-intl'

import { supabase } from '@/frontend/libs'
import { OnboardingForm } from '@/frontend/features/auth/components'
import { Route } from '@/frontend/enums'

export function OnboardingPage() {
  const router = useRouter()
  const t = useTranslations('auth.onboarding')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.replace(Route.LOGIN)
      } else {
        setUser(session.user)
      }
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-primary-to/10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary-to/10">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/20 to-primary-via/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-primary-to/20 to-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/5 blur-2xl" />
      </div>

      <div className="relative w-full max-w-md py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('title')}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('subtitle')}</p>
        </div>
        <OnboardingForm userId={user.id} />
      </div>
    </div>
  )
}
