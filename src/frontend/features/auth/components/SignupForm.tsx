'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Button } from '@/frontend/components/ui'
import { useSignup } from '@/frontend/features/auth/hooks'
import { Route } from '@/frontend/enums'

export function SignupForm() {
  const router = useRouter()
  const { mutate: signup, isPending } = useSignup()
  const t = useTranslations('auth.signup')
  const tValidation = useTranslations('auth.validation')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(tValidation('passwordMismatch'))
      return
    }

    if (password.length < 6) {
      setError(tValidation('passwordTooShort'))
      return
    }

    signup(
      { email, password, confirmPassword },
      {
        onSuccess: (data) => {
          if (data.error) {
            setError(data.error)
            return
          }
          setSuccess(true)
          setTimeout(() => router.push(Route.LOGIN), 2000)
        },
        onError: (err) => {
          setError(err.message)
        },
      },
    )
  }

  if (success) {
    return (
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/30 to-transparent dark:from-white/5" />
        <div className="relative px-8 py-10 text-center space-y-2">
          <p className="text-4xl">✅</p>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{t('successTitle')}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('successMessage')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
      {/* Top shimmer line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      {/* Inner glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/30 to-transparent dark:from-white/5" />

      <div className="relative px-8 pb-8 pt-8">
        <div className="mb-6 space-y-1 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('heading')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('description')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              id="email"
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary/30 dark:focus:bg-white/10"
            />
          </div>

          <div className="space-y-2">
            <input
              id="password"
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary/30 dark:focus:bg-white/10"
            />
          </div>

          <div className="space-y-2">
            <input
              id="confirmPassword"
              type="password"
              placeholder={t('confirmPassword')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition-all focus:border-primary/40 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary/30 dark:focus:bg-white/10"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-2.5 text-sm text-destructive backdrop-blur-sm">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary-to text-white shadow-lg shadow-primary/30 hover:scale-[1.02] hover:shadow-primary/50 transition-all"
            disabled={isPending}
          >
            {isPending ? t('submitting') : t('submit')}
          </Button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t('hasAccount')}{' '}
            <Link href={Route.LOGIN} className="font-medium text-primary hover:underline">
              {t('loginLink')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
