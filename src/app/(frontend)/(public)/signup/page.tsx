import type { Metadata } from 'next'
import { SignupPage } from '@/frontend/features/auth/pages'

export const metadata: Metadata = {
  title: 'สมัครสมาชิก',
  description: 'สร้างบัญชีใหม่เพื่อเริ่มใช้งาน',
}

export default function Signup() {
  return <SignupPage />
}
