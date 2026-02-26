import { SignupForm } from '@/frontend/features/auth/components'

export function SignupPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary-to/10">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-primary/20 to-primary-via/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-primary-to/20 to-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/5 blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}
