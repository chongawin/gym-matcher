import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => props,
}))

// Setup global fetch mock
global.fetch = vi.fn()
