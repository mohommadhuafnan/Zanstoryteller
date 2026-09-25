import React, { useState, useEffect } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
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

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" }
  ]

  // Lock body scroll and allow Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#020202]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand */}
          <a
            href="#hero"
            className="group flex items-center gap-2.5 text-white/90 hover:text-white transition-colors duration-300"
            aria-label="Zanstoryteller Home"
          >
            <span className="w-2 h-2 rounded-full bg-white/80 group-hover:scale-125 transition-transform duration-300" />
            <span className="font-light tracking-[0.28em] text-sm sm:text-base uppercase text-white font-sans">
              Zanstoryteller
            </span>
          </a>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] tracking-[0.18em] uppercase text-white/60 font-mono">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="text-[11px] uppercase font-mono tracking-[0.18em] px-4 py-2 border border-white/20 hover:border-white/60 text-white/90 hover:text-white transition-all duration-300 rounded-sm hover:bg-white/[0.04]"
            >
              Book Session
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
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
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center justify-between py-3 text-sm font-mono uppercase tracking-[0.2em] text-white/75 hover:text-white transition-all border-b border-white/[0.05]"
                    >
                      <span>{link.label}</span>
                      <span className="text-xs text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all">
                        →
                      </span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Drawer Bottom Action & Brand Tag */}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-[11px] uppercase font-mono tracking-[0.2em] py-3 border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
                >
                  Book Session
                </a>
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
