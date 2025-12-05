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
    // Safe: only runs on navigation to collapse mobile menu
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false)
  }, [pathname])

  // Admin check
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href + '/'))

  return (
    <>
      <style jsx global>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 15px rgba(0,0,0,0.05);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 0.75rem;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          position: relative;
        }

        /* Mobile Header (Default) */
        .header-mobile-layout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 8px;
        }

        /* Logo Styles */
        .logo-link {
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          flex: 1 1 auto;
          justify-content: center;
          min-width: 0;
        }

        .logo-icon-wrapper {
          position: relative;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        .logo-text-group {
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 1;
          text-align: center;
          gap: 0px;
        }

        .logo-title {
          font-family: 'Huninn', 'jf-openhuninn-2.0', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #333;
          margin: 0;
          letter-spacing: 0em;
          white-space: nowrap;
          line-height: 1.2;
        }

        .logo-subtitle {
          font-family: 'Noto Sans TC', sans-serif;
          font-size: 7px;
          font-weight: 700;
          color: #4A90C8;
          white-space: nowrap;
          margin: 0;
          letter-spacing: 0.05em;
          line-height: 1;
        }

        .logo-subtitle-full {
          font-family: 'Noto Sans TC', sans-serif;
          font-size: 7px;
          font-weight: 500;
          color: #666;
          white-space: nowrap;
          margin: 0;
          letter-spacing: 0.02em;
          line-height: 1;
        }

        /* Desktop container - hidden on mobile */
        .header-desktop {
          display: none;
          align-items: center;
          gap: 1rem;
          width: 100%;
          justify-content: space-between;
        }

        /* Desktop Nav - hidden on mobile */
        .nav-desktop {
          display: none !important;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: #666;
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          transition: color 0.2s;
          white-space: nowrap;
        }

        .nav-link:hover, .nav-link.active {
          color: #4A90C8;
          font-weight: 700;
        }

        .btn-register {
          background: #4A90C8;
          color: white;
          padding: 0.6rem 1.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.2s;
          box-shadow: 0 4px 10px rgba(74, 144, 200, 0.2);
          white-space: nowrap;
        }

        .btn-register:hover {
          background: #2E5C8A;
          transform: translateY(-1px);
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 24px;
          height: 16px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 101;
          flex-shrink: 0;
        }

        .hamburger-line {
          width: 100%;
          height: 2px;
          background-color: #333;
          border-radius: 2px;
          transition: all 0.25s ease;
        }

        .mobile-menu-btn.open .line-1 { transform: rotate(45deg) translate(4px, 4px); }
        .mobile-menu-btn.open .line-2 { opacity: 0; }
        .mobile-menu-btn.open .line-3 { transform: rotate(-45deg) translate(4px, -4px); }

        /* Mobile Register Button */
        .mobile-header-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #4A90C8;
          color: white;
          padding: 5px 10px;
          border-radius: 9999px;
          text-decoration: none;
          font-weight: 700;
          font-size: 10px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(74, 144, 200, 0.2);
          flex-shrink: 0;
          line-height: 1.2;
        }

        /* Mobile Dropdown - hidden by default */
        .mobile-menu-dropdown {
          display: none;
          position: absolute;
          top: 56px;
          left: 0;
          width: 100%;
          background: white;
          border-bottom: 1px solid #eee;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
          opacity: 0;
        }

        .mobile-menu-dropdown.open {
          display: block;
          max-height: 420px;
          opacity: 1;
        }

        .mobile-nav-list { display: flex; flex-direction: column; padding: 0.5rem 1rem 1.5rem; }
        .mobile-nav-link { display: block; padding: 1rem; text-decoration: none; color: #333; font-weight: 500; border-bottom: 1px solid #f5f5f5; transition: color 0.2s; }
        .mobile-nav-link:last-child { border-bottom: none; }
        .mobile-nav-link:hover, .mobile-nav-link.active { color: #4A90C8; font-weight: 700; }

        /* Responsive Breakpoints */
        @media (min-width: 768px) {
          .header-container { height: 88px; padding: 0 1.5rem; }
          .header-mobile-layout { display: none; }
          .header-desktop { display: flex; }
          .logo-link { gap: 10px; flex: 0 0 auto; justify-content: flex-start; }
          .logo-icon-wrapper { width: 52px; height: 52px; }
          .logo-title { font-size: 28px; }
          .logo-subtitle { font-size: 13px; }
          .logo-subtitle-full { display: none; }
          .nav-desktop { display: flex !important; }
          .mobile-menu-btn { display: none; }
          .mobile-header-btn { display: none; }
          .mobile-menu-dropdown { display: none !important; }
        }
      `}</style>

      <header className="site-header">
        <div className="header-container">
          {/* Mobile Layout */}
          <div className="header-mobile-layout">
            {/* Left: Menu Button */}
            <button
              className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line line-1" />
              <span className="hamburger-line line-2" />
              <span className="hamburger-line line-3" />
            </button>

            {/* Center: Logo */}
            <Link href="/" className="logo-link">
              <div className="logo-icon-wrapper">
                <Image
                  src="/logo.png"
                  alt="光·來了 Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              <div className="logo-text-group">
                <span className="logo-title">光·來了</span>
                <span className="logo-subtitle">Be Light Kids</span>
                <span className="logo-subtitle-full">大里思恩堂兒童主日學</span>
              </div>
            </Link>

            {/* Right: Register Button */}
            <Link href="/register" className="mobile-header-btn">
              預約
            </Link>
          </div>

          {/* Desktop Layout Container */}
          <div className="header-desktop">
            <Link href="/" className="logo-link">
              <div className="logo-icon-wrapper">
                <Image
                  src="/logo.png"
                  alt="光·來了 Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              <div className="logo-text-group">
                <span className="logo-title">光·來了</span>
                <span className="logo-subtitle">Be Light Kids</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="nav-desktop">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/register" className="btn-register">
                預約體驗
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`mobile-menu-dropdown ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav-list">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-nav-link ${isActive(link.href) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}
