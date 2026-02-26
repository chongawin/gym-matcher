'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef, useTransition } from 'react'
import type { User } from '@supabase/supabase-js'
import { useLocale, useTranslations } from 'next-intl'

import { Route } from '@/frontend/enums/route.enum'
import { supabase } from '@/frontend/libs'
import { logout } from '@/frontend/features/auth/services'
import { clearAuthCookies } from '@/frontend/features/auth/actions/auth.actions'
import { setLocale } from '@/shared/i18n/actions'
import type { Profile } from '@/frontend/features/auth/interfaces'

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
function IconSearch(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}
function IconUsers(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconChat(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function IconCalendar(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
function IconUser(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

type NavLink = {
  href: string
  labelKey: string
  Icon: React.FC<React.SVGProps<SVGSVGElement>>
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('navbar')
  const [isPending, startTransition] = useTransition()

  const navLinks: NavLink[] = [
    { href: Route.MATCH,       labelKey: 'findPartners', Icon: IconSearch   },
    { href: Route.MY_PARTNERS, labelKey: 'myPartners',   Icon: IconUsers    },
    { href: Route.CHAT,        labelKey: 'chat',         Icon: IconChat     },
    { href: Route.SESSIONS,    labelKey: 'sessions',     Icon: IconCalendar },
    { href: Route.PROFILE,     labelKey: 'profile',      Icon: IconUser     },
  ]

  const visibleLinks = user ? navLinks : []

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data ?? null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchProfile(u.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchProfile(u.id)
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleProfileUpdated = () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) fetchProfile(session.user.id)
      })
    }
    window.addEventListener('gym:profile-updated', handleProfileUpdated)
    return () => window.removeEventListener('gym:profile-updated', handleProfileUpdated)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (href: string) => pathname.startsWith(href)

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
    await clearAuthCookies()
    router.push(Route.HOME)
    router.refresh()
  }

  const handleLocaleSwitch = () => {
    const next = locale === 'th' ? 'en' : 'th'
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  const displayName = profile?.display_name ?? profile?.first_name ?? user?.email ?? ''
  const avatarLetter = displayName[0]?.toUpperCase() ?? '?'

  return (
    <>
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-border/40 bg-background/80 shadow-lg shadow-black/5 backdrop-blur-xl'
            : 'bg-background/50 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20 md:px-6">
          {/* Logo */}
          <Link
            href={user ? Route.PROFILE : Route.HOME}
            className="group flex items-center space-x-3 transition-transform hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-to shadow-lg shadow-primary/30 transition-all group-hover:shadow-primary/50">
              <span className="text-2xl">🏋️</span>
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="bg-gradient-to-r from-primary to-primary-to bg-clip-text text-xl font-bold text-transparent">
                {t('brand')}
              </span>
              <span className="text-xs font-medium text-muted-foreground">{t('tagline')}</span>
            </div>
          </Link>

          {/* Desktop Center Nav */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {visibleLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-primary to-primary-to text-white shadow-lg shadow-primary/30'
                      : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <link.Icon className={`h-4 w-4 shrink-0 transition-transform ${active ? '' : 'group-hover:scale-110'}`} />
                  <span>{t(link.labelKey as Parameters<typeof t>[0])}</span>
                  {!active && (
                    <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side: locale (guest only) + auth */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-foreground/70 transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-to text-sm font-bold text-white shadow-md">
                    {avatarLetter}
                  </div>
                  <span className="hidden max-w-[120px] truncate md:block">{displayName}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                    <div className="border-b border-border px-4 py-3">
                      <p className="truncate text-sm font-semibold">{displayName}</p>
                      <div className="mt-1.5 flex gap-2">
                        {profile?.age != null && (
                          <span className="flex items-center gap-1">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold leading-none text-primary">{t('ageShort')}</span>
                            <span className="text-xs text-muted-foreground">{profile.age}</span>
                          </span>
                        )}
                        {profile?.weight_kg != null && (
                          <span className="flex items-center gap-1">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold leading-none text-primary">{t('weightShort')}</span>
                            <span className="text-xs text-muted-foreground">{profile.weight_kg} kg</span>
                          </span>
                        )}
                        {profile?.height_cm != null && (
                          <span className="flex items-center gap-1">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold leading-none text-primary">{t('heightShort')}</span>
                            <span className="text-xs text-muted-foreground">{profile.height_cm} cm</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-border px-4 py-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('language')}</p>
                      <div className="flex gap-1 rounded-lg bg-black p-1 dark:bg-white/10">
                        <button
                          onClick={() => locale !== 'th' && handleLocaleSwitch()}
                          disabled={isPending}
                          className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-all ${
                            locale === 'th'
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-white/50 hover:text-white'
                          }`}
                        >
                          TH
                        </button>
                        <button
                          onClick={() => locale !== 'en' && handleLocaleSwitch()}
                          disabled={isPending}
                          className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-all ${
                            locale === 'en'
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-white/50 hover:text-white'
                          }`}
                        >
                          EN
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-border p-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                      >
                        <span>🚪</span> {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={Route.LOGIN}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-foreground/70 transition-all hover:bg-accent hover:text-accent-foreground md:px-4 md:py-2.5"
                >
                  {t('login')}
                </Link>
                <Link
                  href={Route.SIGNUP}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-to px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50 md:px-5 md:py-2.5"
                >
                  <span className="relative z-10">{t('signup')}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation Bar (hidden on home page) ─────────────── */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden ${pathname === Route.HOME ? 'hidden' : ''}`}>
        {user ? (
          <div className="flex h-16 items-stretch">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
                >
                  {active && (
                    <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                  <link.Icon
                    className={`h-5 w-5 transition-all ${active ? 'scale-110 text-primary' : 'text-foreground/40'}`}
                  />
                </Link>
              )
            })}
          </div>
        ) : null}
      </nav>
    </>
  )
}
