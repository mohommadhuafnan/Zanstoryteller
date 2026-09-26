const fs = require('fs');
const path = require('path');

// Image pools by aesthetic theme
const photoPools = {
  maternity: [
    "https://images.unsplash.com/photo-1544126592-807ade215a03?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85"
  ],
  model: [
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85"
  ],
  music: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=85"
  ],
  dhl: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=85"
  ],
  gym: [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85"
  ],
  nightlife: [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85"
  ],
  saloon: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85"
  ],
  abaya: [
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85"
  ],
  workshop: [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=85"
  ],
  wedding: [
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=85"
  ],
  katara: [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85"
  ],
  fitness: [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85"
  ],
  architecture: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85"
  ]
};

// Rotate an array by offset
function rotateArray(arr, offset) {
  const o = offset % arr.length;
  return [...arr.slice(o), ...arr.slice(0, o)];
}

const categoriesConfig = [
  {
    id: "maternity-photography",
    slug: "maternity-photography",
    title: "MATERNITY PHOTOGRAPHY",
    tagline: "Celebrating the miraculous beginning of life with tender grace.",
    description: "I take it a part of my life to document the precious moments in people's lives. Maternity photography captures the quiet anticipation, sacred glow, and gentle embrace of new life waiting to enter the world.",
    coverImage: photoPools.maternity[0],
    pool: photoPools.maternity,
    albums: [
      { name: "AMARA", title: "Golden Glow of Motherhood", date: "February 2025", location: "Bentota Sanctuary, Sri Lanka", aspect: "portrait" },
      { name: "SERENA", title: "Whispers of Arrival", date: "December 2024", location: "Kandy Hills Studio", aspect: "landscape" },
      { name: "MAYA", title: "Gentle Embrace & Morning Light", date: "November 2024", location: "Colombo Private Garden", aspect: "portrait" },
      { name: "NILUKA", title: "Sacred Waiting by the Sea", date: "October 2024", location: "Negombo Coastline", aspect: "landscape" },
      { name: "TARA", title: "The Serenade of New Life", date: "January 2025", location: "Nuwara Eliya Highlands", aspect: "portrait" },
      { name: "HASINI", title: "Botanical Solitude & Grace", date: "December 2024", location: "Peradeniya Royal Sanctuary", aspect: "landscape" },
      { name: "LEILA", title: "Desert Dawn & Sacred Glow", date: "November 2024", location: "Doha Dune Retreat", aspect: "portrait" },
      { name: "RUWANI", title: "Heirloom Promise in Bloom", date: "October 2024", location: "Galle Fort Terrace", aspect: "landscape" }
    ]
  },
  {
    id: "maternity-photoshoot",
    slug: "maternity-photoshoot",
    title: "MATERNITY PHOTOSHOOT",
    tagline: "Intimate and poetic studio portraits honoring expecting parents.",
    description: "Every curve and emotion tells a profound story of devotion. Our maternity sessions blend high-fashion lighting with unfiltered tenderness.",
    coverImage: photoPools.maternity[2],
    pool: photoPools.maternity,
    albums: [
      { name: "MAYA", title: "Sacred Bloom & Studio Light", date: "January 2025", location: "Colombo Minimalist Studio", aspect: "portrait" },
      { name: "ANANYA", title: "Chiaroscuro Silhouette Poetry", date: "February 2025", location: "Kandy White Studio", aspect: "landscape" },
      { name: "CHLOE", title: "Pure Silk & Soft Radiance", date: "December 2024", location: "Mirissa Ocean Loft", aspect: "portrait" },
      { name: "PRIYANKA", title: "Morning Sun & Quiet Devotion", date: "November 2024", location: "Bentota Estate", aspect: "landscape" },
      { name: "SHANI", title: "High-Fashion Maternal Grace", date: "October 2024", location: "Colombo Atelier", aspect: "portrait" },
      { name: "KAVINDI", title: "Tender Reflections & Velvet Stills", date: "January 2025", location: "Galle Boutique Suite", aspect: "landscape" },
      { name: "DILHANI", title: "Natural Glow & Earth Tones", date: "December 2024", location: "Tangalle Coastline", aspect: "portrait" },
      { name: "ISABELLA", title: "Timeless Motherhood Portraits", date: "November 2024", location: "Mount Lavinia Verandah", aspect: "landscape" }
    ]
  },
  {
    id: "model-shoot",
    slug: "model-shoot",
    title: "MODEL SHOOT",
    tagline: "High-editorial agency and fashion model portfolios.",
    description: "I take it a part of my life to document the precious moments in people's lives. As a portrait photographer in Sri Lanka who has captured many moments, I find it quite fascinating how each person express their emotion in their own unique way. Through portrait photography in Sri Lanka, I capture emotions and moments that go unseen and express them as bigger moments in an artistic array.",
    coverImage: photoPools.model[1],
    pool: photoPools.model,
    albums: [
      { name: "KELLY", title: "Sunlit Coastal Breeze", date: "March 2025", location: "Mirissa Beach, Sri Lanka", aspect: "portrait" },
      { name: "TAMMY", title: "Urban Street Haute Couture", date: "February 2025", location: "Colombo Port City", aspect: "landscape" },
      { name: "MAASHI", title: "Nocturne Velvet Glamour", date: "January 2025", location: "Galle Face Promenade", aspect: "portrait" },
      { name: "INAMI", title: "Pure Studio Emotion & Form", date: "December 2024", location: "Studio 84, Colombo", aspect: "landscape" },
      { name: "NADIA", title: "Golden Hour High-Fashion", date: "November 2024", location: "Kalpitiya Salt Flats", aspect: "portrait" },
      { name: "SASHA", title: "Monochrome Minimalist Study", date: "October 2024", location: "Colombo Art District", aspect: "landscape" },
      { name: "DINITHI", title: "Tropical Modernist Muse", date: "January 2025", location: "Bentota River Estate", aspect: "portrait" },
      { name: "CLARA", title: "High-Concept Editorial Series", date: "December 2024", location: "Doha Katara Pavilion", aspect: "landscape" }
    ]
  },
  {
    id: "music-video",
    slug: "music-video",
    title: "MUSIC VIDEO",
    tagline: "Dynamic visual storytelling, neon aesthetics, and cinematic stills.",
    description: "Capturing the raw energy, stage presence, and aesthetic precision of cutting-edge music artists and music video production sets.",
    coverImage: photoPools.music[0],
    pool: photoPools.music,
    albums: [
      { name: "THE SYNTH COLLECTIVE", title: "Midnight Echoes Single Shoot", date: "February 2025", location: "Warehouse 44, Colombo", aspect: "landscape" },
      { name: "LUNAR BEATS", title: "Laser Prism Live Sessions", date: "January 2025", location: "Underground Neon Stage", aspect: "portrait" },
      { name: "ECHO PULSE", title: "Electric Horizon Tour Stills", date: "December 2024", location: "Viharamahadevi Amphitheatre", aspect: "landscape" },
      { name: "VELVET HORIZON", title: "Retro Tape & Chiaroscuro Vibe", date: "November 2024", location: "Negombo Abandoned Hangar", aspect: "portrait" },
      { name: "NEON WAVE", title: "Synthwave After-Hours Shoot", date: "October 2024", location: "Colombo Port City Strip", aspect: "landscape" },
      { name: "SOLAR SOUNDS", title: "Acoustic Sunset Serenade", date: "February 2025", location: "Galle Lighthouse Rocks", aspect: "portrait" },
      { name: "MIDNIGHT REVERB", title: "Sub-Bass Distortion Stills", date: "January 2025", location: "Kandy Mountain Soundroom", aspect: "landscape" },
      { name: "BASSLINE SESSIONS", title: "Behind The Mixing Board", date: "December 2024", location: "SoundGate Studios", aspect: "portrait" }
    ]
  },
  {
    id: "dhl",
    slug: "dhl",
    title: "DHL",
    tagline: "Global logistics, human dedication, and corporate dynamism.",
    description: "Documenting the relentless rhythm, precision logistics, and dedicated personnel driving world-class global supply chains.",
    coverImage: photoPools.dhl[0],
    pool: photoPools.dhl,
    albums: [
      { name: "DHL LOGISTICS", title: "Connecting The Globe Campaign", date: "November 2024", location: "Colombo International Airport Hub", aspect: "landscape" },
      { name: "DHL EXPRESS GLOBAL", title: "Speed & Reliability Stills", date: "January 2025", location: "Katunayake Air Cargo Gateway", aspect: "portrait" },
      { name: "DHL SUPPLY CHAIN", title: "Precision Automated Warehouses", date: "December 2024", location: "Biyagama Logistics Park", aspect: "landscape" },
      { name: "DHL AVIATION HUB", title: "Wings of Global Commerce", date: "October 2024", location: "Doha International Cargo Ramp", aspect: "portrait" },
      { name: "DHL FLEET FORWARD", title: "Eco-Fleet City Dispatch", date: "February 2025", location: "Colombo Commercial Corridor", aspect: "landscape" },
      { name: "DHL COLD CHAIN", title: "Pharmaceutical Cold Chain Transit", date: "November 2024", location: "Specialized Life Sciences Terminal", aspect: "portrait" },
      { name: "DHL OCEAN FREIGHT", title: "Deep Sea Container Operations", date: "January 2025", location: "Port of Colombo South Terminal", aspect: "landscape" },
      { name: "DHL TERMINAL SOUTH", title: "The Faces Behind Every Parcel", date: "December 2024", location: "Galle Regional Sorting Facility", aspect: "portrait" }
    ]
  },
  {
    id: "gym",
    slug: "gym",
    title: "GYM",
    tagline: "Raw power, discipline, and high-intensity athletic focus.",
    description: "Capturing muscle, determination, and intense training sessions with moody, high-contrast chiaroscuro lighting.",
    coverImage: photoPools.gym[0],
    pool: photoPools.gym,
    albums: [
      { name: "APEX ATHLETICS", title: "Forged in Sweat Campaign", date: "January 2025", location: "Apex High Performance Gym", aspect: "portrait" },
      { name: "TITAN CLUB", title: "Heavy Iron & Barbell Precision", date: "February 2025", location: "Titan Strength Facility", aspect: "landscape" },
      { name: "IRON TEMPLE", title: "Deadlift Grit & Chalk Dust", date: "December 2024", location: "Old Town Powerhouse", aspect: "portrait" },
      { name: "BARBELL & CO", title: "Conditioning & Endurance Series", date: "November 2024", location: "CrossTraining Colombo", aspect: "landscape" },
      { name: "PULSE FITNESS", title: "Speed, Agility & Plyometrics", date: "October 2024", location: "Pulse Arena Sri Lanka", aspect: "portrait" },
      { name: "POWERHOUSE GYM", title: "Old School Bodybuilding Stills", date: "February 2025", location: "Powerhouse Galle", aspect: "landscape" },
      { name: "ELEVATE STRENGTH", title: "Kettlebell Movement Masterclass", date: "January 2025", location: "Kandy Functional Lab", aspect: "portrait" },
      { name: "FORGE PERFORMANCE", title: "Mindset & Athletic Transformation", date: "December 2024", location: "Forge Athletic Hub", aspect: "landscape" }
    ]
  },
  {
    id: "night-life",
    slug: "night-life",
    title: "NIGHT LIFE",
    tagline: "Vibrant nocturnal energy, rooftop galas, and underground soundscapes.",
    description: "Atmospheric twilight and midnight documentation preserving the electric pulse of premier nightlife and celebrations.",
    coverImage: photoPools.nightlife[0],
    pool: photoPools.nightlife,
    albums: [
      { name: "LUNA ROOFTOP", title: "Galle Fort Sunset Sessions", date: "December 2024", location: "Galle Fort Ramparts", aspect: "landscape" },
      { name: "VELVET LOUNGE", title: "Midnight Cocktails & Velvet Beats", date: "January 2025", location: "Colombo 07 Lounge", aspect: "portrait" },
      { name: "NEON NOCTURNE", title: "Underground Electric Echoes", date: "February 2025", location: "SubLevel Warehouse Club", aspect: "landscape" },
      { name: "ECLIPSE CLUB", title: "Starlight Dance & Laser Waves", date: "November 2024", location: "Mount Lavinia Terrace", aspect: "portrait" },
      { name: "SKYLINE GALAS", title: "High Society Evening Soiree", date: "October 2024", location: "Shangri-La Horizon Lawn", aspect: "landscape" },
      { name: "AMBER BAR", title: "Whiskey Stills & Jazz Acoustics", date: "January 2025", location: "Heritage Cellar Lounge", aspect: "portrait" },
      { name: "OASIS NIGHTS", title: "Tropical Beachside Bonfire Party", date: "December 2024", location: "Hikkaduwa Sandy Shore", aspect: "landscape" },
      { name: "HIGH TIDE AFTERHOURS", title: "Dawn Horizon Deep House Session", date: "November 2024", location: "Ahangama Reef Deck", aspect: "portrait" }
    ]
  },
  {
    id: "saloon-shoot",
    slug: "saloon-shoot",
    title: "SALOON SHOOT",
    tagline: "Elegance, transformation, and bespoke hair & aesthetic artistry.",
    description: "Detailed editorial styling captures illustrating precision shears, color alchemy, and luxury beauty salon experiences.",
    coverImage: photoPools.saloon[0],
    pool: photoPools.saloon,
    albums: [
      { name: "MAISON LUXE SALON", title: "Haute Coiffure Campaign", date: "January 2025", location: "Colombo 07", aspect: "portrait" },
      { name: "ATELIER BEAUTE", title: "Color Alchemy & Platinum Waves", date: "February 2025", location: "Kandy City Studio", aspect: "landscape" },
      { name: "THE BARBER ROOM", title: "Gentlemen's Heritage Razor Stills", date: "December 2024", location: "Galle Fort Barber Lounge", aspect: "portrait" },
      { name: "AURA HAIR STUDIO", title: "Lustrous Tresses & Mirror Light", date: "November 2024", location: "Colombo Marine Drive", aspect: "landscape" },
      { name: "GLAMOUR COUTURE", title: "Bridal Hair & Makeup Masterclass", date: "October 2024", location: "Cinnamon Grand Salon", aspect: "portrait" },
      { name: "VELVET SHEARS", title: "Precision Scissors in Motion", date: "January 2025", location: "Modernist Hair Atelier", aspect: "landscape" },
      { name: "NOIR BOTANIQUE", title: "Organic Hair Spa & Botanical Oils", date: "December 2024", location: "Bentota Wellness Retreat", aspect: "portrait" },
      { name: "BOTTEGA BEAUTY", title: "Editorial High-Definition Finish", date: "November 2024", location: "Port City Beauty Suite", aspect: "landscape" }
    ]
  },
  {
    id: "abaya-shop",
    slug: "abaya-shop",
    title: "ABAYA SHOP",
    tagline: "Modest elegance, heirloom fabrics, and contemporary luxury robes.",
    description: "Celebrating sophisticated modest fashion with intricate beadwork, flowing silks, and timeless desert lighting.",
    coverImage: photoPools.abaya[0],
    pool: photoPools.abaya,
    albums: [
      { name: "NOOR ABAYA COUTURE", title: "The Silk Mirage Collection", date: "February 2025", location: "Doha & Colombo Showcase", aspect: "portrait" },
      { name: "AL JAWHARA MODESTY", title: "Embroidered Gold & Velvet Drape", date: "January 2025", location: "Katara Cultural Esplanade", aspect: "landscape" },
      { name: "SULTANA LUXURY", title: "Desert Twilight Silhouettes", date: "December 2024", location: "Qatar Inland Sea Dunes", aspect: "portrait" },
      { name: "ZAHRA SILK ATELIER", title: "Minimalist Flowing Robes", date: "November 2024", location: "Colombo Waterfront Runway", aspect: "landscape" },
      { name: "EMIRATES ROYALE", title: "Heirloom Beaded Abayas", date: "October 2024", location: "Royal Pavilion Colombo", aspect: "portrait" },
      { name: "DUSK & DESERT", title: "Warm Sand & Midnight Black Linens", date: "February 2025", location: "Arabian Gulf Coast", aspect: "landscape" },
      { name: "HIJAB & HEIRLOOM", title: "Graceful Drapes in Natural Sunlight", date: "January 2025", location: "Peradeniya Botanics", aspect: "portrait" },
      { name: "PEARL OF ARABIA", title: "Lustrous Modern Modest Fashion", date: "December 2024", location: "Pearl Island Marina", aspect: "landscape" }
    ]
  },
  {
    id: "workshop-photography",
    slug: "workshop-photography",
    title: "WORKSHOP PHOTOGRAPHY",
    tagline: "Artisan masterclasses, hands-on craft, and creative learning.",
    description: "Documentary documentation highlighting culinary, ceramic, and photography educational workshops in motion.",
    coverImage: photoPools.workshop[0],
    pool: photoPools.workshop,
    albums: [
      { name: "ATELIER CERAMICS", title: "Clay & Fire Masterclass", date: "January 2025", location: "Kandy Craft Studio", aspect: "landscape" },
      { name: "CANVAS GUILD", title: "Oil on Linen Masterclass Stills", date: "February 2025", location: "Colombo National Art Gallery", aspect: "portrait" },
      { name: "CULINARY ARTISANS", title: "Pastry & Sourdough Precision", date: "December 2024", location: "French Bakery Lab Colombo", aspect: "landscape" },
      { name: "LEATHER & HIDE", title: "Bespoke Handstitched Leathercraft", date: "November 2024", location: "Galle Heritage Workshop", aspect: "portrait" },
      { name: "GLASSBLOWING STUDIO", title: "Molten Light & Hand-Blown Vases", date: "October 2024", location: "Bentota Glassworks", aspect: "landscape" },
      { name: "BOTANICAL BOTTEGA", title: "Ikebana Floral Architecture", date: "January 2025", location: "Horton Plains Studio", aspect: "portrait" },
      { name: "WEAVING TRADITIONS", title: "Dumbara Handloom Heritage", date: "December 2024", location: "Matale Weaver Colony", aspect: "landscape" },
      { name: "MASTERCLASS BAKERY", title: "Artisan Woodfired Breadmaking", date: "November 2024", location: "Mirissa Country Hearth", aspect: "portrait" }
    ]
  },
  {
    id: "wedding",
    slug: "wedding",
    title: "WEDDING",
    tagline: "Unobtrusive fine-art documentation of vows, devotion, and joy.",
    description: "I take it a part of my life to document the precious moments in people's lives. Every wedding tells a sacred, unrepeatable story. From quiet morning preparations to heartfelt vows and joyous celebrations under starlight, we unobtrusively preserve the emotion, tears, and spontaneous laughter of your wedding day.",
    coverImage: photoPools.wedding[1],
    pool: photoPools.wedding,
    albums: [
      { name: "ARJUN & NISHA", title: "Serenade in Kandy Hills", date: "February 2025", location: "Earl's Regency, Kandy", aspect: "portrait" },
      { name: "DILAN & PRIYA", title: "Tides of Ceylon Beach Vows", date: "January 2025", location: "Tangalle Coastline", aspect: "landscape" },
      { name: "ELENA & DAVID", title: "Heirloom Gown in Meadow", date: "December 2024", location: "Nuwara Eliya Tea Estate", aspect: "portrait" },
      { name: "KAVINDA & SAMANTHA", title: "Highland Pine Mist Embrace", date: "November 2024", location: "Ambuluwawa Peak Sanctuary", aspect: "landscape" },
      { name: "MALIK & FATHIMA", title: "Sacred Palace Nikah Celebration", date: "October 2024", location: "Galle Face Hotel Ballroom", aspect: "portrait" },
      { name: "TARIQ & AYESHA", title: "Ocean Breeze Starlight Reception", date: "February 2025", location: "Anantara Peace Haven Tangalle", aspect: "landscape" },
      { name: "CHATHURA & HIRUNI", title: "Traditional Kandyan Poruwa Ceremony", date: "January 2025", location: "Mahaweli Reach Grand Lawn", aspect: "portrait" },
      { name: "ROSHAN & DEVI", title: "Golden Hour Coastal Wedding Walk", date: "December 2024", location: "Weligama Bay Resort", aspect: "landscape" }
    ]
  },
  {
    id: "katara",
    slug: "katara",
    title: "KATARA",
    tagline: "Architectural cultural village documentation and Middle Eastern heritage.",
    description: "Visual exploration of Katara Cultural Village's stunning amphitheatre, mosaic mosques, and dramatic desert light.",
    coverImage: photoPools.katara[0],
    pool: photoPools.katara,
    albums: [
      { name: "KATARA CULTURAL VILLAGE", title: "Architecture & Heritage Narrative", date: "December 2024", location: "Katara, Doha, Qatar", aspect: "landscape" },
      { name: "AMPHITHEATRE STAGE", title: "Greek-Roman Desert Acoustics", date: "January 2025", location: "Katara Open Amphitheatre", aspect: "portrait" },
      { name: "GOLDEN MOSQUE", title: "Gilded Tiles & Sacred Sunlight", date: "February 2025", location: "Katara Mosque Complex", aspect: "landscape" },
      { name: "MARBLE ESPLANADE", title: "Linear Symmetry by the Arabian Sea", date: "November 2024", location: "Katara Waterfront Promenade", aspect: "portrait" },
      { name: "AL BAHAR PLAZA", title: "Pillar Geometry & Sunset Shadows", date: "October 2024", location: "Katara South Colonnade", aspect: "landscape" },
      { name: "FALCON PAVILION", title: "Traditional Qatari Heritage Stills", date: "January 2025", location: "Katara Hunting Heritage Center", aspect: "portrait" },
      { name: "DOHA SEAFRONT", title: "Dhow Boats & Modernist Backdrops", date: "December 2024", location: "Katara Beachfront", aspect: "landscape" },
      { name: "SOUQ AL KATARA", title: "Artisan Lanterns & Stone Arches", date: "November 2024", location: "Katara Heritage Passages", aspect: "portrait" }
    ]
  },
  {
    id: "fitness",
    slug: "fitness",
    title: "FITNESS",
    tagline: "Dynamic athleticism, wellness, and inspirational movement.",
    description: "Honoring the dedication, strength, and grace of athletes, yogis, and fitness innovators across stunning outdoor locations.",
    coverImage: photoPools.fitness[1],
    pool: photoPools.fitness,
    albums: [
      { name: "LUNA YOGA", title: "Sunrise Asana by the Ocean", date: "February 2025", location: "Ahangama Shore, Sri Lanka", aspect: "portrait" },
      { name: "OCEAN PILATES", title: "Core Alignment & Salty Breeze", date: "January 2025", location: "Mirissa Cliff Studio", aspect: "landscape" },
      { name: "BREEZE ATHLETICS", title: "Beach Sprint & Functional Power", date: "December 2024", location: "Bentota Golden Sand", aspect: "portrait" },
      { name: "CROSSFIT PULSE", title: "High-Intensity Functional Movement", date: "November 2024", location: "CrossFit Horizon Colombo", aspect: "landscape" },
      { name: "SURF & SWEAT", title: "Wave Endurance & Ocean Athlete Stills", date: "October 2024", location: "Midigama Surf Point", aspect: "portrait" },
      { name: "STRIDE RUNNING", title: "Highland Trail Marathon Training", date: "February 2025", location: "Ella Mountain Pass", aspect: "landscape" },
      { name: "ZENITH CALISTHENICS", title: "Bar Work, Levers & Bodyweight Art", date: "January 2025", location: "Galle Face Outdoor Park", aspect: "portrait" },
      { name: "HORIZON MOVEMENTS", title: "Sunset Mindful Cooldown", date: "December 2024", location: "Tangalle Coral Beach", aspect: "landscape" }
    ]
  },
  {
    id: "architecture",
    slug: "architecture",
    title: "ARCHITECTURE",
    tagline: "Minimalist spatial geometry, tropical modernism, and light play.",
    description: "Capturing the interplay of tropical sunlight, raw concrete, open courtyards, and Geoffrey Bawa-inspired coastal sanctuaries.",
    coverImage: photoPools.architecture[0],
    pool: photoPools.architecture,
    albums: [
      { name: "VILLA AURA", title: "Bawa Tropical Modernism", date: "January 2025", location: "Tangalle Sanctuary, Sri Lanka", aspect: "landscape" },
      { name: "COLOMBO METROPOLIS", title: "Linear Glass & High-Rise Geometric Form", date: "February 2025", location: "Colombo Commercial Center", aspect: "portrait" },
      { name: "BAWA SERENDIPITY", title: "Courtyard Water Reflections", date: "December 2024", location: "Lunuganga Estate, Bentota", aspect: "landscape" },
      { name: "COASTAL CONCRETE", title: "Raw Brutalism Over Ocean Swells", date: "November 2024", location: "Mirissa Ocean Cliff Villa", aspect: "portrait" },
      { name: "GALLE FORT RESIDENCE", title: "18th-Century Dutch Heritage Renovated", date: "October 2024", location: "Church Street, Galle Fort", aspect: "landscape" },
      { name: "TROPICAL CANOPY", title: "Timber Slats & Jungle Infiltration", date: "January 2025", location: "Sinharaja Eco-Lodge Pavilion", aspect: "portrait" },
      { name: "MONOLITH RESIDENCE", title: "Cantilevered Concrete Sunset Pool", date: "December 2024", location: "Weligama Hilltop Sanctuary", aspect: "landscape" },
      { name: "CLIFFSIDE VILLA", title: "Infinity Horizon Architecture", date: "November 2024", location: "Dickwella Coastal Bluff", aspect: "portrait" }
    ]
  }
];

