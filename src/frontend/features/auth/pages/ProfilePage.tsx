'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { useTranslations } from 'next-intl'

import { supabase } from '@/frontend/libs'
import { ProfileEditForm } from '@/frontend/features/auth/components'
import type { Profile } from '@/frontend/features/auth/interfaces'
import { isProfileComplete } from '@/frontend/features/auth/utils/profile.util'
import { Route } from '@/frontend/enums'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  const tP = useTranslations('profile.fields')
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={`text-right text-sm font-medium ${value ? 'text-foreground' : 'text-muted-foreground/50'}`}>
        {value ?? tP('notSet')}
      </span>
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white/60 backdrop-blur-xl dark:bg-slate-900/60">
      <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
        <span className="text-base">{icon}</span>
        <h2 className="text-sm font-semibold text-foreground/80">{title}</h2>
      </div>
      <div className="divide-y divide-border/40 px-5">{children}</div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const t = useTranslations('profile')
  const tOpt = useTranslations('auth.onboarding.options')
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { router.replace(Route.LOGIN); return }
      setUser(session.user)
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(data ?? null)
      if (!isProfileComplete(data ?? null)) {
        router.replace(Route.ONBOARDING)
        return
      }
      setLoading(false)
    })
  }, [router])

  const handleSaved = (updated: Partial<Profile>) => {
    setProfile((prev) => prev ? { ...prev, ...updated } : prev)
    setEditing(false)
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 3000)
  }

  // ── option label lookups ────────────────────────────────────────────────────
  const genderLabel = (v: string | null) =>
    v ? tOpt(`gender.${v as 'male' | 'female' | 'other'}`) : null
  const goalLabel = (v: string | null) =>
    v ? tOpt(`goal.${v as 'fat_loss' | 'muscle_gain' | 'cardio' | 'strength'}`) : null
  const expLabel = (v: string | null) =>
    v ? tOpt(`experienceLevel.${v as 'beginner' | 'intermediate' | 'advanced'}`) : null
  const commitLabel = (v: string | null) =>
    v ? tOpt(`commitmentLevel.${v as 'casual' | 'regular' | 'hardcore'}`) : null
  const programLabel = (v: string | null) =>
    v ? tOpt(`programType.${v as 'gym' | 'home' | 'crossfit' | 'group_class' | 'outdoor'}`) : null
  const prefGenderLabel = (v: string | null) =>
    v ? tOpt(`preferredGender.${v as 'male' | 'female' | 'any'}`) : null

  const displayName = profile?.display_name ?? profile?.first_name ?? user?.email ?? '?'
  const avatarLetter = displayName[0]?.toUpperCase() ?? '?'

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary-to/10">
      {/* Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/20 to-primary-via/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-primary-to/20 to-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 pb-20 pt-28">
        {/* Header card */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-xl shadow-black/5 backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/60">
          <div className="h-24 w-full bg-gradient-to-r from-primary/30 via-primary/20 to-primary-to/30" />
          <div className="relative px-6 pb-6 pt-0">
            {/* Avatar */}
            <div className="relative -mt-10 mb-4 flex items-end justify-between">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-primary to-primary-to text-2xl font-bold text-white shadow-lg dark:border-slate-900">
                {avatarLetter}
              </div>
              <button
                onClick={() => setEditing((v) => !v)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  editing
                    ? 'bg-muted text-foreground/60 hover:bg-muted/80'
                    : 'bg-primary text-white shadow-md shadow-primary/30 hover:scale-105 hover:shadow-primary/50'
                }`}
              >
                <span>{editing ? '✕' : '✏️'}</span>
                {editing ? t('cancel') : t('editProfile')}
              </button>
            </div>

            <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{user?.email}</p>

            {/* Stats row */}
            {(profile?.age != null || profile?.weight_kg != null || profile?.height_cm != null) && (
              <div className="mt-4 flex gap-4">
                {profile.age != null && (
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold leading-none text-primary">A</span>
                    <span className="text-sm font-medium">{profile.age}</span>
                  </div>
                )}
                {profile.weight_kg != null && (
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold leading-none text-primary">W</span>
                    <span className="text-sm font-medium">{profile.weight_kg} kg</span>
                  </div>
                )}
                {profile.height_cm != null && (
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold leading-none text-primary">H</span>
                    <span className="text-sm font-medium">{profile.height_cm} cm</span>
                  </div>
                )}
              </div>
            )}

            {savedMsg && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                <span>✓</span> {t('saveSuccess')}
              </p>
            )}
          </div>
        </div>

        {/* Edit form */}
        {editing && profile && user && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/60 bg-white/60 p-6 shadow-xl shadow-black/5 backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/60">
            <ProfileEditForm
              userId={user.id}
              profile={profile}
              onSaved={handleSaved}
              onCancel={() => setEditing(false)}
            />
          </div>
        )}

        {/* Info sections */}
        {!editing && (
          <div className="space-y-4">
            {/* Basic */}
            <SectionCard title={t('sections.basic')} icon="👤">
              <InfoRow label={t('fields.displayName')} value={profile?.display_name} />
              <InfoRow label={t('fields.firstName')} value={profile?.first_name} />
              <InfoRow label={t('fields.lastName')} value={profile?.last_name} />
              <InfoRow label={t('fields.email')} value={user?.email} />
              <InfoRow label={t('fields.gender')} value={genderLabel(profile?.gender ?? null)} />
            </SectionCard>

            {/* Physical */}
            <SectionCard title={t('sections.physical')} icon="📏">
              <InfoRow label={t('fields.age')} value={profile?.age != null ? `${profile.age} yrs` : null} />
              <InfoRow label={t('fields.weightKg')} value={profile?.weight_kg != null ? `${profile.weight_kg} kg` : null} />
              <InfoRow label={t('fields.heightCm')} value={profile?.height_cm != null ? `${profile.height_cm} cm` : null} />
            </SectionCard>

            {/* Fitness */}
            <SectionCard title={t('sections.fitness')} icon="🏋️">
              <InfoRow label={t('fields.goal')} value={goalLabel(profile?.goal ?? null)} />
              <InfoRow label={t('fields.experienceLevel')} value={expLabel(profile?.experience_level ?? null)} />
              <InfoRow label={t('fields.commitmentLevel')} value={commitLabel(profile?.commitment_level ?? null)} />
              <InfoRow label={t('fields.programType')} value={programLabel(profile?.program_type ?? null)} />
              {profile?.bio && (
                <div className="py-2.5">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">{t('fields.bio')}</span>
                  <p className="text-sm text-foreground/80 leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </SectionCard>

            {/* Matching */}
            <SectionCard title={t('sections.matching')} icon="🤝">
              <InfoRow label={t('fields.preferredGender')} value={prefGenderLabel(profile?.preferred_gender ?? null)} />
              <InfoRow
                label={t('fields.availableTimeStart')}
                value={profile?.available_time_start
                  ? profile.available_time_start.slice(0, 5)
                  : null}
              />
              <InfoRow
                label={t('fields.availableTimeEnd')}
                value={profile?.available_time_end
                  ? profile.available_time_end.slice(0, 5)
                  : null}
              />
              <InfoRow
                label={t('fields.isVisible')}
                value={profile?.is_visible != null ? (profile.is_visible ? '✓ On' : '✕ Off') : null}
              />
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  )
}
