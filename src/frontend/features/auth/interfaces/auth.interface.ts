export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  confirmPassword: string
}

export interface AuthUser {
  id: string
  email: string | undefined
}

export interface Profile {
  id: string
  email: string | null
  display_name: string | null
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  bio: string | null
  // Physical
  gender: 'male' | 'female' | 'other' | null
  age: number | null
  height_cm: number | null
  weight_kg: number | null
  // Fitness
  goal: 'fat_loss' | 'muscle_gain' | 'cardio' | 'strength' | null
  experience_level: 'beginner' | 'intermediate' | 'advanced' | null
  commitment_level: 'casual' | 'regular' | 'hardcore' | null
  program_type: string | null
  // Matching
  preferred_gender: 'male' | 'female' | 'other' | null
  available_time_start: string | null
  available_time_end: string | null
  // Visibility
  is_visible: boolean | null
  // System
  created_at: string | null
  updated_at: string | null
}

export interface AuthResponse {
  user: AuthUser | null
  profile: Profile | null
  error: string | null
}
