'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Button } from '@/frontend/components/ui'

export const HeroSection = () => {
  const t = useTranslations('home')

  return (
    <div className="text-center space-y-6 max-w-4xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
        </span>
        {t('badge')}
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('hero.title1')}
        </span>
        <br />
        <span className="text-slate-900 dark:text-white">{t('hero.title2')}</span>
      </h1>

      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        {t('hero.description')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
        >
          <Link href="/pokemon">
            <span className="mr-2">🎮</span>
            Explore Pokémon
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-2 border-slate-300 hover:border-purple-500 hover:bg-purple-50 dark:border-slate-700 dark:hover:border-purple-500 dark:hover:bg-purple-950/50"
        >
          <Link href="/categories">
            <span className="mr-2">📁</span>
            {t('buttons.browseCategories')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
