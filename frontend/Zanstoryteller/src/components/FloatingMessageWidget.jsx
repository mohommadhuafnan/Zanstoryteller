import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// Authentic WhatsApp icon with phone handset
function WhatsAppSolidIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.16C10.56 20.16 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16ZM16.57 14.39C16.32 14.27 15.1 13.67 14.87 13.58C14.64 13.5 14.48 13.45 14.31 13.7C14.15 13.95 13.68 14.5 13.53 14.67C13.39 14.83 13.25 14.85 13 14.73C12.75 14.6 11.71 14.26 10.48 13.17C9.52 12.32 8.87 11.27 8.68 11.02C8.5 10.77 8.66 10.64 8.78 10.52C8.9 10.4 9.04 10.22 9.17 10.07C9.3 9.92 9.34 9.82 9.42 9.65C9.5 9.48 9.46 9.34 9.4 9.22C9.34 9.1 8.85 7.89 8.64 7.39C8.44 6.9 8.24 6.97 8.09 6.96C7.94 6.95 7.78 6.95 7.61 6.95C7.45 6.95 7.18 7.01 6.95 7.26C6.73 7.51 6.09 8.1 6.09 9.32C6.09 10.54 6.98 11.71 7.1 11.88C7.23 12.04 8.85 14.54 11.33 15.61C11.92 15.86 12.38 16.02 12.74 16.13C13.33 16.32 13.87 16.29 14.3 16.23C14.78 16.16 15.77 15.63 15.98 15.05C16.18 14.47 16.18 13.97 16.12 13.87C16.06 13.77 15.9 13.71 15.65 13.59L16.57 14.39Z" />
    </svg>
  )
}

// Authentic Facebook Messenger lightning icon
function MessengerSolidIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.36 2 2 6.13 2 11.7C2 14.61 3.32 17.18 5.48 18.87V22L8.52 20.33C9.61 20.63 10.78 20.8 12 20.8C17.64 20.8 22 16.67 22 11.1C22 5.53 17.64 2 12 2ZM13.08 14.36L10.6 11.72L5.76 14.36L11.08 8.71L13.56 11.35L18.4 8.71L13.08 14.36Z" />
    </svg>
  )
}

// Initial chat bubble with 3 dots (matches user screenshot 2)
function ChatBubbleDotsIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6.5 11C5.67 11 5 10.33 5 9.5C5 8.67 5.67 8 6.5 8C7.33 8 8 8.67 8 9.5C8 10.33 7.33 11 6.5 11ZM12 11C11.17 11 10.5 10.33 10.5 9.5C10.5 8.67 11.17 8 12 8C12.83 8 13.5 8.67 13.5 9.5C13.5 10.33 12.83 11 12 11ZM17.5 11C16.67 11 16 10.33 16 9.5C16 8.67 16.67 8 17.5 8C18.33 8 19 8.67 19 9.5C19 10.33 18.33 11 17.5 11Z" />
    </svg>
  )
}

export default function FloatingMessageWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredButton, setHoveredButton] = useState(null) // 'whatsapp' | 'messenger' | 'hide' | null

  // Direct links for WhatsApp and Facebook
  const whatsappNumber = "+94771234567" // Customizable via phone or business number
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Zanstoryteller, I would like to inquire about booking a photography session.")}`
  const messengerUrl = "https://m.me/zanstoryteller"

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false)
        setHoveredButton(null)
      }}
    >
      {/* Expanded Actions Stack */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-col items-end gap-3.5 mb-3.5"
          >
            {/* 1. WHATSAPP BUTTON (Shows label only when hovering specifically on WhatsApp icon) */}
            <div className="flex items-center gap-3">
              <AnimatePresence>
                {hoveredButton === 'whatsapp' && (
                  <motion.div
                    initial={{ opacity: 0, x: 8, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="relative bg-white text-[#222222] font-serif text-[15px] px-3.5 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center pointer-events-none whitespace-nowrap"
                  >
                    <span>Whatsapp</span>
                    <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Green WhatsApp Circle */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                onMouseEnter={() => setHoveredButton('whatsapp')}
                onMouseLeave={() => setHoveredButton(null)}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:scale-108 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
              >
                <WhatsAppSolidIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </a>
            </div>

            {/* 2. FACEBOOK MESSENGER BUTTON (Shows label only when hovering specifically on Messenger icon) */}
            <div className="flex items-center gap-3">
              <AnimatePresence>
                {hoveredButton === 'messenger' && (
                  <motion.div
                    initial={{ opacity: 0, x: 8, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="relative bg-white text-[#222222] font-serif text-[15px] px-3.5 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center pointer-events-none whitespace-nowrap"
                  >
                    <span>Facebook Messenger</span>
                    <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              <a
                href={messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on Facebook Messenger"
                onMouseEnter={() => setHoveredButton('messenger')}
                onMouseLeave={() => setHoveredButton(null)}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0084FF] text-white shadow-[0_4px_20px_rgba(0,132,255,0.45)] hover:scale-108 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
              >
                <MessengerSolidIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bottom Trigger Button Row with Hide Tooltip */}
      <div className="flex items-center gap-3">
        {/* 3. HIDE TOOLTIP (Shows only when menu is open and hovering over the Close X button) */}
        <AnimatePresence>
          {isOpen && hoveredButton === 'hide' && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white text-[#222222] font-serif text-[15px] px-3.5 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center pointer-events-none whitespace-nowrap"
            >
              <span>Hide</span>
              <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button (Toggle between Chat Icon & X) */}
        <button
          type="button"
          onClick={() => {
            const next = !isOpen
            setIsOpen(next)
            if (!next) setHoveredButton(null)
          }}
          onMouseEnter={() => {
            if (isOpen) setHoveredButton('hide')
          }}
          onMouseLeave={() => setHoveredButton(null)}
          aria-label={isOpen ? "Close messaging options" : "Open messaging options"}
          className={`w-14 h-14 sm:w-15 sm:h-15 rounded-full text-white shadow-[0_6px_24px_rgba(78,103,200,0.45)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isOpen ? 'bg-[#4E67C8]' : 'bg-[#4E67C8] hover:bg-[#4359B5]'
          }`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close-icon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="w-7 h-7 stroke-[2.8]" />
              </motion.div>
            ) : (
              <motion.div
                key="chat-icon"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <ChatBubbleDotsIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}
