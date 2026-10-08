import React from 'react'
import { motion } from 'framer-motion'
import { footerData as defaultFooterData } from '../data/photographyData'
import { ArrowUp } from 'lucide-react'
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from './Icons'
import { useCMS } from '../context/CMSContext'

export default function Footer({ className = '' }) {
  const { data } = useCMS()
  const rawFooter = data?.footerData || defaultFooterData

  // Safe fallback guarantees against partial or missing cloud database fields
  const footerData = {
    brand: rawFooter?.brand || defaultFooterData.brand || 'ZAN STORYTELLER',
    tagline: rawFooter?.tagline || defaultFooterData.tagline || 'Cinematic Documentary & Fine Art Photography',
    contact: {
      email: rawFooter?.contact?.email || defaultFooterData.contact?.email || 'info@zanstoryteller.com',
      phone: rawFooter?.contact?.phone || defaultFooterData.contact?.phone || '+974 6690 4220',
      location: rawFooter?.contact?.location || defaultFooterData.contact?.location || 'Colombo, Sri Lanka & Doha, Qatar'
    },
    navLinks: Array.isArray(rawFooter?.navLinks) && rawFooter.navLinks.length > 0
      ? rawFooter.navLinks
      : (defaultFooterData.navLinks || [
          { label: "Home", href: "#hero" },
          { label: "About", href: "#about" },
          { label: "Services", href: "#services" },
          { label: "Portfolio", href: "#portfolio" },
          { label: "Album", href: "/album" },
          { label: "Contact", href: "#contact" }
        ]),
    socials: Array.isArray(rawFooter?.socials) && rawFooter.socials.length > 0
      ? rawFooter.socials
      : (defaultFooterData.socials || []),
    socialLinks: rawFooter?.socialLinks || {}
  }

  const instagramUrl = footerData.socialLinks.instagram || footerData.socials?.[0]?.href || 'https://instagram.com'
  const facebookUrl = footerData.socialLinks.facebook || footerData.socials?.[1]?.href || 'https://facebook.com'
  const whatsappUrl = footerData.socialLinks.whatsapp || footerData.socials?.[2]?.href || 'https://wa.me/97466904220'

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  const handleNavLinkClick = (e, href) => {
    if (href.startsWith('#')) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'
      if (window.location.pathname !== '/') {
        e.preventDefault()
        window.location.href = `/${href}`
      } else {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: scrollBehavior })
          window.history.pushState(null, '', href)
        }
      }
    }
  }

  return (
    <footer className={`relative z-10 w-full text-white pt-20 pb-12 px-6 sm:px-12 md:px-20 border-t border-white/[0.08] ${className || 'bg-[#020202]'}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto"
      >
        {/* Main Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08]">
          
          {/* Brand Info (Left) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo.png"
                  alt="Zan Storyteller Logo"
                  className="w-8 h-8 object-contain drop-shadow-[0_2px_10px_rgba(216,187,123,0.4)]"
                />
                <span className="font-light tracking-[0.28em] text-lg uppercase font-sans text-white">
                  {footerData.brand}
                </span>
              </div>
              <p className="text-sm text-white/50 font-light max-w-sm leading-relaxed mb-6">
                {footerData.tagline}
              </p>
            </div>

            <div className="space-y-1 text-xs font-mono text-white/60">
              <p>{footerData.contact.location}</p>
              <p>
                <a href={`mailto:${footerData.contact.email}`} className="hover:text-white transition-colors">
                  {footerData.contact.email}
                </a>
              </p>
              <p>
                <a href={`tel:${footerData.contact.phone}`} className="hover:text-white transition-colors">
                  {footerData.contact.phone}
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Links (Middle) */}
          <div className="md:col-span-4">
            <div className="text-[11px] font-mono tracking-widest text-white/40 uppercase mb-6">
              Navigation
            </div>
            <ul className="grid grid-cols-2 gap-3 text-sm font-light text-white/70">
              {footerData.navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavLinkClick(e, link.href)}
                    className="hover:text-white transition-colors block py-1 font-mono text-xs uppercase tracking-wider"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Back-To-Top (Right) */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end">
            <div>
              <div className="text-[11px] font-mono tracking-widest text-white/40 uppercase mb-6 md:text-right">
                Social Channels
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="mt-8 md:mt-0 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back To Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-mono gap-4">
          <p>© {new Date().getFullYear()} Zan Storyteller. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Visual Craft by</span>
            <span className="text-white/80 font-medium tracking-wide">Webcoder (Mohommadhu Afnan)</span>
          </p>
        </div>

      </motion.div>
    </footer>
  )
}
