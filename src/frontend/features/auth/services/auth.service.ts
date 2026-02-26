import { supabase } from '@/frontend/libs'
import type { AuthResponse, LoginRequest, Profile, SignupRequest } from '@/frontend/features/auth/interfaces'

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: request.email,
    password: request.password,
  })

  if (error) {
    return { user: null, profile: null, error: error.message }
  }

  const user = data.user ? { id: data.user.id, email: data.user.email } : null

  if (!user) {
    return { user: null, profile: null, error: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile: profile ?? null, error: null }
}

export const signup = async (request: SignupRequest): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email: request.email,
    password: request.password,
  })

  if (error) {
    return { user: null, profile: null, error: error.message }
  }

  return {
    user: data.user ? { id: data.user.id, email: data.user.email } : null,
    profile: null,
    error: null,
  }
}

export const logout = async (): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.signOut()
  return { error: error?.message ?? null }
}

export const updateProfile = async (
  userId: string,
  data: Partial<Omit<Profile, 'id' | 'created_at' | 'email'>>,
): Promise<{ error: string | null }> => {
  const { error } = await supabase.from('profiles').update(data).eq('id', userId)
  return { error: error?.message ?? null }
}
