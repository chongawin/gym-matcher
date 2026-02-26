import type { Profile } from '@/frontend/features/auth/interfaces'

/**
 * Required fields to consider a profile "complete" for matching.
 */
const REQUIRED_FIELDS: (keyof Profile)[] = [
  'first_name',
  'last_name',
  'gender',
  'goal',
  'experience_level',
  'commitment_level',
]

export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false
  return REQUIRED_FIELDS.every((field) => !!profile[field])
}
