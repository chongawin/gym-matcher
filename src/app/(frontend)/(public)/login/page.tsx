import type { Metadata } from 'next'
import { LoginPage } from '@/frontend/features/auth/pages'

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ',
  description: 'เข้าสู่ระบบเพื่อใช้งาน',
}

export default function Login() {
  return <LoginPage />
}
