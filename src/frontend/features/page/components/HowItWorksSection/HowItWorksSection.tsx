'use client'

import { useTranslations } from 'next-intl'

export const HowItWorksSection = () => {
  const t = useTranslations('home.howItWorks')

  const steps = [
    {
      step: '01',
      icon: '📅',
      title: t('steps.1.title'),
      description: t('steps.1.description'),
      color: 'from-primary to-primary-to',
    },
    {
      step: '02',
      icon: '🤝',
      title: t('steps.2.title'),
      description: t('steps.2.description'),
      color: 'from-rose-500 to-pink-500',
    },
    {
      step: '03',
      icon: '🏋️',
      title: t('steps.3.title'),
      description: t('steps.3.description'),
      color: 'from-orange-500 to-red-500',
    },
  ]
  return (
    <section id="how-it-works" className="w-full max-w-5xl">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {t('title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary-to/30 to-primary/20 -translate-y-1/2 z-0" />

        {steps.map((s, i) => (
          <div
            key={s.step}
            className="relative z-10 group flex flex-col items-center text-center rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Step number */}
            <div
              className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg text-white text-2xl`}
            >
              {s.icon}
            </div>
            <div className="mb-1 text-xs font-bold tracking-widest text-primary uppercase">
              {t('stepLabel')} {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{s.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
