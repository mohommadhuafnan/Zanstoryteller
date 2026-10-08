import { supabase } from './supabase.js'

async function seedAll() {
  const sections = {
    portfolioCategories: ['ALL', 'WEDDINGS', 'PORTRAITS', 'EVENTS', 'COMMERCIAL'],
    portfolioItems: [
      { id: 'port-1', title: 'Serenade in Kandy', category: 'WEDDINGS', location: 'Kandy, Sri Lanka', year: '2025', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', targetUrl: '/gallery/wedding', colSpan: 'col-span-12 sm:col-span-6 md:col-span-7', alt: 'Traditional wedding couple portrait in historic setting' },
      { id: 'port-2', title: "The Sculptor's Hands", category: 'PORTRAITS', location: 'Colombo Studio', year: '2025', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85', targetUrl: '/gallery/workshop-photography', colSpan: 'col-span-12 sm:col-span-6 md:col-span-5', alt: 'Artistic black and white portrait of craftsman' },
      { id: 'port-3', title: 'Nocturne Gala', category: 'EVENTS', location: 'Galle Fort', year: '2024', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85', targetUrl: '/gallery/night-life', colSpan: 'col-span-12 md:col-span-8', alt: 'Candid twilight celebration overlooking the ocean' },
      { id: 'port-4', title: 'Aura Minimalist Living', category: 'COMMERCIAL', location: 'Tangalle Villa', year: '2025', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85', targetUrl: '/gallery/architecture', colSpan: 'col-span-12 md:col-span-4', alt: 'Architectural and spatial interior photography' },
      { id: 'port-5', title: 'Whispers of Dawn', category: 'WEDDINGS', location: 'Nuwara Eliya Hills', year: '2024', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', targetUrl: '/gallery/wedding', colSpan: 'col-span-12 sm:col-span-6 md:col-span-5', alt: 'Bride and groom embracing in morning mist' },
      { id: 'port-6', title: 'Gaze of Solitude', category: 'PORTRAITS', location: 'Negombo Coastline', year: '2025', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85', targetUrl: '/gallery/model-shoot', colSpan: 'col-span-12 sm:col-span-6 md:col-span-7', alt: 'Striking natural light portrait by the sea' }
    ],
    storyScrollSteps: [
      { stage: '01', category: '01 / Atmospheric Element', keyword: 'LIGHT', quote: 'We seek the golden radiance that turns fleeting moments into cinematic memories.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85', alt: 'Cinematic golden hour sunlight framing emotional celebration' },
      { stage: '02', category: '02 / The Core', keyword: 'EMOTION', quote: 'The photographs that outlive generations are the ones where authentic souls are unveiled.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=85', alt: 'Heartfelt candid tears and genuine emotional connection' },
      { stage: '03', category: '03 / Nuance & Craft', keyword: 'DETAIL', quote: 'From delicate fabrics and heirloom rings to subtle glances, every micro-detail completes the story.', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1920&q=85', alt: 'Intricate fine textures, jewelry, and delicate artisanal details' },
      { stage: '04', category: '04 / Archival Heritage', keyword: 'TIMELESS', quote: 'Crafting visual heirlooms that never age, preserving the timeless poetry of who you are.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=85', alt: 'Masterpiece fine-art portraiture with enduring cinematic elegance' },
      { stage: '05', category: '05 / Monumental Grandeur', keyword: 'HERITAGE', quote: 'Monumental ballroom gatherings and palatial celebrations immortalized with archival prestige.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85', alt: 'Monumental architectural grandeur and regal wedding celebration' }
    ],
    processSteps: [
      { number: '01', title: 'CONNECT', description: 'We start by understanding your story, your vision and what matters most to you. Through an intentional conversation, we align on tone, expectations, and unique nuances.', tag: 'First Encounter' },
      { number: '02', title: 'PLAN', description: 'Together we create a photography experience that feels natural and personal. From lighting schedules to location scouting, every logistical facet is thoughtfully mapped.', tag: 'Preparation' },
      { number: '03', title: 'CAPTURE', description: 'We focus on genuine moments, real emotions and beautiful details. On the day, we blend seamless presence with quiet discretion so you can stay fully present.', tag: 'Execution' },
      { number: '04', title: 'REMEMBER', description: 'Your photographs become memories you can return to for years to come. Handcrafted archival albums, heirloom prints, and master digital galleries that withstand time.', tag: 'Legacy' }
    ],
    testimonialsData: [
      { id: 'test-1', quote: 'Every photograph felt natural, emotional and completely us. Looking through our wedding album still brings tears to our eyes because Zan captured what words never could.', author: 'Elena & David', role: 'Destination Wedding, Galle', date: 'November 2024' },
      { id: 'test-2', quote: "The patience and visual sensitivity Zan brings to a shoot is unmatched. He didn't just photograph my brand; he understood the underlying philosophy and made it visible.", author: 'Kavinda Fernando', role: 'Founder, Ceylon Minimalist Architecture', date: 'January 2025' },
      { id: 'test-3', quote: 'We hate posing for cameras, but with Zan Storyteller, we didn\'t pose at all. He observed, guided gently, and caught laughter and moments we didn\'t even notice happening.', author: 'Samantha & Ruwan', role: 'Intimate Anniversary Celebration', date: 'October 2024' }
    ],
    socialPosts: [
      { id: 'soc-1', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', caption: 'The quiet hush before the aisle walk.', likes: '428' },
      { id: 'soc-2', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80', caption: 'Behind the viewfinder: Canon 35mm primes.', likes: '612' },
      { id: 'soc-3', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', caption: 'Fine art portraiture session in Colombo.', likes: '891' }
    ]
  }

  for (const [key, data] of Object.entries(sections)) {
    const { error } = await supabase.from('site_content').upsert({ key, data, updated_at: new Date().toISOString() })
    if (error) console.error('Error seeding', key, error.message)
    else console.log('✅ Seeded key in site_content:', key)
  }
}

seedAll()
