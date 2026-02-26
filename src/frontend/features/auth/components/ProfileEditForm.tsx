'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/frontend/components/ui'
import { useUpdateProfile } from '@/frontend/features/auth/hooks'
import type { Profile } from '@/frontend/features/auth/interfaces'

interface ProfileEditFormProps {
  userId: string
  profile: Profile
  onSaved: (updated: Partial<Profile>) => void
  onCancel: () => void
}

type FormData = {
  display_name: string
  first_name: string
  last_name: string
  gender: string
  age: string
  height_cm: string
  weight_kg: string
  goal: string
  experience_level: string
  commitment_level: string
  program_type: string
  preferred_gender: string
  available_time_start: string
  available_time_end: string
  bio: string
  is_visible: boolean
}

function PillSelect({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value === value ? '' : opt.value)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            value === opt.value
              ? 'bg-primary text-white shadow-md shadow-primary/30'
              : 'border border-border bg-background text-foreground/60 hover:border-primary/40 hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function ProfileEditForm({ userId, profile, onSaved, onCancel }: ProfileEditFormProps) {
  const t = useTranslations('profile')
  const tOpt = useTranslations('auth.onboarding.options')

  const [form, setForm] = useState<FormData>({
    display_name: profile.display_name ?? '',
    first_name: profile.first_name ?? '',
    last_name: profile.last_name ?? '',
    gender: profile.gender ?? '',
    age: profile.age?.toString() ?? '',
    height_cm: profile.height_cm?.toString() ?? '',
    weight_kg: profile.weight_kg?.toString() ?? '',
    goal: profile.goal ?? '',
    experience_level: profile.experience_level ?? '',
    commitment_level: profile.commitment_level ?? '',
    program_type: profile.program_type ?? '',
    preferred_gender: profile.preferred_gender ?? '',
    available_time_start: profile.available_time_start ?? '',
    available_time_end: profile.available_time_end ?? '',
    bio: profile.bio ?? '',
    is_visible: profile.is_visible ?? true,
  })
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
  }

  const setPill = (key: keyof FormData) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }))
    setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    const required: { key: keyof FormData; label: string }[] = [
      { key: 'first_name', label: t('fields.firstName') },
      { key: 'last_name', label: t('fields.lastName') },
      { key: 'gender', label: t('fields.gender') },
      { key: 'goal', label: t('fields.goal') },
      { key: 'experience_level', label: t('fields.experienceLevel') },
      { key: 'commitment_level', label: t('fields.commitmentLevel') },
    ]
    const errors: Partial<Record<keyof FormData, string>> = {}
    for (const field of required) {
      if (!form[field.key]) errors[field.key] = `${field.label} is required`
    }
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    const payload: Partial<Omit<Profile, 'id' | 'created_at' | 'email'>> = {
      display_name: form.display_name || null,
      first_name: form.first_name || null,
      last_name: form.last_name || null,
      gender: (form.gender || null) as Profile['gender'],
      age: form.age ? Number(form.age) : null,
      height_cm: form.height_cm ? Number(form.height_cm) : null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      goal: (form.goal || null) as Profile['goal'],
      experience_level: (form.experience_level || null) as Profile['experience_level'],
      commitment_level: (form.commitment_level || null) as Profile['commitment_level'],
      program_type: form.program_type || null,
      preferred_gender: (form.preferred_gender || null) as Profile['preferred_gender'],
      available_time_start: form.available_time_start || null,
      available_time_end: form.available_time_end || null,
      bio: form.bio || null,
      is_visible: form.is_visible,
    }
    updateProfile(
      { userId, data: payload },
      {
        onSuccess: ({ error: err }) => {
          if (err) { setError(err); return }
          window.dispatchEvent(new CustomEvent('gym:profile-updated'))
          onSaved(payload)
        },
        onError: (err) => setError(err.message),
      },
    )
  }

  const genderOptions = [
    { value: 'male', label: tOpt('gender.male') },
    { value: 'female', label: tOpt('gender.female') },
    { value: 'other', label: tOpt('gender.other') },
  ]
  const goalOptions = [
    { value: 'fat_loss', label: tOpt('goal.fat_loss') },
    { value: 'muscle_gain', label: tOpt('goal.muscle_gain') },
    { value: 'cardio', label: tOpt('goal.cardio') },
    { value: 'strength', label: tOpt('goal.strength') },
  ]
  const expOptions = [
    { value: 'beginner', label: tOpt('experienceLevel.beginner') },
    { value: 'intermediate', label: tOpt('experienceLevel.intermediate') },
    { value: 'advanced', label: tOpt('experienceLevel.advanced') },
  ]
  const commitOptions = [
    { value: 'casual', label: tOpt('commitmentLevel.casual') },
    { value: 'regular', label: tOpt('commitmentLevel.regular') },
    { value: 'hardcore', label: tOpt('commitmentLevel.hardcore') },
  ]
  const programOptions = [
    { value: 'gym', label: tOpt('programType.gym') },
    { value: 'home', label: tOpt('programType.home') },
    { value: 'crossfit', label: tOpt('programType.crossfit') },
    { value: 'group_class', label: tOpt('programType.group_class') },
    { value: 'outdoor', label: tOpt('programType.outdoor') },
  ]
  const prefGenderOptions = [
    { value: 'male', label: tOpt('preferredGender.male') },
    { value: 'female', label: tOpt('preferredGender.female') },
    { value: 'any', label: tOpt('preferredGender.any') },
  ]

  const inputClass =
    'w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20'
  const labelClass = 'mb-1.5 block text-xs font-medium text-foreground/60'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">1</span>
          {t('sections.basic')}
        </h3>
        <div>
          <label className={labelClass}>{t('fields.displayName')}</label>
          <input className={inputClass} value={form.display_name} onChange={set('display_name')} placeholder="e.g. GymBro99" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>{t('fields.firstName')} <span className="text-destructive">*</span></label>
            <input className={`${inputClass} ${fieldErrors.first_name ? 'border-destructive/60 focus:ring-destructive/20' : ''}`} value={form.first_name} onChange={set('first_name')} />
            {fieldErrors.first_name && <p className="mt-1 text-xs text-destructive">{fieldErrors.first_name}</p>}
          </div>
          <div>
            <label className={labelClass}>{t('fields.lastName')} <span className="text-destructive">*</span></label>
            <input className={`${inputClass} ${fieldErrors.last_name ? 'border-destructive/60 focus:ring-destructive/20' : ''}`} value={form.last_name} onChange={set('last_name')} />
            {fieldErrors.last_name && <p className="mt-1 text-xs text-destructive">{fieldErrors.last_name}</p>}
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('fields.gender')} <span className="text-destructive">*</span></label>
          <PillSelect options={genderOptions} value={form.gender} onChange={setPill('gender')} />
          {fieldErrors.gender && <p className="mt-1 text-xs text-destructive">{fieldErrors.gender}</p>}
        </div>
      </section>

      {/* Physical */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">2</span>
          {t('sections.physical')}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>{t('fields.age')}</label>
            <input className={inputClass} type="number" min={10} max={99} value={form.age} onChange={set('age')} />
          </div>
          <div>
            <label className={labelClass}>{t('fields.weightKg')}</label>
            <input className={inputClass} type="number" min={20} max={300} value={form.weight_kg} onChange={set('weight_kg')} />
          </div>
          <div>
            <label className={labelClass}>{t('fields.heightCm')}</label>
            <input className={inputClass} type="number" min={100} max={250} value={form.height_cm} onChange={set('height_cm')} />
          </div>
        </div>
      </section>

      {/* Fitness */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">3</span>
          {t('sections.fitness')}
        </h3>
        <div>
          <label className={labelClass}>{t('fields.goal')} <span className="text-destructive">*</span></label>
          <PillSelect options={goalOptions} value={form.goal} onChange={setPill('goal')} />
          {fieldErrors.goal && <p className="mt-1 text-xs text-destructive">{fieldErrors.goal}</p>}
        </div>
        <div>
          <label className={labelClass}>{t('fields.experienceLevel')} <span className="text-destructive">*</span></label>
          <PillSelect options={expOptions} value={form.experience_level} onChange={setPill('experience_level')} />
          {fieldErrors.experience_level && <p className="mt-1 text-xs text-destructive">{fieldErrors.experience_level}</p>}
        </div>
        <div>
          <label className={labelClass}>{t('fields.commitmentLevel')} <span className="text-destructive">*</span></label>
          <PillSelect options={commitOptions} value={form.commitment_level} onChange={setPill('commitment_level')} />
          {fieldErrors.commitment_level && <p className="mt-1 text-xs text-destructive">{fieldErrors.commitment_level}</p>}
        </div>
        <div>
          <label className={labelClass}>{t('fields.programType')}</label>
          <PillSelect options={programOptions} value={form.program_type} onChange={setPill('program_type')} />
        </div>
      </section>

      {/* Matching */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">4</span>
          {t('sections.matching')}
        </h3>
        <div>
          <label className={labelClass}>{t('fields.preferredGender')}</label>
          <PillSelect options={prefGenderOptions} value={form.preferred_gender} onChange={setPill('preferred_gender')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>{t('fields.availableTimeStart')}</label>
            <input className={inputClass} type="time" value={form.available_time_start} onChange={set('available_time_start')} />
          </div>
          <div>
            <label className={labelClass}>{t('fields.availableTimeEnd')}</label>
            <input className={inputClass} type="time" value={form.available_time_end} onChange={set('available_time_end')} />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('fields.bio')}</label>
          <textarea
            className={`${inputClass} min-h-[80px] resize-none`}
            value={form.bio}
            onChange={set('bio')}
            placeholder="..."
          />
        </div>
        <label className="flex cursor-pointer items-center gap-3">
          <div
            onClick={() => setForm((prev) => ({ ...prev, is_visible: !prev.is_visible }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_visible ? 'bg-primary' : 'bg-muted'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_visible ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </div>
          <span className="text-sm text-foreground/70">{t('fields.isVisible')}</span>
        </label>
      </section>

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>
          {t('cancel')}
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? t('saving') : t('saveChanges')}
        </Button>
      </div>
    </form>
  )
}
