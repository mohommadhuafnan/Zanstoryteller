import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  aboutData as initialAboutData,
  servicesData as initialServicesData,
  portfolioCategories as initialPortfolioCategories,
  portfolioItems as initialPortfolioItems,
  storyScrollSteps as initialStoryScrollSteps,
  processSteps as initialProcessSteps,
  visualStatementData as initialVisualStatementData,
  testimonialsData as initialTestimonialsData,
  socialPosts as initialSocialPosts,
  finalCTAData as initialFinalCTAData,
  footerData as initialFooterData,
  editorialCarouselImages as initialEditorialCarouselImages
} from '../data/photographyData'
import { GALLERY_CATEGORIES as initialGalleryCategories } from '../data/galleryCategoriesData'
import { HERO_SLIDES as initialHeroSlides } from '../data/heroSlidesData'
import { fetchCMSFromSupabase, persistCMSToSupabase } from '../utils/supabase'

const CMS_STORAGE_KEY = 'zanstoryteller_cms_data_v2'

const initialFaqItems = [
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
  }
]

export const defaultCMSState = {
  heroSlides: initialHeroSlides,
  aboutData: initialAboutData,
  editorialCarouselImages: initialEditorialCarouselImages,
  servicesData: initialServicesData,
  portfolioCategories: initialPortfolioCategories,
  portfolioItems: initialPortfolioItems,
  storyScrollSteps: initialStoryScrollSteps,
  processSteps: initialProcessSteps,
  visualStatementData: initialVisualStatementData,
  testimonialsData: initialTestimonialsData,
  socialPosts: initialSocialPosts,
  faqItems: initialFaqItems,
  finalCTAData: initialFinalCTAData,
  footerData: initialFooterData,
  galleryCategories: initialGalleryCategories,
  lastUpdated: new Date().toISOString()
}

const CMSContext = createContext(null)

