import React from 'react'
import { Sparkles, Phone, Mail, MapPin, MessageSquare } from 'lucide-react'
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '../../Icons'
import { useCMS } from '../../../context/CMSContext'
import ImageUploadField from '../ImageUploadField'

export default function ContactFooterEditor() {
  const { data, updateFooter, updateFinalCTA } = useCMS()
  const footer = data.footerData || {}
  const contact = footer.contact || {}
  const finalCTA = data.finalCTAData || {}

  const handleContactChange = (field, value) => {
    updateFooter({
      ...footer,
      contact: {
        ...contact,
        [field]: value
      }
    })
  }

  const handleFooterFieldChange = (field, value) => {
    updateFooter({
      ...footer,
      [field]: value
    })
  }

  const handleSocialChange = (label, newHref) => {
    const socials = (footer.socials || []).map(s => {
      if (s.label.toLowerCase() === label.toLowerCase()) {
        return { ...s, href: newHref }
      }
      return s
    })
    updateFooter({
      ...footer,
      socials
    })
  }

  const handleCTAChange = (field, value) => {
    updateFinalCTA({
      ...finalCTA,
      [field]: value
    })
  }

  const getSocialHref = (label) => {
    const item = (footer.socials || []).find(s => s.label.toLowerCase() === label.toLowerCase())
    return item ? item.href : ''
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
          <span>Contact & Brand Details</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Direct Contact & Footer Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Update your phone, email, WhatsApp, Instagram links, and final CTA banner.
        </p>
      </div>

      {/* Final CTA Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-3 border-b border-slate-100">
          Final Call to Action Banner
        </h3>

        <ImageUploadField
          label="CTA Background Image"
          currentImage={finalCTA.bgImage}
          onImageChange={(img) => handleCTAChange('bgImage', img)}
          onImageDelete={() => handleCTAChange('bgImage', '')}
          aspectHint="Wide Banner (1920×800 px)"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Label
            </label>
            <input
              type="text"
              value={finalCTA.label || ''}
              onChange={(e) => handleCTAChange('label', e.target.value)}
              placeholder="LET'S CREATE TOGETHER"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Heading
            </label>
            <input
              type="text"
              value={finalCTA.heading || ''}
              onChange={(e) => handleCTAChange('heading', e.target.value)}
              placeholder="READY TO TELL YOUR STORY?"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Supporting Text
            </label>
            <textarea
              rows={2}
              value={finalCTA.supporting || ''}
              onChange={(e) => handleCTAChange('supporting', e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Direct Contact Numbers & Channels */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-3 border-b border-slate-100">
          Studio Contact Channels
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#0d1b2a]" />
              Phone Number
            </label>
            <input
              type="text"
              value={contact.phone || ''}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              placeholder="+974 6690 4220"
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0d1b2a]" />
              Email Address
            </label>
            <input
              type="email"
              value={contact.email || ''}
              onChange={(e) => handleContactChange('email', e.target.value)}
              placeholder="fowzan80@gmail.com"
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Direct Link / Number
            </label>
            <input
              type="text"
              value={getSocialHref('WhatsApp')}
              onChange={(e) => handleSocialChange('WhatsApp', e.target.value)}
              placeholder="https://wa.me/97466904220"
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
              <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
              Instagram Profile URL
            </label>
            <input
              type="text"
              value={getSocialHref('Instagram')}
              onChange={(e) => handleSocialChange('Instagram', e.target.value)}
              placeholder="https://www.instagram.com/zan_storyteller"
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0d1b2a]" />
              Physical Studio Location / Travel Radius
            </label>
            <input
              type="text"
              value={contact.location || ''}
              onChange={(e) => handleContactChange('location', e.target.value)}
              placeholder="Doha, Qatar • Available Worldwide"
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
              Brand Tagline (Shown in Footer)
            </label>
            <input
              type="text"
              value={footer.tagline || ''}
              onChange={(e) => handleFooterFieldChange('tagline', e.target.value)}
              placeholder="Photography that turns real moments into lasting stories."
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
