'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Route } from '@/frontend/enums/route.enum'

const navLinks = [
  { href: Route.HOME, label: 'Home', icon: '🏠' },
  { href: Route.POKEMON, label: 'Pokémon', icon: '🎮' },
  { href: Route.CATEGORIES, label: 'Categories', icon: '📁' },
  { href: Route.PRODUCTS, label: 'Products', icon: '🛍️' },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === Route.HOME) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/40 bg-background/80 shadow-lg shadow-black/5 backdrop-blur-xl'
          : 'bg-background/50 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand with Gradient */}
        <Link
          href={Route.HOME}
          className="group flex items-center space-x-3 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30 transition-all group-hover:shadow-purple-500/50">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
              Next.js
            </span>
            <span className="text-xs font-medium text-muted-foreground">ChadCN Project</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={active ? 'scale-110' : 'group-hover:scale-110 transition-transform'}>
                    {link.icon}
                  </span>
                  {link.label}
                </span>
                {!active && (
                  <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </Link>
            )
          })}
        </div>

        {/* CTA Button (Desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-purple-500/50">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 transition-opacity hover:opacity-100" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-foreground transition-all hover:scale-105 hover:bg-accent/80 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative h-5 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'top-2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'w-0 opacity-0' : 'w-5 opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 top-4 h-0.5 w-5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'top-2 -rotate-45' : 'top-4'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu with Slide Animation */}
      <div
        className={`overflow-hidden border-t border-border/40 transition-all duration-300 md:hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto space-y-1 bg-background/95 px-4 py-4 backdrop-blur-xl">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20'
                    : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className={`text-xl ${active ? 'scale-110' : ''}`}>{link.icon}</span>
                {link.label}
                {active && (
                  <span className="ml-auto">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </Link>
            )
          })}
          <div className="pt-4">
            <button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/30">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