export function CMSProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Ensure storyScrollSteps has at least 5 items
        let scrollSteps = Array.isArray(parsed.storyScrollSteps) ? [...parsed.storyScrollSteps] : [...initialStoryScrollSteps]
        if (scrollSteps.length < 5) {
          const missing = initialStoryScrollSteps.slice(scrollSteps.length)
          scrollSteps = [...scrollSteps, ...missing]
        }

        return {
          ...defaultCMSState,
          ...parsed,
          storyScrollSteps: scrollSteps,
          // Ensure nested objects merge gracefully
          aboutData: { ...defaultCMSState.aboutData, ...(parsed.aboutData || {}) },
          visualStatementData: { ...defaultCMSState.visualStatementData, ...(parsed.visualStatementData || {}) },
          finalCTAData: { ...defaultCMSState.finalCTAData, ...(parsed.finalCTAData || {}) },
          footerData: { ...defaultCMSState.footerData, ...(parsed.footerData || {}) },
        }
      }
    } catch (e) {
      console.warn("Failed to read CMS state from localStorage:", e)
    }
    return defaultCMSState
  })

  const [toastMessage, setToastMessage] = useState(null)

  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() })
    setTimeout(() => setToastMessage(null), 3500)
  }, [])

  // On mount: Try syncing with Supabase in background
  useEffect(() => {
    let isMounted = true
    async function loadCloudData() {
      try {
        const cloudData = await fetchCMSFromSupabase()
        if (cloudData && Object.keys(cloudData).length > 0 && isMounted) {
          setData(prev => {
            const mergedFooter = {
              ...defaultCMSState.footerData,
              ...(cloudData.footerData || {}),
              navLinks: Array.isArray(cloudData.footerData?.navLinks) && cloudData.footerData.navLinks.length > 0
                ? cloudData.footerData.navLinks
                : defaultCMSState.footerData.navLinks,
              socials: Array.isArray(cloudData.footerData?.socials) && cloudData.footerData.socials.length > 0
                ? cloudData.footerData.socials
                : defaultCMSState.footerData.socials,
              contact: {
                ...defaultCMSState.footerData.contact,
                ...(cloudData.footerData?.contact || {})
              }
            }

            // Normalize heroSlides images so broken /src/ paths fall back safely
            const mergedHeroSlides = Array.isArray(cloudData.heroSlides) && cloudData.heroSlides.length > 0
              ? cloudData.heroSlides.map((slide, i) => {
                  let img = slide.image
                  if (typeof img === 'string' && img.startsWith('/src/assets/scrolling/')) {
                    img = defaultCMSState.heroSlides[i]?.image || img.replace('/src/assets/scrolling/', '/scrolling/')
                  }
                  return { ...slide, image: img }
                })
              : defaultCMSState.heroSlides

            return {
              ...prev,
              ...cloudData,
              heroSlides: mergedHeroSlides,
              footerData: mergedFooter,
              aboutData: { ...defaultCMSState.aboutData, ...(cloudData.aboutData || {}) },
              visualStatementData: { ...defaultCMSState.visualStatementData, ...(cloudData.visualStatementData || {}) },
              finalCTAData: { ...defaultCMSState.finalCTAData, ...(cloudData.finalCTAData || {}) },
              servicesData: Array.isArray(cloudData.servicesData) && cloudData.servicesData.length > 0
                ? cloudData.servicesData
                : defaultCMSState.servicesData,
              portfolioItems: Array.isArray(cloudData.portfolioItems) && cloudData.portfolioItems.length > 0
                ? cloudData.portfolioItems
                : defaultCMSState.portfolioItems,
              portfolioCategories: Array.isArray(cloudData.portfolioCategories) && cloudData.portfolioCategories.length > 0
                ? cloudData.portfolioCategories
                : defaultCMSState.portfolioCategories,
              storyScrollSteps: Array.isArray(cloudData.storyScrollSteps) && cloudData.storyScrollSteps.length >= 5
                ? cloudData.storyScrollSteps
                : defaultCMSState.storyScrollSteps,
              processSteps: Array.isArray(cloudData.processSteps) && cloudData.processSteps.length > 0
                ? cloudData.processSteps
                : defaultCMSState.processSteps,
              testimonialsData: Array.isArray(cloudData.testimonialsData) && cloudData.testimonialsData.length > 0
                ? cloudData.testimonialsData
                : defaultCMSState.testimonialsData,
              socialPosts: Array.isArray(cloudData.socialPosts) && cloudData.socialPosts.length > 0
                ? cloudData.socialPosts
                : defaultCMSState.socialPosts,
              faqItems: Array.isArray(cloudData.faqItems) && cloudData.faqItems.length > 0
                ? cloudData.faqItems
                : defaultCMSState.faqItems,
              editorialCarouselImages: Array.isArray(cloudData.editorialCarouselImages) && cloudData.editorialCarouselImages.length > 0
                ? cloudData.editorialCarouselImages
                : defaultCMSState.editorialCarouselImages,
            }
          })
        }
      } catch (e) {
        console.warn("Notice: Continuing with cached CMS data:", e)
      }
    }
    loadCloudData()
    return () => { isMounted = false }
  }, [])

  // Auto-sync state changes to localStorage and Supabase
  const persistData = useCallback((newData) => {
    setData(newData)
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(newData))
    } catch (err) {
      console.error("Storage error:", err)
      showToast("Storage quota reached or error saving data", "error")
    }

    // Background push to Supabase
    persistCMSToSupabase(newData).catch(err => {
      console.warn("Supabase background sync notice:", err)
    })
  }, [showToast])

  // Direct section updater
  const updateSection = useCallback((sectionKey, updatedValue) => {
    setData(prev => {
      const next = {
        ...prev,
        [sectionKey]: updatedValue,
        lastUpdated: new Date().toISOString()
      }
      persistData(next)
      return next
    })
    showToast(`Updated ${sectionKey.replace(/([A-Z])/g, ' $1').toLowerCase()} successfully!`)
  }, [persistData, showToast])

  // --- Specific Helpers ---
  const updateHeroSlide = useCallback((index, updatedSlide) => {
    setData(prev => {
      const slides = [...prev.heroSlides]
      slides[index] = { ...slides[index], ...updatedSlide }
      const next = { ...prev, heroSlides: slides, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Hero slide updated live!')
  }, [persistData, showToast])

  const addHeroSlide = useCallback((newSlide) => {
    setData(prev => {
      const slides = [...prev.heroSlides, { ...newSlide, id: `slide-${Date.now()}` }]
      const next = { ...prev, heroSlides: slides, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('New hero slide added!')
  }, [persistData, showToast])

  const deleteHeroSlide = useCallback((index) => {
    setData(prev => {
      if (prev.heroSlides.length <= 1) {
        showToast('At least one hero slide must remain', 'error')
        return prev
      }
      const slides = prev.heroSlides.filter((_, i) => i !== index)
      const next = { ...prev, heroSlides: slides, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Hero slide deleted!')
  }, [persistData, showToast])

  // About Section
  const updateAbout = useCallback((updatedAbout) => {
    updateSection('aboutData', updatedAbout)
  }, [updateSection])

  // Editorial Carousel
  const updateEditorialImage = useCallback((index, updatedImage) => {
    setData(prev => {
      const list = [...prev.editorialCarouselImages]
      list[index] = { ...list[index], ...updatedImage }
      const next = { ...prev, editorialCarouselImages: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Carousel slide updated!')
  }, [persistData, showToast])

  const addEditorialImage = useCallback((newImage) => {
    setData(prev => {
      const list = [{ ...newImage, id: `ec-${Date.now()}` }, ...prev.editorialCarouselImages]
      const next = { ...prev, editorialCarouselImages: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('New carousel slide added!')
  }, [persistData, showToast])

  const deleteEditorialImage = useCallback((index) => {
    setData(prev => {
      if (prev.editorialCarouselImages.length <= 1) {
        showToast('At least one carousel image must remain', 'error')
        return prev
      }
      const list = prev.editorialCarouselImages.filter((_, i) => i !== index)
      const next = { ...prev, editorialCarouselImages: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Carousel photo removed!')
  }, [persistData, showToast])

  // Services
  const updateService = useCallback((index, updatedService) => {
    setData(prev => {
      const list = [...prev.servicesData]
      list[index] = { ...list[index], ...updatedService }
      const next = { ...prev, servicesData: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Service details updated!')
  }, [persistData, showToast])

  const addService = useCallback((newService) => {
    setData(prev => {
      const nextNum = String(prev.servicesData.length + 1).padStart(2, '0')
      const defaultItem = {
        id: `srv-${Date.now()}`,
        number: nextNum,
        title: "NEW SERVICE DISCIPLINE",
        tagline: "Exclusive narrative coverage & fine art presentation",
        description: "Bespoke photography commissions tailored to client vision and editorial poise.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
        deliverables: [
          "Full Day Master Coverage",
          "Meticulously Hand-Retouched Gallery",
          "Archival Fine Art Print Box"
        ],
        ...newService
      }
      const list = [...prev.servicesData, defaultItem]
      const next = { ...prev, servicesData: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('New service package added!')
  }, [persistData, showToast])

  const deleteService = useCallback((index) => {
    setData(prev => {
      if (prev.servicesData.length <= 1) {
        showToast('At least one service offering must remain', 'error')
        return prev
      }
      const list = prev.servicesData.filter((_, i) => i !== index)
      const next = { ...prev, servicesData: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Service package removed!')
  }, [persistData, showToast])

  // Portfolio
  const updatePortfolioItem = useCallback((index, updatedItem) => {
    setData(prev => {
      const list = [...prev.portfolioItems]
      list[index] = { ...list[index], ...updatedItem }
      const next = { ...prev, portfolioItems: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Portfolio item updated!')
  }, [persistData, showToast])

  const addPortfolioItem = useCallback((newItem) => {
    setData(prev => {
      const list = [{ ...newItem, id: `port-${Date.now()}` }, ...prev.portfolioItems]
      const next = { ...prev, portfolioItems: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('New portfolio item added!')
  }, [persistData, showToast])

  const deletePortfolioItem = useCallback((index) => {
    setData(prev => {
      const list = prev.portfolioItems.filter((_, i) => i !== index)
      const next = { ...prev, portfolioItems: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Portfolio item deleted!')
  }, [persistData, showToast])

  // Story Scroll (Philosophy)
  const updateStoryScrollStep = useCallback((index, updatedStep) => {
    setData(prev => {
      const list = [...prev.storyScrollSteps]
      list[index] = { ...list[index], ...updatedStep }
      const next = { ...prev, storyScrollSteps: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Philosophy step updated!')
  }, [persistData, showToast])

  const addStoryScrollStep = useCallback((newStep) => {
    setData(prev => {
      const nextStage = String(prev.storyScrollSteps.length + 1).padStart(2, '0')
      const defaultStep = {
        stage: nextStage,
        category: `${nextStage} / Poetic Expression`,
        keyword: "HARMONY",
        quote: "Transcending ordinary frames into eternal visual heirlooms that echo through time.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85",
        alt: "Fine art editorial photography",
        ...newStep
      }
      const list = [...prev.storyScrollSteps, defaultStep]
      const next = { ...prev, storyScrollSteps: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('New philosophy pillar added!')
  }, [persistData, showToast])

  const deleteStoryScrollStep = useCallback((index) => {
    setData(prev => {
      if (prev.storyScrollSteps.length <= 1) {
        showToast('At least one philosophy step must remain', 'error')
        return prev
      }
      const list = prev.storyScrollSteps.filter((_, i) => i !== index)
      const next = { ...prev, storyScrollSteps: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Philosophy step removed!')
  }, [persistData, showToast])

  // Process
  const updateProcessStep = useCallback((index, updatedStep) => {
    setData(prev => {
      const list = [...prev.processSteps]
      list[index] = { ...list[index], ...updatedStep }
      const next = { ...prev, processSteps: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Process step updated!')
  }, [persistData, showToast])

  // Visual Statement
  const updateVisualStatement = useCallback((updatedStatement) => {
    updateSection('visualStatementData', updatedStatement)
  }, [updateSection])

  // Testimonials
  const updateTestimonial = useCallback((index, updatedTestimonial) => {
    setData(prev => {
      const list = [...prev.testimonialsData]
      list[index] = { ...list[index], ...updatedTestimonial }
      const next = { ...prev, testimonialsData: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Testimonial updated!')
  }, [persistData, showToast])

  const addTestimonial = useCallback((newTestimonial) => {
    setData(prev => {
      const list = [{ ...newTestimonial, id: `test-${Date.now()}` }, ...prev.testimonialsData]
      const next = { ...prev, testimonialsData: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('New testimonial added!')
  }, [persistData, showToast])

  const deleteTestimonial = useCallback((index) => {
    setData(prev => {
      const list = prev.testimonialsData.filter((_, i) => i !== index)
      const next = { ...prev, testimonialsData: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Testimonial removed!')
  }, [persistData, showToast])

  // Social Posts
  const updateSocialPost = useCallback((index, updatedPost) => {
    setData(prev => {
      const list = [...prev.socialPosts]
      list[index] = { ...list[index], ...updatedPost }
      const next = { ...prev, socialPosts: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Social feed item updated!')
  }, [persistData, showToast])

  const addSocialPost = useCallback((newPost) => {
    setData(prev => {
      const list = [{ ...newPost, id: `soc-${Date.now()}` }, ...prev.socialPosts]
      const next = { ...prev, socialPosts: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('New social photo added!')
  }, [persistData, showToast])

  const deleteSocialPost = useCallback((index) => {
    setData(prev => {
      const list = prev.socialPosts.filter((_, i) => i !== index)
      const next = { ...prev, socialPosts: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Social photo removed!')
  }, [persistData, showToast])

  // FAQs
  const updateFAQ = useCallback((index, updatedFAQ) => {
    setData(prev => {
      const list = [...prev.faqItems]
      list[index] = { ...list[index], ...updatedFAQ }
      const next = { ...prev, faqItems: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('FAQ updated!')
  }, [persistData, showToast])

  const addFAQ = useCallback((newFAQ) => {
    setData(prev => {
      const numStr = String(prev.faqItems.length + 1).padStart(2, '0')
      const list = [...prev.faqItems, { ...newFAQ, id: `faq-${Date.now()}`, num: numStr }]
      const next = { ...prev, faqItems: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('New FAQ added!')
  }, [persistData, showToast])

  const deleteFAQ = useCallback((index) => {
    setData(prev => {
      const list = prev.faqItems.filter((_, i) => i !== index)
      const next = { ...prev, faqItems: list, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('FAQ removed!')
  }, [persistData, showToast])

  // Final CTA & Footer
  const updateFinalCTA = useCallback((updatedCTA) => {
    updateSection('finalCTAData', updatedCTA)
  }, [updateSection])

  const updateFooter = useCallback((updatedFooter) => {
    updateSection('footerData', updatedFooter)
  }, [updateSection])

  // Master Album Categories
  const updateCategory = useCallback((catIndex, updatedCat) => {
    setData(prev => {
      const cats = [...prev.galleryCategories]
      cats[catIndex] = { ...cats[catIndex], ...updatedCat }
      const next = { ...prev, galleryCategories: cats, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Category updated!')
  }, [persistData, showToast])

  const addGalleryImageToCategory = useCallback((catIndex, newImg) => {
    setData(prev => {
      const cats = [...prev.galleryCategories]
      const currentCat = cats[catIndex]
      const galleryImages = [
        { id: `cat-img-${Date.now()}`, ...newImg },
        ...(currentCat.galleryImages || [])
      ]
      cats[catIndex] = { ...currentCat, galleryImages }
      const next = { ...prev, galleryCategories: cats, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Photo added to category gallery!')
  }, [persistData, showToast])

  const deleteGalleryImageFromCategory = useCallback((catIndex, imgIndex) => {
    setData(prev => {
      const cats = [...prev.galleryCategories]
      const currentCat = cats[catIndex]
      const galleryImages = (currentCat.galleryImages || []).filter((_, i) => i !== imgIndex)
      cats[catIndex] = { ...currentCat, galleryImages }
      const next = { ...prev, galleryCategories: cats, lastUpdated: new Date().toISOString() }
      persistData(next)
      return next
    })
    showToast('Photo removed from category!')
  }, [persistData, showToast])

  // Backup & Restore
  const exportDataJSON = useCallback(() => {
    try {
      const jsonStr = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `zanstoryteller_backup_${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Website content backup exported!')
    } catch {
      showToast('Export failed', 'error')
    }
  }, [data, showToast])

  const importDataJSON = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString)
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON format')
      }
      persistData(parsed)
      showToast('Website content restored successfully!')
      return true
    } catch (e) {
      showToast(`Import error: ${e.message}`, 'error')
      return false
    }
  }, [persistData, showToast])

  const resetToFactoryDefaults = useCallback(() => {
    if (window.confirm("Are you sure you want to reset all content to the original defaults? All customized texts and uploaded images will be reset.")) {
      persistData(defaultCMSState)
      showToast('Reset to original website defaults!')
    }
  }, [persistData, showToast])

  return (
    <CMSContext.Provider
      value={{
        data,
        toastMessage,
        showToast,
        updateSection,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        updateAbout,
        updateEditorialImage,
        addEditorialImage,
        deleteEditorialImage,
        updateService,
        addService,
        deleteService,
        updatePortfolioItem,
        addPortfolioItem,
        deletePortfolioItem,
        updateStoryScrollStep,
        addStoryScrollStep,
        deleteStoryScrollStep,
        updateProcessStep,
        updateVisualStatement,
        updateTestimonial,
        addTestimonial,
        deleteTestimonial,
        updateSocialPost,
        addSocialPost,
        deleteSocialPost,
        updateFAQ,
        addFAQ,
        deleteFAQ,
        updateFinalCTA,
        updateFooter,
        updateCategory,
        addGalleryImageToCategory,
        deleteGalleryImageFromCategory,
        exportDataJSON,
        importDataJSON,
        resetToFactoryDefaults
      }}
    >
      {children}
    </CMSContext.Provider>
  )
}

export function useCMS() {
  const context = useContext(CMSContext)
  if (!context) {
    // Graceful fallback for components rendered outside CMSProvider
    return {
      data: defaultCMSState,
      showToast: () => {},
      updateSection: () => {},
      updateHeroSlide: () => {},
      addHeroSlide: () => {},
      deleteHeroSlide: () => {},
      updateAbout: () => {},
      updateEditorialImage: () => {},
      addEditorialImage: () => {},
      deleteEditorialImage: () => {},
      updateService: () => {},
      addService: () => {},
      deleteService: () => {},
      updatePortfolioItem: () => {},
      addPortfolioItem: () => {},
      deletePortfolioItem: () => {},
      updateStoryScrollStep: () => {},
      addStoryScrollStep: () => {},
      deleteStoryScrollStep: () => {},
      updateProcessStep: () => {},
      updateVisualStatement: () => {},
      updateTestimonial: () => {},
      addTestimonial: () => {},
      deleteTestimonial: () => {},
      updateSocialPost: () => {},
      addSocialPost: () => {},
      deleteSocialPost: () => {},
      updateFAQ: () => {},
      addFAQ: () => {},
      deleteFAQ: () => {},
      updateFinalCTA: () => {},
      updateFooter: () => {},
      updateCategory: () => {},
      addGalleryImageToCategory: () => {},
      deleteGalleryImageFromCategory: () => {},
      exportDataJSON: () => {},
      importDataJSON: () => {},
      resetToFactoryDefaults: () => {}
    }
  }
  return context
}
