'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Button } from '@/frontend/components/ui'
import { supabase } from '@/frontend/libs'
import { Route } from '@/frontend/enums'

export const CtaSection = () => {
  const router = useRouter()
  const t = useTranslations('home.cta')

  const handleStartMatching = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push(Route.MATCH)
    } else {
      router.push(`${Route.LOGIN}?redirect=${Route.MATCH}`)
    }
  }

  return (
    <section className="w-full max-w-5xl">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-via to-primary-to px-8 py-16 text-center shadow-2xl shadow-primary/30">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative space-y-6">
          <div className="text-5xl">💪</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            {t('title')}
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button
              size="lg"
              onClick={handleStartMatching}
              className="bg-white text-primary hover:bg-white/90 shadow-lg font-bold text-base px-8 py-6 h-auto hover:scale-105 transition-all"
            >
              <span className="mr-2">🏋️</span>
              {t('startMatching')}
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/50 bg-transparent text-white hover:bg-white/10 hover:border-white text-base px-8 py-6 h-auto"
            >
              <Link href={Route.SIGNUP}>
                <span className="mr-2">✨</span>
                {t('createAccount')}
              </Link>
            </Button>
          </div>

          <p className="text-white/60 text-sm">
            {t('hasAccount')}{' '}
            <Link href={Route.LOGIN} className="underline text-white/80 hover:text-white">
              {t('signIn')}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
