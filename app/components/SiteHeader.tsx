'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '/', label: '首頁' },
  { href: '/courses', label: '課程介紹' },
  { href: '/gallery', label: '活動花絮' },
  { href: '/about', label: '關於我們' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Admin check
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href + '/'))

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 h-[88px] flex items-center justify-between">

        {/* Logo Section - Optimized Layout */}
        <Link href="/" className="group flex items-center gap-3 no-underline">
          {/* Icon */}
          <div className="relative w-[52px] h-[52px] flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
            <Image
              src="/logo.png"
              alt="光·來了 Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Text Stack - Closer to Reference */}
          <div className="flex flex-col justify-center h-[52px]">
            <h1 className="text-[1.75rem] leading-none font-bold text-gray-800 tracking-tight mb-1 font-['Huninn']">
              光·來了
            </h1>
            <span className="text-[0.75rem] leading-none font-bold text-brand-blue tracking-widest uppercase font-['Noto_Sans_TC']">
              Be Light Kids
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[1rem] font-medium transition-colors duration-200 no-underline ${isActive(link.href)
                  ? 'text-brand-blue font-bold'
                  : 'text-gray-600 hover:text-brand-blue'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="bg-brand-blue text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-brand-deep-blue hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 no-underline"
          >
            預約體驗
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-brand-blue transition-colors focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
            <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden absolute top-[88px] left-0 w-full bg-white border-b border-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors no-underline ${isActive(link.href)
                  ? 'bg-brand-blue/10 text-brand-blue font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 pb-2 px-4">
            <Link
              href="/register"
              className="block w-full text-center bg-brand-blue text-white py-3 rounded-full font-bold shadow-md active:scale-95 transition-transform no-underline"
              onClick={() => setIsMenuOpen(false)}
            >
              預約體驗
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
