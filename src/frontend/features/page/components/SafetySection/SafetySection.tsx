'use client'

const safetyFeatures = [
  {
    icon: '✅',
    title: 'Consent-based matching',
    description: 'Both users must accept the match. No one can be paired without mutual agreement.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: '💬',
    title: 'Chat history preserved',
    description: 'All messages are stored and reviewable. Transparency builds trust.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🚩',
    title: 'Report system available',
    description: 'See something off? Report instantly. Our team reviews all reports within 24 hours.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: '🔵',
    title: 'Verified profiles',
    description: 'Phone-verified accounts only. Profile verification badge coming soon.',
    color: 'from-violet-500 to-purple-500',
    comingSoon: true,
  },
]

export const SafetySection = () => {
  return (
    <section className="w-full max-w-5xl">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary dark:border-primary/30 dark:bg-primary/10 mb-4">
          <span>🛡️</span> Your Safety Comes First
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Built with Safety in Mind
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Gym Matcher is designed around respect and safety — not just fitness.
        </p>
      </div>

      {/* Safety Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {safetyFeatures.map((feature) => (
          <div
            key={feature.title}
            className="group relative flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Glow */}
            <div
              className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${feature.color} opacity-5 blur-2xl transition-all group-hover:opacity-15`}
            />

            {/* Icon */}
            <div
              className={`relative shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-xl shadow-md`}
            >
              {feature.icon}
            </div>

            {/* Text */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                {feature.comingSoon && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Coming Soon
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
