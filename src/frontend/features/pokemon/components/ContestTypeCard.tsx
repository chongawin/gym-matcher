'use client'

import type { ContestType } from '../interfaces'

interface ContestTypeCardProps {
  contestType: ContestType
}

const CONTEST_TYPE_COLORS: Record<string, string> = {
  cool: 'from-red-500 to-orange-500',
  beauty: 'from-blue-500 to-cyan-500',
  cute: 'from-pink-400 to-pink-600',
  smart: 'from-green-500 to-emerald-500',
  tough: 'from-yellow-500 to-orange-600',
}

const CONTEST_TYPE_EMOJIS: Record<string, string> = {
  cool: '😎',
  beauty: '✨',
  cute: '💕',
  smart: '🧠',
  tough: '💪',
}

export const ContestTypeCard = ({ contestType }: ContestTypeCardProps) => {
  const gradient = CONTEST_TYPE_COLORS[contestType.name] || 'from-purple-500 to-blue-500'
  const emoji = CONTEST_TYPE_EMOJIS[contestType.name] || '🎮'

  // Get English and Japanese names
  const englishName =
    contestType.names.find((n) => n.language.name === 'en')?.name || contestType.name
  const japaneseName = contestType.names.find((n) => n.language.name === 'ja-Hrkt')?.name

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}></div>

      <div className="relative p-8">
        {/* Icon/Emoji */}
        <div className="mb-6 flex justify-center">
          <div
            className={`rounded-full bg-gradient-to-br ${gradient} p-8 text-6xl shadow-lg transition-all group-hover:scale-110`}
          >
            {emoji}
          </div>
        </div>

        {/* Contest Type Info */}
        <div className="text-center">
          <div className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Contest Type #{contestType.id}
          </div>
          <h3 className="mb-2 text-3xl font-bold capitalize text-slate-900 dark:text-white">
            {englishName}
          </h3>
          {japaneseName && (
            <p className="mb-4 text-lg text-slate-600 dark:text-slate-400">{japaneseName}</p>
          )}

          {/* Type Badge */}
          <div className="mb-6 flex justify-center">
            <span
              className={`rounded-full bg-gradient-to-r ${gradient} px-4 py-2 text-sm font-semibold text-white shadow-md`}
            >
              {contestType.name.toUpperCase()}
            </span>
          </div>

          {/* Berry Flavor */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Berry Flavor
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🍓</span>
              <span className="text-lg font-semibold capitalize text-slate-900 dark:text-white">
                {contestType.berry_flavor.name}
              </span>
            </div>
          </div>

          {/* All Language Names */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="mb-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Translations
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {contestType.names.slice(0, 6).map((nameData, index) => (
                <div
                  key={index}
                  className="rounded-md bg-slate-100 px-3 py-2 dark:bg-slate-800"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {nameData.language.name}
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {nameData.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
