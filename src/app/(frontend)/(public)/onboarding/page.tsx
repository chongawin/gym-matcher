import type { Metadata } from 'next'
import { OnboardingPage } from '@/frontend/features/auth/pages'

export const metadata: Metadata = {
  title: 'ตั้งค่าโปรไฟล์',
  description: 'กรอกข้อมูลเพื่อหาคู่เทรนที่ใช่สำหรับคุณ',
}

export default function Onboarding() {
  return <OnboardingPage />
}
