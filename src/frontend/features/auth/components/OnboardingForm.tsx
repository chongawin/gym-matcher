'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Button } from '@/frontend/components/ui'
import { useUpdateProfile } from '@/frontend/features/auth/hooks'
import type { Profile } from '@/frontend/features/auth/interfaces'
import { setProfileCompleteCookie } from '@/frontend/features/auth/actions/auth.actions'
import { Route } from '@/frontend/enums'

interface OnboardingFormProps {
  userId: string
}

interface FormData {
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
}

const TOTAL_STEPS = 3

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
          onClick={() => onChange(opt.value)}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
            value === opt.value
              ? 'border-primary bg-primary text-white shadow-md'
              : 'border-white/60 bg-white/40 text-slate-700 hover:border-primary/40 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter()
  const t = useTranslations('auth.onboarding')
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    display_name: '',
    first_name: '',
    last_name: '',
    gender: '',
    age: '',
    height_cm: '',
    weight_kg: '',
    goal: '',
    experience_level: '',
    commitment_level: '',
    program_type: '',
    preferred_gender: '',
    available_time_start: '',
    available_time_end: '',
    bio: '',
  })

  const set = (field: keyof FormData) => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const genderOptions = [
    { value: 'male', label: t('options.gender.male') },
    { value: 'female', label: t('options.gender.female') },
    { value: 'other', label: t('options.gender.other') },
  ]

  const goalOptions = [
    { value: 'fat_loss', label: t('options.goal.fat_loss') },
    { value: 'muscle_gain', label: t('options.goal.muscle_gain') },
    { value: 'cardio', label: t('options.goal.cardio') },
    { value: 'strength', label: t('options.goal.strength') },
  ]

  const experienceOptions = [
    { value: 'beginner', label: t('options.experienceLevel.beginner') },
    { value: 'intermediate', label: t('options.experienceLevel.intermediate') },
    { value: 'advanced', label: t('options.experienceLevel.advanced') },
  ]

  const programTypeOptions = [
    { value: 'gym', label: t('options.programType.gym') },
    { value: 'home', label: t('options.programType.home') },
    { value: 'crossfit', label: t('options.programType.crossfit') },
    { value: 'group_class', label: t('options.programType.group_class') },
    { value: 'outdoor', label: t('options.programType.outdoor') },
  ]

  const commitmentOptions = [
    { value: 'casual', label: t('options.commitmentLevel.casual') },
    { value: 'regular', label: t('options.commitmentLevel.regular') },
    { value: 'hardcore', label: t('options.commitmentLevel.hardcore') },
  ]

  const preferredGenderOptions = [
    { value: 'male', label: t('options.preferredGender.male') },
    { value: 'female', label: t('options.preferredGender.female') },
    { value: 'any', label: t('options.preferredGender.any') },
  ]

  const isStepValid = () => {
    if (step === 1) return !!formData.first_name.trim() && !!formData.last_name.trim() && !!formData.gender
    if (step === 2) return !!formData.goal && !!formData.experience_level && !!formData.commitment_level
    return true
  }

  const handleNext = () => {
    if (!isStepValid()) return
    setStep((s) => s + 1)
  }

  const handleBack = () => setStep((s) => s - 1)

  const handleFinish = () => {
    setError(null)
    updateProfile(
      {
        userId,
        data: {
          display_name: formData.display_name.trim() || null,
          first_name: formData.first_name.trim() || null,
          last_name: formData.last_name.trim() || null,
          gender: (formData.gender || null) as Profile['gender'],
          age: formData.age ? parseInt(formData.age, 10) : null,
          height_cm: formData.height_cm ? parseInt(formData.height_cm, 10) : null,
          weight_kg: formData.weight_kg ? parseInt(formData.weight_kg, 10) : null,
          goal: (formData.goal || null) as Profile['goal'],
          experience_level: (formData.experience_level || null) as Profile['experience_level'],
          commitment_level: (formData.commitment_level || null) as Profile['commitment_level'],
          program_type: formData.program_type || null,
          preferred_gender: (formData.preferred_gender || null) as Profile['preferred_gender'],
          available_time_start: formData.available_time_start || null,
          available_time_end: formData.available_time_end || null,
          bio: formData.bio.trim() || null,
        },
      },
      {
        onSuccess: async (data) => {
          if (data.error) {
            setError(data.error)
            return
          }
          await setProfileCompleteCookie()
          window.dispatchEvent(new CustomEvent('gym:profile-updated'))
          router.push(Route.PROFILE)
        },
        onError: (err) => setError(err.message),
      },
    )
  }

  const stepTitles = [
    t('steps.basicInfo.title'),
    t('steps.training.title'),
    t('steps.partner.title'),
  ]

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
      {/* Top shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      {/* Inner glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/30 to-transparent dark:from-white/5" />

      <div className="relative px-8 pb-8 pt-8">
        {/* Header */}
        <div className="mb-6 space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t('step')} {step} {t('of')} {TOTAL_STEPS}
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{stepTitles[step - 1]}</h2>
        </div>

        {/* Progress bar */}
        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-white/40 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-to transition-all duration-500"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {/* Step 1: Basic + Physical Info */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('steps.basicInfo.displayName')}
              </label>
              <input
                type="text"
                placeholder={t('steps.basicInfo.displayNamePlaceholder')}
                value={formData.display_name}
                onChange={(e) => set('display_name')(e.target.value)}
                className="w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t('steps.basicInfo.firstName')} <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('steps.basicInfo.firstNamePlaceholder')}
                  value={formData.first_name}
                  onChange={(e) => set('first_name')(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t('steps.basicInfo.lastName')} <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('steps.basicInfo.lastNamePlaceholder')}
                  value={formData.last_name}
                  onChange={(e) => set('last_name')(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('steps.basicInfo.gender')} <span className="text-primary">*</span>
              </label>
              <PillSelect options={genderOptions} value={formData.gender} onChange={set('gender')} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t('steps.basicInfo.age')}
                </label>
                <input
                  type="number"
                  placeholder={t('steps.basicInfo.agePlaceholder')}
                  value={formData.age}
                  min={10}
                  max={100}
                  onChange={(e) => set('age')(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t('steps.basicInfo.heightCm')}
                </label>
                <input
                  type="number"
                  placeholder="cm"
                  value={formData.height_cm}
                  min={100}
                  max={250}
                  onChange={(e) => set('height_cm')(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t('steps.basicInfo.weightKg')}
                </label>
                <input
                  type="number"
                  placeholder="kg"
                  value={formData.weight_kg}
                  min={30}
                  max={300}
                  onChange={(e) => set('weight_kg')(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Fitness */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('steps.training.goal')} <span className="text-primary">*</span>
              </label>
              <PillSelect options={goalOptions} value={formData.goal} onChange={set('goal')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('steps.training.experienceLevel')} <span className="text-primary">*</span>
              </label>
              <PillSelect options={experienceOptions} value={formData.experience_level} onChange={set('experience_level')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('steps.training.commitmentLevel')} <span className="text-primary">*</span>
              </label>
              <PillSelect options={commitmentOptions} value={formData.commitment_level} onChange={set('commitment_level')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('steps.training.programType')}
              </label>
              <PillSelect options={programTypeOptions} value={formData.program_type} onChange={set('program_type')} />
            </div>
          </div>
        )}

        {/* Step 3: Matching Preferences */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('steps.partner.preferredGender')}
              </label>
              <PillSelect options={preferredGenderOptions} value={formData.preferred_gender} onChange={set('preferred_gender')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('steps.partner.availableTime')}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={formData.available_time_start}
                  onChange={(e) => set('available_time_start')(e.target.value)}
                  className="flex-1 rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                <span className="text-sm text-slate-400">–</span>
                <input
                  type="time"
                  value={formData.available_time_end}
                  onChange={(e) => set('available_time_end')(e.target.value)}
                  className="flex-1 rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('steps.partner.bio')}
              </label>
              <textarea
                placeholder={t('steps.partner.bioPlaceholder')}
                value={formData.bio}
                onChange={(e) => set('bio')(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              {t('back')}
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1"
            >
              {t('next')}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinish}
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? t('finishing') : t('finish')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
