import React from 'react'
import { Sparkles, Layers, Image as ImageIcon, Briefcase, Star, MessageSquare, HelpCircle, ExternalLink, ShieldCheck, ArrowRight, CheckCircle2, CalendarCheck } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'

export default function OverviewDashboard({ onSelectTab, onNavigateHome }) {
  const { data } = useCMS()

  const stats = [
    { label: "Hero Slides", value: (data.heroSlides || []).length, tab: "hero", icon: Layers, color: "text-blue-600 bg-blue-50" },
    { label: "Carousel Frames", value: (data.editorialCarouselImages || []).length, tab: "carousel", icon: ImageIcon, color: "text-purple-600 bg-purple-50" },
    { label: "Services", value: (data.servicesData || []).length, tab: "services", icon: Briefcase, color: "text-emerald-600 bg-emerald-50" },
    { label: "Portfolio Items", value: (data.portfolioItems || []).length, tab: "portfolio", icon: Star, color: "text-amber-600 bg-amber-50" },
    { label: "Client Reviews", value: (data.testimonialsData || []).length, tab: "testimonials", icon: MessageSquare, color: "text-rose-600 bg-rose-50" },
    { label: "FAQ Items", value: (data.faqItems || []).length, tab: "faq", icon: HelpCircle, color: "text-indigo-600 bg-indigo-50" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0d1b2a] to-[#1b263b] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-white/10">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono tracking-widest text-[#D8BB7B] uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Control Hub • Live Sync Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase">
            Welcome to Zan Storyteller <br />
            <span className="font-semibold text-[#D8BB7B]">Admin Studio</span>
          </h1>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed font-light">
            You have complete sovereign control over every image, paragraph, testimonial, and category across the entire platform without touching a single line of code.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('bookings')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D8BB7B] hover:bg-[#e2c78a] text-[#0d1b2a] rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              <span>View Client Bookings</span>
              <CalendarCheck className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium uppercase tracking-wider transition border border-white/15 cursor-pointer"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectTab('hero')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium uppercase tracking-wider transition border border-white/15 cursor-pointer"
            >
              <span>Edit Hero Slides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Platform Statistics
          </h2>
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync Connected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <button
                key={stat.label}
                onClick={() => onSelectTab(stat.tab)}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0d1b2a]/30 transition text-left group cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 truncate group-hover:text-[#0d1b2a] font-medium">
                  {stat.label}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onSelectTab('hero')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0d1b2a] text-[#D8BB7B] flex items-center justify-center mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide group-hover:text-[#0d1b2a]">
            Update Landing Cover
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Replace the opening full-bleed photos, title typography, and location tags.
          </p>
        </div>

        <div 
          onClick={() => onSelectTab('categories')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0d1b2a] text-[#D8BB7B] flex items-center justify-center mb-4">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide group-hover:text-[#0d1b2a]">
            Manage 14 Categories
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Add new high-resolution client photos and update album descriptions.
          </p>
        </div>

        <div 
          onClick={() => onSelectTab('contact')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0d1b2a] text-[#D8BB7B] flex items-center justify-center mb-4">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide group-hover:text-[#0d1b2a]">
            Direct WhatsApp & Phone
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Update phone numbers, booking emails, and social media channels.
          </p>
        </div>
      </div>
    </div>
  )
}