function generateCode() {
  let code = `/**
 * Gallery Categories & Client Albums Data Structure
 * Contains all 14 categories in CAPITAL LETTERS as requested.
 * Each category includes at least 10 high-resolution images for rich showcase,
 * plus EXACTLY 8 detailed client albums with individual image series.
 */

export const GALLERY_CATEGORIES = [
`;

  categoriesConfig.forEach((cat, cIdx) => {
    code += `  {
    id: ${JSON.stringify(cat.id)},
    slug: ${JSON.stringify(cat.slug)},
    title: ${JSON.stringify(cat.title)},
    tagline: ${JSON.stringify(cat.tagline)},
    description: ${JSON.stringify(cat.description)},
    coverImage: ${JSON.stringify(cat.coverImage)},
    galleryImages: [\n`;

    cat.pool.forEach((imgUrl, pIdx) => {
      const albumObj = cat.albums[pIdx % cat.albums.length];
      code += `      { id: "${cat.id.slice(0, 3)}-${pIdx + 1}", url: "${imgUrl}", title: "${albumObj.title}", client: "${albumObj.name}" }${pIdx < cat.pool.length - 1 ? ',' : ''}\n`;
    });

    code += `    ],
    clients: [\n`;

    cat.albums.forEach((alb, aIdx) => {
      const slug = alb.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const albImages = rotateArray(cat.pool, aIdx * 2);
      code += `      {
        id: "${cat.id}-${slug}",
        slug: "${slug}",
        name: "${alb.name}",
        title: "${alb.title}",
        date: "${alb.date}",
        location: "${alb.location}",
        coverImage: "${albImages[0]}",
        aspect: "${alb.aspect}",
        images: [\n`;

      albImages.forEach((img, iIdx) => {
        code += `          "${img}"${iIdx < albImages.length - 1 ? ',' : ''}\n`;
      });

      code += `        ]
      }${aIdx < cat.albums.length - 1 ? ',' : ''}\n`;
    });

    code += `    ]
  }${cIdx < categoriesConfig.length - 1 ? ',' : ''}\n`;
  });

  code += `]

export function getCategoryBySlug(slug) {
  return GALLERY_CATEGORIES.find((c) => c.slug === slug) || GALLERY_CATEGORIES[0]
}

export function getClientAlbum(categorySlug, clientSlug) {
  const category = getCategoryBySlug(categorySlug)
  if (!category) return null
  return category.clients.find((cl) => cl.slug === clientSlug) || null
}
`;

  return code;
}

const targetFile = path.resolve(__dirname, '../src/data/galleryCategoriesData.js');
fs.writeFileSync(targetFile, generateCode(), 'utf8');
console.log('Successfully written galleryCategoriesData.js with 8 albums for all 14 categories!');
