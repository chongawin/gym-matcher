import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'

import { AuthMutationKey } from '@/frontend/features/auth/enums'
import type { AuthResponse, LoginRequest } from '@/frontend/features/auth/interfaces'
import { login } from '@/frontend/features/auth/services'

const useLogin = (
  options?: Omit<UseMutationOptions<AuthResponse, Error, LoginRequest>, 'mutationKey' | 'mutationFn'>,
) => {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationKey: [AuthMutationKey.LOGIN],
    mutationFn: login,
    ...options,
  })
}

export default useLogin
