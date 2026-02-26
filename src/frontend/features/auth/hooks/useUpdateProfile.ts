import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'

import { AuthMutationKey } from '@/frontend/features/auth/enums'
import type { Profile } from '@/frontend/features/auth/interfaces'
import { updateProfile } from '@/frontend/features/auth/services'

type UpdateProfileVariables = {
  userId: string
  data: Partial<Omit<Profile, 'id' | 'created_at' | 'email'>>
}

const useUpdateProfile = (
  options?: Omit<
    UseMutationOptions<{ error: string | null }, Error, UpdateProfileVariables>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  return useMutation<{ error: string | null }, Error, UpdateProfileVariables>({
    mutationKey: [AuthMutationKey.UPDATE_PROFILE],
    mutationFn: ({ userId, data }) => updateProfile(userId, data),
    ...options,
  })
}

export default useUpdateProfile
