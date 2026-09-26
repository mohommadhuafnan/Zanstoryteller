import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react'

const faqItems = [
  {
    id: "faq-1",
    num: "01",
    category: "BOOKING & TIMELINE",
    question: "How far in advance should we reserve our date?",
    answer: "Because we deliberately accept a limited number of weddings and editorial projects each season to dedicate our full attention to every story, we recommend booking 6 to 12 months in advance for weddings and destination galas. For portrait, maternity, and commercial sessions, 3 to 6 weeks advance notice is generally ideal."
  },
  {
    id: "faq-2",
    num: "02",
    category: "DESTINATIONS & TRAVEL",
    question: "Do you travel across Sri Lanka and internationally?",
    answer: "Yes, without hesitation. We are based in Sri Lanka and frequently travel across the entire island (Galle Fort, Kandy Hills, Bentota, Nuwara Eliya, Tangalle) as well as destinations worldwide across the Middle East, Asia, and Europe. All travel fees, permits, and itineraries are transparently coordinated in advance."
  },
  {
    id: "faq-3",
    num: "03",
    category: "CREATIVE APPROACH",
    question: "How would you describe your photographic style?",
    answer: "Our visual language is a fusion of cinematic documentary storytelling and modern fine-art editorial. We prioritize authentic emotion, natural light, and quiet candid moments over stiff, forced poses. Our goal is to make you feel effortless and completely present while we craft timeless heirlooms."
  },
  {
    id: "faq-4",
    num: "04",
    category: "DELIVERY & ALBUMS",
    question: "How many images do we receive, and when is the gallery delivered?",
    answer: "For full-day weddings, you typically receive 500 to 800 meticulously hand-edited, high-resolution photographs. For portrait and studio sessions, between 40 and 80 curated frames. You'll receive an exclusive sneak-peek preview within 48 to 72 hours, with your private master gallery and bespoke archival print album ready within 4 to 6 weeks."
  },
  {
    id: "faq-5",
    num: "05",
    category: "CUSTOMIZATION",
    question: "Can we customize coverage hours or add a second photographer?",
    answer: "Absolutely. No two stories are identical. During our initial consultation, we can tailor every facet of your coverage—including multi-day shoots, second lead cinematographers, drone aerial documentation, medium format film stills, and handcrafted linen albums."
  },
  {
    id: "faq-6",
    num: "06",
    category: "ON THE DAY",
    question: "What if the weather changes or outdoor conditions shift?",
    answer: "Weather is a vital part of the atmosphere and emotional depth of outdoor storytelling. We work fluently with shifting light, ocean mist, and tropical rainfall to create moody, cinematic compositions. We also scout backup sheltered architectural sanctuaries for every outdoor shoot."
  }
]

export default function QASection() {
  const [openId, setOpenId] = useState("faq-1") // First item open by default

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const whatsappNumber = "+94771234567"
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Zanstoryteller, I have a question about booking a session.")}`

  return (
    <section id="faq" className="relative z-10 w-full bg-[#FFFFFF] text-[#111111] py-28 sm:py-36 md:py-44 px-6 sm:px-12 md:px-20 border-t border-[#EAEAEA]">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 pb-8 border-b border-[#EAEAEA]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#111111]" />
              <span className="text-[11px] font-mono tracking-[0.28em] text-[#666666] uppercase">
                Questions & Answers
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] uppercase leading-[1.08]">
              Curious Minds. <br />
              <span className="font-serif italic font-normal text-[#111111] lowercase tracking-normal">frequently asked</span> <br />
              Questions.
            </h2>
          </div>

          <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end gap-3">
            <p className="text-sm text-[#666666] font-light max-w-xs md:text-right">
              Clear guidance on our philosophy, bookings, deliverables, and session experience.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#111111] hover:text-[#4E67C8] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask Directly on WhatsApp →</span>
            </a>
          </div>
        </div>

        {/* Accordion List with Smooth Animation */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openId === item.id

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`border rounded-lg transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#111111] bg-[#FAFAFA] shadow-sm'
                    : 'border-[#EAEAEA] bg-white hover:border-[#CCCCCC]'
                }`}
              >
                {/* Accordion Question Header */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full py-6 px-6 sm:px-8 text-left flex items-center justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
                    <span className="text-xs font-mono text-[#999999] tracking-widest pt-0.5 sm:pt-0">
                      {item.num}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#888888] sm:min-w-[150px]">
                        {item.category}
                      </span>
                      <h3 className={`text-base sm:text-lg font-light tracking-wide transition-colors ${
                        isOpen ? 'text-[#111111] font-normal' : 'text-[#333333] group-hover:text-[#111111]'
                      }`}>
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  {/* Animated Toggle Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isOpen ? 'bg-[#111111] text-white rotate-180' : 'bg-[#F2F2F2] text-[#555555] group-hover:bg-[#E5E5E5]'
                  }`}>
                    {isOpen ? (
                      <Minus className="w-4 h-4 stroke-[2.2]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.2]" />
                    )}
                  </div>
                </button>

                {/* Animated Accordion Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-7 pt-1 text-sm sm:text-base text-[#555555] font-light leading-relaxed border-t border-[#F0F0F0]/80 sm:ml-10">
                        <p>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Reassurance Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 p-6 sm:p-8 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center text-[#111111] shrink-0">
              <HelpCircle className="w-5 h-5 text-[#444444]" />
            </div>
            <div>
              <h4 className="text-sm font-medium tracking-wide text-[#111111] uppercase">
                Have a unique question not listed here?
              </h4>
              <p className="text-xs text-[#777777] font-light mt-0.5">
                We're always here to chat about ideas, custom schedules, and bespoke projects.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="px-6 py-2.5 bg-[#111111] text-white font-mono text-xs uppercase tracking-widest rounded-sm hover:bg-[#333333] transition-colors whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            Get In Touch
          </a>
        </motion.div>

      </div>
    </section>
  )
}
