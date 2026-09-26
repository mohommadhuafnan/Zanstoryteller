/**
 * Structured content data for Zanstoryteller photography portfolio.
 * Decoupled from presentation components for seamless future REST API / CMS integration.
 */

export const aboutData = {
  label: "ABOUT ZANSTORYTELLER",
  heading: "WE DON'T JUST\nCAPTURE MOMENTS.\nWE TELL STORIES.",
  paragraphs: [
    "Every photograph holds a moment, an emotion and a story waiting to be remembered.",
    "At Zanstoryteller, we focus on capturing genuine moments with creativity, patience and an eye for detail. From intimate celebrations to unforgettable milestones, our goal is to create photographs that feel as meaningful years from now as they did in the moment."
  ],
  ctaText: "DISCOVER OUR STORY",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
  imageAlt: "Zanstoryteller Editorial Portrait Photography",
  badge: "EST. 2020 • CEYLON & WORLDWIDE"
}

export const servicesData = [
  {
    id: "weddings",
    number: "01",
    title: "WEDDINGS",
    tagline: "Preserving every fleeting chapter of your commitment.",
    description: "From quiet morning preparations to heartfelt vows and joyous celebrations under starlight, we unobtrusively preserve the emotion, tears, and spontaneous laughter of your wedding day.",
    deliverables: ["Full Day Narrative Coverage", "High-Resolution Curation", "Handcrafted Fine Art Album", "Private Online Gallery"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
    alt: "Intimate and emotional wedding celebration captured by Zanstoryteller"
  },
  {
    id: "portraits",
    number: "02",
    title: "PORTRAITS",
    tagline: "Natural, expressive imagery revealing the genuine soul.",
    description: "Whether editorial portraits, artist profiles, or personal branding, our sessions celebrate authenticity. We guide lighting and mood while allowing your true personality to shine through naturally.",
    deliverables: ["Studio & Location Shoots", "Wardrobe & Mood Styling Consultation", "High-End Retouching", "Print Ready Formats"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=85",
    alt: "Cinematic expressive portrait photography"
  },
  {
    id: "events",
    number: "03",
    title: "EVENTS",
    tagline: "Capturing the electric energy of momentous occasions.",
    description: "From high-profile galas, cultural festivals, and private milestones to bespoke gatherings, we document the atmosphere, candid interactions, and signature highlights with documentary precision.",
    deliverables: ["Multi-angle Coverage", "Same-Day Preview Stills", "Commercial Licensing", "Archival Storage"],
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=85",
    alt: "Atmospheric and vibrant event documentation"
  },
  {
    id: "commercial",
    number: "04",
    title: "COMMERCIAL",
    tagline: "Visual storytelling tailored to elevate brands and architecture.",
    description: "We collaborate with design-forward brands, architects, luxury hospitality, and culinary artisans to create compelling visual narratives that communicate craftsmanship and elegance.",
    deliverables: ["Art Direction & Concepting", "Multi-platform Asset Packs", "Architectural Stills", "Full Commercial Rights"],
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=85",
    alt: "Refined commercial and editorial photography"
  }
]

export const portfolioCategories = ["ALL", "WEDDINGS", "PORTRAITS", "EVENTS", "COMMERCIAL"]

export const portfolioItems = [
  {
    id: "port-1",
    title: "Serenade in Kandy",
    category: "WEDDINGS",
    location: "Kandy, Sri Lanka",
    year: "2025",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
    aspect: "aspect-[4/5]",
    colSpan: "col-span-12 sm:col-span-6 md:col-span-7",
    alt: "Traditional wedding couple portrait in historic setting"
  },
  {
    id: "port-2",
    title: "The Sculptor's Hands",
    category: "PORTRAITS",
    location: "Colombo Studio",
    year: "2025",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85",
    aspect: "aspect-[3/4]",
    colSpan: "col-span-12 sm:col-span-6 md:col-span-5",
    alt: "Artistic black and white portrait of craftsman"
  },
  {
    id: "port-3",
    title: "Nocturne Gala",
    category: "EVENTS",
    location: "Galle Fort",
    year: "2024",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
    aspect: "aspect-[16/10]",
    colSpan: "col-span-12 md:col-span-8",
    alt: "Candid twilight celebration overlooking the ocean"
  },
  {
    id: "port-4",
    title: "Aura Minimalist Living",
    category: "COMMERCIAL",
    location: "Tangalle Villa",
    year: "2025",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    aspect: "aspect-[4/5]",
    colSpan: "col-span-12 md:col-span-4",
    alt: "Architectural and spatial interior photography"
  },
  {
    id: "port-5",
    title: "Whispers of Dawn",
    category: "WEDDINGS",
    location: "Nuwara Eliya Hills",
    year: "2024",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
    aspect: "aspect-[4/3]",
    colSpan: "col-span-12 sm:col-span-6 md:col-span-5",
    alt: "Bride and groom embracing in morning mist"
  },
  {
    id: "port-6",
    title: "Gaze of Solitude",
    category: "PORTRAITS",
    location: "Negombo Coastline",
    year: "2025",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85",
    aspect: "aspect-[16/11]",
    colSpan: "col-span-12 sm:col-span-6 md:col-span-7",
    alt: "Striking natural light portrait by the sea"
  }
]

export const storyScrollSteps = [
  {
    stage: "01",
    keyword: "LIGHT",
    quote: "We look for the light that makes an ordinary moment feel extraordinary.",
    image: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1600&q=85",
    alt: "Golden hour light cutting through mountain trees"
  },
  {
    stage: "02",
    keyword: "EMOTION",
    quote: "The photographs we remember are the ones that make us feel something.",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1600&q=85",
    alt: "Heartfelt candid tears and joy between loved ones"
  },
  {
    stage: "03",
    keyword: "DETAIL",
    quote: "From a quiet glance to the smallest detail, every part of the story matters.",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=85",
    alt: "Intricate lace fabric and heirloom wedding rings close-up"
  }
]

export const processSteps = [
  {
    number: "01",
    title: "CONNECT",
    description: "We start by understanding your story, your vision and what matters most to you. Through an intentional conversation, we align on tone, expectations, and unique nuances.",
    tag: "First Encounter"
  },
  {
    number: "02",
    title: "PLAN",
    description: "Together we create a photography experience that feels natural and personal. From lighting schedules to location scouting, every logistical facet is thoughtfully mapped.",
    tag: "Preparation"
  },
  {
    number: "03",
    title: "CAPTURE",
    description: "We focus on genuine moments, real emotions and beautiful details. On the day, we blend seamless presence with quiet discretion so you can stay fully present.",
    tag: "Execution"
  },
  {
    number: "04",
    title: "REMEMBER",
    description: "Your photographs become memories you can return to for years to come. Handcrafted archival albums, heirloom prints, and master digital galleries that withstand time.",
    tag: "Legacy"
  }
]

export const visualStatementData = {
  label: "ZANSTORYTELLER",
  heading: "YOUR MOMENTS\nDESERVE\nTO BE REMEMBERED.",
  subtext: "Photographs that endure when words fade.",
  image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=85",
  alt: "Expansive dramatic landscape evoking timeless human connection"
}

export const testimonialsData = [
  {
    id: "test-1",
    quote: "Every photograph felt natural, emotional and completely us. Looking through our wedding album still brings tears to our eyes because Zan captured what words never could.",
    author: "Elena & David",
    role: "Destination Wedding, Galle",
    date: "November 2024"
  },
  {
    id: "test-2",
    quote: "The patience and visual sensitivity Zan brings to a shoot is unmatched. He didn't just photograph my brand; he understood the underlying philosophy and made it visible.",
    author: "Kavinda Fernando",
    role: "Founder, Ceylon Minimalist Architecture",
    date: "January 2025"
  },
  {
    id: "test-3",
    quote: "We hate posing for cameras, but with Zanstoryteller, we didn't pose at all. He observed, guided gently, and caught laughter and moments we didn't even notice happening.",
    author: "Samantha & Ruwan",
    role: "Intimate Anniversary Celebration",
    date: "October 2024"
  }
]

export const socialPosts = [
  {
    id: "soc-1",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    caption: "The quiet hush before the aisle walk.",
    likes: "428"
  },
  {
    id: "soc-2",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    caption: "Behind the viewfinder: Canon 35mm primes.",
    likes: "612"
  },
  {
    id: "soc-3",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    caption: "Direct sunlight, honest expression.",
    likes: "891"
  },
  {
    id: "soc-4",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    caption: "Heirloom gold and antique silks.",
    likes: "354"
  },
  {
    id: "soc-5",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    caption: "Monochrome character study.",
    likes: "740"
  },
  {
    id: "soc-6",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    caption: "Evening light along the central highlands.",
    likes: "983"
  }
]

export const finalCTAData = {
  label: "LET'S CREATE TOGETHER",
  heading: "READY TO\nTELL YOUR STORY?",
  supporting: "Let's create photographs that you will want to remember forever. We are currently booking for 2025 and 2026 worldwide.",
  primaryCTA: "EXPLORE OUR WORK",
  secondaryCTA: "GET IN TOUCH",
  bgImage: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=85"
}

export const footerData = {
  brand: "ZANSTORYTELLER",
  tagline: "Photography that turns real moments into lasting stories.",
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Contact", href: "#contact" }
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "WhatsApp", href: "https://whatsapp.com" }
  ],
  contact: {
    email: "hello@zanstoryteller.com",
    phone: "+94 77 123 4567",
    location: "Colombo • Available Worldwide"
  },
  copyright: "© 2026 Zanstoryteller. All rights reserved.",
  developer: "Designed & developed by WebCoder"
}

