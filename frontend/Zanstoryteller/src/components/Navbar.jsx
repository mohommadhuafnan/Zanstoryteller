import React, { useState, useEffect } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar({ onNavigate, currentPath }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [galleryDropdownOpen, setGalleryDropdownOpen] = useState(false)
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false)

  const galleryCategories = [
    { title: "MATERNITY PHOTOGRAPHY", slug: "maternity-photography" },
    { title: "MATERNITY PHOTOSHOOT", slug: "maternity-photoshoot" },
    { title: "MODEL SHOOT", slug: "model-shoot" },
    { title: "MUSIC VIDEO", slug: "music-video" },
    { title: "DHL", slug: "dhl" },
    { title: "GYM", slug: "gym" },
    { title: "NIGHT LIFE", slug: "night-life" },
    { title: "SALOON SHOOT", slug: "saloon-shoot" },
    { title: "ABAYA SHOP", slug: "abaya-shop" },
    { title: "WORKSHOP PHOTOGRAPHY", slug: "workshop-photography" },
    { title: "WEDDING", slug: "wedding" },
    { title: "KATARA", slug: "katara" },
    { title: "FITNESS", slug: "fitness" },
    { title: "ARCHITECTURE", slug: "architecture" }
  ]

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Gallery", href: "/gallery/wedding", isDropdown: true },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" }
  ]

  // Lock body scroll and allow Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setGalleryDropdownOpen(false)
      }
    }
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen])

  // Navigation handlers
  const handleBrandClick = (e) => {
    if (currentPath !== '/') {
      e.preventDefault()
      if (onNavigate) onNavigate('/')
    }
  }

  const handleBookClick = (e) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate('/book-session')
    } else {
      window.history.pushState({}, '', '/book-session')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    setMobileMenuOpen(false)
  }

  const handleLinkClick = (e, href) => {
    if (currentPath !== '/') {
      e.preventDefault()
      if (onNavigate) {
        onNavigate('/')
        setTimeout(() => {
          const target = document.querySelector(href)
          if (target) target.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    }
    setMobileMenuOpen(false)
  }

  const handleCategoryClick = (e, slug) => {
    e.preventDefault()
    setGalleryDropdownOpen(false)
    setMobileMenuOpen(false)
    if (onNavigate) {
      onNavigate(`/gallery/${slug}`)
    }
  }

  const isDarkNav = isScrolled || currentPath.startsWith('/book-session') || currentPath.startsWith('/gallery')

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isDarkNav
            ? 'bg-[#020202]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand */}
          <a
            href="/"
            onClick={handleBrandClick}
            className="group flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300"
            aria-label="Zanstoryteller Home"
          >
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white/80 group-hover:scale-125 transition-transform duration-300" />
            <span className="font-light tracking-[0.24em] sm:tracking-[0.28em] text-[13px] sm:text-base uppercase text-white font-sans">
              Zanstoryteller
            </span>
          </a>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] tracking-[0.18em] uppercase text-white/60 font-mono">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative group py-2"
                    onMouseEnter={() => setGalleryDropdownOpen(true)}
                    onMouseLeave={() => setGalleryDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleCategoryClick(e, 'wedding')}
                      className={`hover:text-white transition-colors duration-200 uppercase flex items-center gap-1 cursor-pointer ${
                        currentPath.startsWith('/gallery') ? 'text-white' : ''
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-[9px] opacity-60 group-hover:translate-y-0.5 transition-transform">▼</span>
                    </button>

                    {/* Dropdown Menu (All 14 Categories in Capital Letters) */}
                    <AnimatePresence>
                      {galleryDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[580px]"
                        >
                          <div className="bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/12 rounded-lg p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                              <span className="text-[10px] tracking-[0.28em] text-white/40 uppercase font-mono">
                                Curated Categories // Archive
                              </span>
                              <span className="text-[10px] tracking-widest text-white/40 font-mono">
                                14 Collections
                              </span>
                            </div>

                            {/* 2-Column Grid of 14 Categories */}
                            <div className="grid grid-cols-2 gap-1.5">
                              {galleryCategories.map((cat, idx) => (
                                <a
                                  key={cat.slug}
                                  href={`/gallery/${cat.slug}`}
                                  onClick={(e) => handleCategoryClick(e, cat.slug)}
                                  className="group/item flex items-center justify-between px-3 py-2 rounded text-[11px] font-mono tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
                                >
                                  <span className="truncate">{cat.title}</span>
                                  <span className="text-[10px] text-white/30 group-hover/item:text-white group-hover/item:translate-x-0.5 transition-all">
                                    →
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleBookClick}
              className="text-[9px] sm:text-[11px] uppercase font-mono tracking-wider sm:tracking-[0.18em] px-2.5 sm:px-4 py-1 sm:py-2 whitespace-nowrap border border-white/20 hover:border-white/60 text-white/90 hover:text-white transition-all duration-300 rounded-sm hover:bg-white/[0.04] cursor-pointer"
            >
              Book Session
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Cinematic Scroll Progress Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent origin-left"
          style={{ scaleX }}
        />
      </header>

      {/* Mobile Right-Side Slide-Over Menu (Right to Left) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Click-outside backdrop overlay to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
              aria-label="Close menu overlay"
            />

            {/* Right-Side Slide Drawer (slides right to left) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 bottom-0 w-[300px] sm:w-[360px] max-w-[85vw] h-full bg-[#0a0a0a] border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-2xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top / Header */}
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/70">
                      Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                  {navLinks.map((link) => {
                    if (link.isDropdown) {
                      return (
                        <div key={link.label} className="border-b border-white/[0.05]">
                          <button
                            type="button"
                            onClick={() => setMobileGalleryOpen(!mobileGalleryOpen)}
                            className="w-full flex items-center justify-between py-3 text-sm font-mono uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all text-left cursor-pointer"
                          >
                            <span>{link.label}</span>
                            <span className="text-xs text-white/50">
                              {mobileGalleryOpen ? '▲' : '▼'}
                            </span>
                          </button>

                          {mobileGalleryOpen && (
                            <div className="pl-3 pb-3 flex flex-col gap-1.5 border-l border-white/10 ml-2">
                              {galleryCategories.map((cat) => (
                                <a
                                  key={cat.slug}
                                  href={`/gallery/${cat.slug}`}
                                  onClick={(e) => handleCategoryClick(e, cat.slug)}
                                  className="text-[11px] font-mono tracking-wider uppercase text-white/60 hover:text-white py-1 transition-colors"
                                >
                                  {cat.title}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    }

                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className="group flex items-center justify-between py-3 text-sm font-mono uppercase tracking-[0.2em] text-white/75 hover:text-white transition-all border-b border-white/[0.05]"
                      >
                        <span>{link.label}</span>
                        <span className="text-xs text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all">
                          →
                        </span>
                      </a>
                    )
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Action & Brand Tag */}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                <button
                  type="button"
                  onClick={handleBookClick}
                  className="w-full text-center text-[11px] uppercase font-mono tracking-[0.2em] py-3 border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-sm cursor-pointer"
                >
                  Book Session
                </button>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest text-center">
                  Colombo • Available Worldwide
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

