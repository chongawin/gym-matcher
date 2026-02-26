'use client'

import {
  HeroSection,
  HowItWorksSection,
  CtaSection,
} from '../../components'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Hero */}
      <div className="w-full pb-16">
        <HeroSection />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* How It Works */}
      <div className="w-full py-16">
        <div className="flex flex-col items-center gap-0 px-6">
          <HowItWorksSection />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* CTA */}
      <div className="w-full py-16">
        <div className="flex flex-col items-center px-6">
          <CtaSection />
        </div>
      </div>
    </div>
  )
}

export default HomePage
