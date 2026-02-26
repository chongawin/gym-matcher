'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Button } from '@/frontend/components/ui'
import { supabase } from '@/frontend/libs'
import { Route } from '@/frontend/enums'

export const HeroSection = () => {
  const router = useRouter()
  const t = useTranslations('home')

  const handleStartMatching = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push(Route.MATCH)
    } else {
      router.push(`${Route.LOGIN}?redirect=${Route.MATCH}`)
    }
  }

  // const handleHowItWorks = () => {
  //   document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  // }

  return (
    <div className="relative w-full pt-28">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/10 to-primary-to/10 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-primary-to/10 to-primary/10 blur-3xl" />
      </div>

      <div className="relative text-center space-y-8 max-w-4xl mx-auto px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary dark:border-primary/30 dark:bg-primary/10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {t('badge')}
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
          <span className="bg-gradient-to-r from-primary via-primary-via to-primary-to bg-clip-text text-transparent">
            {t('hero.title1')}
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">{t('hero.title2')}</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
          <Button
            size="lg"
            onClick={handleStartMatching}
            className="bg-gradient-to-r from-primary to-primary-to text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all text-base px-8 py-6 h-auto"
          >
            {t('buttons.startMatching')}
          </Button>
          {/* <Button
            size="lg"
            variant="outline"
            onClick={handleHowItWorks}
            className="border-2 border-slate-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:hover:border-primary dark:hover:bg-primary/10 dark:hover:text-primary text-base px-8 py-6 h-auto"
          >
            {t('buttons.howItWorks')}
          </Button> */}
        </div>
      </div>
    </div>
  )
}
