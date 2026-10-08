import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Layers,
  User,
  Image as ImageIcon,
  Briefcase,
  Star,
  Quote,
  Clock,
  Sparkles,
  MessageSquare,
  Camera,
  HelpCircle,
  Folder,
  Phone,
  Shield,
  LogOut,
  ExternalLink,
  Menu,
  X,
  CheckCircle2,
  ChevronRight,
  Download
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useCMS } from '../../context/CMSContext'

// Editors
import OverviewDashboard from './editors/OverviewDashboard'
import HeroEditor from './editors/HeroEditor'
import AboutEditor from './editors/AboutEditor'
import EditorialCarouselEditor from './editors/EditorialCarouselEditor'
import ServicesEditor from './editors/ServicesEditor'
import PortfolioEditor from './editors/PortfolioEditor'
import StoryScrollEditor from './editors/StoryScrollEditor'
import ProcessEditor from './editors/ProcessEditor'
import VisualStatementEditor from './editors/VisualStatementEditor'
import TestimonialsEditor from './editors/TestimonialsEditor'
import SocialGalleryEditor from './editors/SocialGalleryEditor'
import FAQEditor from './editors/FAQEditor'
import MasterAlbumEditor from './editors/MasterAlbumEditor'
import ContactFooterEditor from './editors/ContactFooterEditor'
import SecurityBackupEditor from './editors/SecurityBackupEditor'

const NAVIGATION_SECTIONS = [
  {
    group: "OVERVIEW",
    items: [
      { id: "overview", label: "Dashboard Hub", icon: LayoutDashboard }
    ]
  },
  {
    group: "WEBSITE SECTIONS",
    items: [
      { id: "hero", label: "01. Hero Banner", icon: Layers },
      { id: "about", label: "02. About Zan", icon: User },
      { id: "carousel", label: "02.5. Editorial Carousel", icon: ImageIcon },
      { id: "services", label: "03. Services (01-04)", icon: Briefcase },
      { id: "portfolio", label: "04. Featured Stories", icon: Star },
      { id: "storyscroll", label: "05. Philosophy (Light/Emotion)", icon: Sparkles },
      { id: "process", label: "06. Photography Process", icon: Clock },
      { id: "visual", label: "07. Visual Statement", icon: Quote },
      { id: "testimonials", label: "08. Client Reviews", icon: MessageSquare },
      { id: "social", label: "09. Social Feed", icon: Camera },
      { id: "faq", label: "09.5. Questions & Answers", icon: HelpCircle }
    ]
  },
  {
    group: "PORTFOLIO & GALLERIES",
    items: [
      { id: "categories", label: "14 Categories & Albums", icon: Folder }
    ]
  },
  {
    group: "SETTINGS & CHANNELS",
    items: [
      { id: "contact", label: "Contact & Footer", icon: Phone },
      { id: "security", label: "Security & Backups", icon: Shield }
    ]
  }
]

export default function AdminDashboard({ onNavigateHome }) {
  const { credentials, logout } = useAdminAuth()
  const { toastMessage, exportDataJSON } = useCMS()
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderActiveEditor = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard onSelectTab={handleSelectTab} onNavigateHome={onNavigateHome} />
      case 'hero':
        return <HeroEditor />
      case 'about':
        return <AboutEditor />
      case 'carousel':
        return <EditorialCarouselEditor />
      case 'services':
        return <ServicesEditor />
      case 'portfolio':
        return <PortfolioEditor />
      case 'storyscroll':
        return <StoryScrollEditor />
      case 'process':
        return <ProcessEditor />
      case 'visual':
        return <VisualStatementEditor />
      case 'testimonials':
        return <TestimonialsEditor />
      case 'social':
        return <SocialGalleryEditor />
      case 'faq':
        return <FAQEditor />
      case 'categories':
        return <MasterAlbumEditor />
      case 'contact':
        return <ContactFooterEditor />
      case 'security':
        return <SecurityBackupEditor />
      default:
        return <OverviewDashboard onSelectTab={handleSelectTab} onNavigateHome={onNavigateHome} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 antialiased selection:bg-[#0d1b2a] selection:text-[#D8BB7B]">
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR: Blue Color (#0d1b2a) from loading page */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-[#0d1b2a] text-white flex flex-col border-r border-white/10 shadow-2xl transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 shrink-0 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8BB7B]" />
              <h1 className="text-base font-bold tracking-[0.18em] uppercase text-white font-sans">
                Zan Storyteller
              </h1>
            </div>
            <p className="text-[10px] font-mono tracking-[0.2em] text-[#D8BB7B] uppercase mt-1 pl-4.5">
              Admin Studio v2.0
            </p>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-white/70 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-white/20">
          {NAVIGATION_SECTIONS.map((sec) => (
            <div key={sec.group}>
              <h3 className="text-[10px] font-mono tracking-[0.25em] text-slate-400 uppercase px-3 mb-2">
                {sec.group}
              </h3>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-[#1b263b] text-[#D8BB7B] font-semibold shadow-inner border border-[#D8BB7B]/20'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D8BB7B]' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#D8BB7B] shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-[#09131e] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-[#1b263b] border border-[#D8BB7B]/40 flex items-center justify-center text-xs font-mono text-[#D8BB7B]">
                {credentials.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {credentials.displayName || credentials.username}
                </p>
                <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Authenticated
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to log out of the admin panel?")) {
                  logout()
                }
              }}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNavigateHome}
            className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition border border-white/10 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>Open Public Website</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* RIGHT SIDE: White / Light Theme Content Area */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-slate-400">
                <span>Admin Studio</span>
                <span>/</span>
                <span className="text-[#0d1b2a] font-semibold">{activeTab}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 capitalize">
                {activeTab === 'overview' ? 'Dashboard Overview' : activeTab.replace(/([A-Z])/g, ' $1')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Sync Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Site Synchronized</span>
            </div>

            {/* Quick Export Button */}
            <button
              onClick={exportDataJSON}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              title="Export JSON snapshot"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>

            {/* View Live Site */}
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0d1b2a] hover:bg-[#1b263b] text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D8BB7B]" />
              <span className="hidden sm:inline">View Live Site</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {renderActiveEditor()}
        </div>
      </main>

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-medium border backdrop-blur-xl ${
              toastMessage.type === 'error'
                ? 'bg-red-900 text-white border-red-700 shadow-red-950/40'
                : 'bg-[#0d1b2a] text-white border-white/20 shadow-black/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#D8BB7B] shrink-0" />
            <span>{toastMessage.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