export const editorialCarouselImages = [
  {
    id: "ec-1",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    alt: "Bride and groom with bridal bouquet in warm sun flare",
    title: "Golden Hour Vows",
    subtitle: "Ceremony & Devotion"
  },
  {
    id: "ec-2",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85",
    alt: "Wedding gown hanging from tree branch in open meadow",
    title: "Heirloom Gown",
    subtitle: "Fine Art Details"
  },
  {
    id: "ec-3",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=85",
    alt: "Friends and loved ones celebrating at golden sunset",
    title: "Playful Souls",
    subtitle: "Candid Expressions"
  },
  {
    id: "ec-4",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
    alt: "Ceremony portrait and intimate moments",
    title: "Serenade in Kandy",
    subtitle: "Heritage Vows"
  },
  {
    id: "ec-5",
    // Wide landscape photo - naturally adapts width without cropping
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    alt: "Woman in white walking along golden ocean beach waves",
    title: "Coastline Serenity",
    subtitle: "Landscape Narrative"
  },
  {
    id: "ec-6",
    image: "https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1200&q=85",
    alt: "Bride and groom dancing amidst lush tropical greenery",
    title: "Garden Symphony",
    subtitle: "Ceylon Nature"
  },
  {
    id: "ec-7",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85",
    alt: "Intimate morning moments of couple embracing",
    title: "Morning Light",
    subtitle: "Intimate Portrait"
  },
  {
    id: "ec-8",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85",
    alt: "Sparkling bridal high heels and heirloom details",
    title: "Heirloom Accents",
    subtitle: "Archival Details"
  }
]
