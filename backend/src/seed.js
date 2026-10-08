import { supabase } from './supabase.js'

async function seedDatabase() {
  console.log('🌱 Seeding Supabase database with all website content and structure...')

  const aboutData = {
    label: "ABOUT ZAN STORYTELLER",
    heading: "WE DON'T JUST\nCAPTURE MOMENTS.\nWE TELL STORIES.",
    paragraphs: [
      "Every photograph holds a moment, an emotion and a story waiting to be remembered.",
      "At Zan Storyteller, we focus on capturing genuine moments with creativity, patience and an eye for detail. From intimate celebrations to unforgettable milestones, our goal is to create photographs that feel as meaningful years from now as they did in the moment."
    ],
    ctaText: "DISCOVER OUR STORY",
    image: "/about/zan_portrait.webp",
    imageAlt: "Mohammad Zan - Founder & Cinematographer of Zan Storyteller",
    badge: "EST. 2020 • CEYLON & WORLDWIDE"
  }

  const servicesData = [
    {
      id: "weddings",
      number: "01",
      title: "WEDDINGS",
      tagline: "Preserving every fleeting chapter of your commitment.",
      description: "From quiet morning preparations to heartfelt vows and joyous celebrations under starlight, we unobtrusively preserve the emotion, tears, and spontaneous laughter of your wedding day.",
      deliverables: ["Full Day Narrative Coverage", "High-Resolution Curation", "Handcrafted Fine Art Album", "Private Online Gallery"],
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
      alt: "Intimate and emotional wedding celebration captured by Zan Storyteller"
    },
    {
      id: "portraits",
      number: "02",
      title: "PORTRAITS",
      tagline: "Natural, expressive imagery revealing the genuine soul.",
      description: "Whether editorial portraits, artist profiles, or personal branding, our sessions celebrate authenticity. We guide lighting and mood while allowing your true personality to shine through naturally.",
      deliverables: ["Studio & Location Shoots", "Wardrobe & Mood Styling Consultation", "High-End Retouching", "Print Ready Formats"],
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
      alt: "Cinematic expressive fine art portrait photography"
    },
    {
      id: "commercial",
      number: "03",
      title: "COMMERCIAL & EDITORIAL",
      tagline: "Compelling visual narratives that elevate brand prestige.",
      description: "We collaborate with discerning fashion houses, luxury architects, and boutique brands to engineer visually striking campaigns that resonate deeply with high-end audiences.",
      deliverables: ["Creative Direction & Concept", "Multi-Platform Licensing", "Color Grade Mastery", "Commercial Deliverables"],
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85",
      alt: "High-end commercial and brand editorial photography"
    },
    {
      id: "maternity",
      number: "04",
      title: "MATERNITY & FAMILY",
      tagline: "Honoring life's most miraculous transformations.",
      description: "A tender, timeless celebration of growing families. We create an intimate, relaxed sanctuary where pure emotion and natural beauty unfold effortlessly.",
      deliverables: ["Gentle 90-Min Sessions", "Heirloom Print Enclosure", "Digital Master Files", "Fine Art Mats"],
      image: "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=85",
      alt: "Timeless and gentle maternity documentation"
    }
  ]

  const heroSlides = [
    {
      id: "slide-1",
      title: "The Grand Promenade",
      subtitle: "Archival Celebrations",
      tagline: "Timeless architectural grandeur documented through monumental scale and archival 35mm lenses.",
      year: "2025",
      category: "WEDDING ARCHIVE",
      location: "Doha // Archival",
      image: "/src/assets/scrolling/scroll_01.webp"
    },
    {
      id: "slide-2",
      title: "Golden Horizon",
      subtitle: "Editorial Campaign",
      tagline: "Warm coastal light capturing authentic intimacy, quiet poetry, and effortless elegance.",
      year: "2024",
      category: "EDITORIAL CAMPAIGN",
      location: "Coastal Light // 35mm",
      image: "/src/assets/scrolling/scroll_02.webp"
    },
    {
      id: "slide-3",
      title: "Silent Devotion",
      subtitle: "Candid Documentaries",
      tagline: "Unstaged moments suspended in amber—capturing sacred emotion as it naturally unfolds.",
      year: "2025",
      category: "DOCUMENTARY",
      location: "Private Estate // Evening",
      image: "/src/assets/scrolling/scroll_03.webp"
    },
    {
      id: "slide-4",
      title: "High Couture",
      subtitle: "Haute Horlogerie & Fashion",
      tagline: "Sartorial precision rendered in stark chiaroscuro, cinematic shadows, and radiant highlights.",
      year: "2024",
      category: "COMMERCIAL COUTURE",
      location: "Milan & Paris // Studio",
      image: "/src/assets/scrolling/scroll_04.webp"
    },
    {
      id: "slide-5",
      title: "Ephemeral Grace",
      subtitle: "Fine Art Portraiture",
      tagline: "Monochrome elegance reflecting raw vulnerability, refined character, and timeless prestige.",
      year: "2025",
      category: "FINE ART PORTRAIT",
      location: "Archival Monolith // Ceylon",
      image: "/src/assets/scrolling/scroll_05.webp"
    }
  ]

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
      answer: "Yes, without hesitation. We are based in Sri Lanka and frequently travel across the entire island (Galle Fort, Kandy Hills, Bentota, Nuwara Eliya, Tangalle) as well as destinations worldwide across the Middle East, Asia, and Europe."
    },
    {
      id: "faq-3",
      num: "03",
      category: "CREATIVE APPROACH",
      question: "How would you describe your photographic style?",
      answer: "Our visual language is a fusion of cinematic documentary storytelling and modern fine-art editorial. We prioritize authentic emotion, natural light, and quiet candid moments over stiff, forced poses."
    },
    {
      id: "faq-4",
      num: "04",
      category: "DELIVERY & ALBUMS",
      question: "How many images do we receive, and when is the gallery delivered?",
      answer: "For full-day weddings, you typically receive 500 to 800 meticulously hand-edited, high-resolution photographs. For portrait and studio sessions, between 40 and 80 curated frames. You'll receive a sneak-peek preview within 48 to 72 hours, with your private master gallery ready within 4 to 6 weeks."
    },
    {
      id: "faq-5",
      num: "05",
      category: "CUSTOMIZATION",
      question: "Can we customize coverage hours or add a second photographer?",
      answer: "Absolutely. No two stories are identical. During our initial consultation, we can tailor every facet of your coverage—including multi-day shoots, second lead cinematographers, drone aerial documentation, medium format film stills, and handcrafted linen albums."
    }
  ]

  const visualStatementData = {
    quote: "LIGHT PASSES. EMOTION REMAINS. WE CRAFT VISUAL HEIRLOOMS DESIGNED TO OUTLIVE TIME.",
    subtext: "CINEMATIC DOCUMENTATION & COUTURE EDITORIAL PHOTOGRAPHY",
    accent: "COLOMBO, SRI LANKA — DOHA, QATAR — WORLDWIDE"
  }

  const footerData = {
    brand: "ZAN STORYTELLER",
    tagline: "Cinematic Documentary & Fine Art Photography",
    contact: {
      email: "info@zanstoryteller.com",
      phone: "+974 6690 4220",
      location: "Colombo, Sri Lanka & Doha, Qatar"
    },
    socialLinks: {
      instagram: "https://instagram.com/zanstoryteller",
      facebook: "https://facebook.com/zanstoryteller",
      whatsapp: "https://wa.me/97466904220"
    }
  }

  const finalCTAData = {
    heading: "READY TO IMMORTALIZE YOUR STORY?",
    subheading: "LET US TURN YOUR MOST FLEETING MOMENTS INTO ARCHIVAL ART.",
    ctaButton: "RESERVE YOUR DATE",
    badge: "LIMITED COMMISSIONS AVAILABLE FOR 2025/2026"
  }

  const mediaLibrary = []

  const sectionsToSeed = [
    { key: 'aboutData', data: aboutData },
    { key: 'servicesData', data: servicesData },
    { key: 'heroSlides', data: heroSlides },
    { key: 'faqItems', data: faqItems },
    { key: 'visualStatementData', data: visualStatementData },
    { key: 'footerData', data: footerData },
    { key: 'finalCTAData', data: finalCTAData },
    { key: 'mediaLibrary', data: mediaLibrary },
    { key: 'cms_initialized', data: { initialized: true, at: new Date().toISOString() } }
  ]

  for (const item of sectionsToSeed) {
    const { error } = await supabase
      .from('site_content')
      .upsert({
        key: item.key,
        data: item.data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })

    if (error) {
      console.error(`❌ Failed to seed ${item.key}:`, error.message)
    } else {
      console.log(`✅ Saved section "${item.key}" to Supabase database!`)
    }
  }

  console.log('✨ All website data has been successfully saved into Supabase database!')
}

seedDatabase()
