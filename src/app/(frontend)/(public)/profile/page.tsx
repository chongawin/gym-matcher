import type { Metadata } from 'next'
import { ProfilePage } from '@/frontend/features/auth/pages'

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your gym profile',
}

export default function Profile() {
  return <ProfilePage />
}
