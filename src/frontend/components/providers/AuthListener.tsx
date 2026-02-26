'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/frontend/libs'
import { setLoginCookies } from '@/frontend/features/auth/actions/auth.actions'
import { isProfileComplete } from '@/frontend/features/auth/utils/profile.util'
import { Route } from '@/frontend/enums'

/**
 * Handles auth redirects from Supabase (email verification, magic link).
 *
 * With PKCE flow, Supabase exchanges the `?code=` param automatically during
 * SDK init — the SIGNED_IN event may fire before onAuthStateChange is registered.
 * So we call getSession() directly on mount, and fall back to the event listener
 * only if the session isn't ready yet.
 */
export function AuthListener() {
  const router = useRouter()

  useEffect(() => {
    const isSupabaseRedirect =
      window.location.hash.includes('access_token') ||
      window.location.search.includes('access_token') ||
      window.location.search.includes('code=')

    if (!isSupabaseRedirect) return

    const redirectWithSession = async (userId: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const complete = isProfileComplete(profile ?? null)
      await setLoginCookies(complete)
      router.replace(complete ? Route.PROFILE : Route.ONBOARDING)
    }

    // Try to get the session immediately — Supabase may have already exchanged the code
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Session already available
        await redirectWithSession(session.user.id)
      } else {
        // Session not ready yet — wait for SIGNED_IN event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
          if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && s?.user) {
            subscription.unsubscribe()
            await redirectWithSession(s.user.id)
          }
        })
      }
    })
  }, [router])

  return null
}
