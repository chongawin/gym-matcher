'use client'

import { FeatureCard } from './FeatureCard'

const features = [
  {
    icon: '📅',
    title: 'Schedule Matching',
    description: 'Match with partners who train on the same days, times, and gym as you.',
    gradientFrom: 'from-primary',
    gradientTo: 'to-primary-to',
  },
  {
    icon: '🤝',
    title: 'One-at-a-Time',
    description: 'We suggest one compatible partner at a time — focused and intentional matching.',
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-pink-500',
  },
  {
    icon: '🛡️',
    title: 'Safety First',
    description: 'Consent-based pairing, preserved chat history, and a built-in report system.',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-red-600',
  },
]

export const FeaturesSection = () => {
  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
      {features.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </div>
  )
}
