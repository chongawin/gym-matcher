import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'

import { AuthMutationKey } from '@/frontend/features/auth/enums'
import type { AuthResponse, SignupRequest } from '@/frontend/features/auth/interfaces'
import { signup } from '@/frontend/features/auth/services'

const useSignup = (
  options?: Omit<UseMutationOptions<AuthResponse, Error, SignupRequest>, 'mutationKey' | 'mutationFn'>,
) => {
  return useMutation<AuthResponse, Error, SignupRequest>({
    mutationKey: [AuthMutationKey.SIGNUP],
    mutationFn: signup,
    ...options,
  })
}

export default useSignup
