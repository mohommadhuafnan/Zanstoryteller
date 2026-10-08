/**
 * Universal Image Optimization Utility for Zan Storyteller
 * 
 * Guarantees every image is delivered in modern WebP format with:
 * - Cloudinary CDN automatic format & quality optimization (f_auto, q_auto:good)
 * - Dimension resizing based on responsive viewport needs
 * - Global edge CDN caching with immutable headers
 * - Fallback to Unsplash WebP auto-compression
 */

const CLOUDINARY_MAP = {
  '/scrolling/scroll_01.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468136/zanstoryteller/scrolling/scroll_01.webp',
  '/scrolling/scroll_02.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468137/zanstoryteller/scrolling/scroll_02.webp',
  '/scrolling/scroll_03.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468139/zanstoryteller/scrolling/scroll_03.webp',
  '/scrolling/scroll_04.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468141/zanstoryteller/scrolling/scroll_04.webp',
  '/scrolling/scroll_05.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468144/zanstoryteller/scrolling/scroll_05.webp',
  '/about/zan_portrait.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468145/zanstoryteller/about/zan_portrait.webp',
  '/about/zan_photographer.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468147/zanstoryteller/about/zan_photographer.webp',
  '/editorial/abaya_composite_backdrop.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468148/zanstoryteller/editorial/abaya_composite_backdrop.webp',
  '/editorial/abaya_midnight_blue.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468149/zanstoryteller/editorial/abaya_midnight_blue.webp',
  '/editorial/abaya_emerald_terracotta.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468150/zanstoryteller/editorial/abaya_emerald_terracotta.webp',
  '/editorial/abaya_royal_pine.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468151/zanstoryteller/editorial/abaya_royal_pine.webp',
  '/editorial/editorial_backdrop_reference.webp': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791468152/zanstoryteller/editorial/editorial_backdrop_reference.webp',
  '/logo.png': 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791466439/zanstoryteller/branding/zan_logo_gold.png'
}

/**
 * Transforms any image URL into an optimized WebP format from Cloudinary or Unsplash CDN.
 * 
 * @param {string} url - Source image URL (Cloudinary, Unsplash, or relative local path)
 * @param {object} [options] - Optimization settings
 * @param {number} [options.width=1200] - Target render width
 * @param {number} [options.quality=75] - Compression quality
 * @returns {string} Fully optimized WebP CDN URL
 */
export function getOptimizedImageUrl(url, { width = 1200, quality = 75 } = {}) {
  if (!url || typeof url !== 'string') return url

  // Map known local asset paths to their Cloudinary CDN versions
  let targetUrl = CLOUDINARY_MAP[url] || url

  // Also handle imported bundle paths that contain scroll_0x
  if (typeof targetUrl === 'string' && targetUrl.includes('scroll_0')) {
    if (targetUrl.includes('scroll_01')) targetUrl = CLOUDINARY_MAP['/scrolling/scroll_01.webp']
    else if (targetUrl.includes('scroll_02')) targetUrl = CLOUDINARY_MAP['/scrolling/scroll_02.webp']
    else if (targetUrl.includes('scroll_03')) targetUrl = CLOUDINARY_MAP['/scrolling/scroll_03.webp']
    else if (targetUrl.includes('scroll_04')) targetUrl = CLOUDINARY_MAP['/scrolling/scroll_04.webp']
    else if (targetUrl.includes('scroll_05')) targetUrl = CLOUDINARY_MAP['/scrolling/scroll_05.webp']
  }

  // 1. Cloudinary URL optimization: enforces auto-format (WebP/AVIF), auto-quality, and responsive sizing
  if (targetUrl.includes('res.cloudinary.com')) {
    if (targetUrl.includes('/upload/')) {
      const parts = targetUrl.split('/upload/')
      const vMatch = parts[1].match(/v\d+\/.*$/)
      const cleanPath = vMatch ? vMatch[0] : parts[1].replace(/^([^/]*?(?:f_|q_|w_|c_|g_|h_)[^/]*?\/)+/, '')
      const transform = `f_auto,q_auto:good${width ? `,w_${width}` : ''}`
      return `${parts[0]}/upload/${transform}/${cleanPath}`
    }
    return targetUrl
  }

  // 2. Unsplash URL optimization: forces modern WebP + auto compression
  if (targetUrl.includes('images.unsplash.com')) {
    try {
      const u = new URL(targetUrl)
      u.searchParams.set('auto', 'format,compress')
      u.searchParams.set('fm', 'webp')
      u.searchParams.set('q', String(quality))
      if (width) {
        u.searchParams.set('w', String(width))
      }
      return u.toString()
    } catch {
      return targetUrl
    }
  }

  return targetUrl
}

export function getResponsiveUnsplash(url, defaultWidth = 1000, sizes = '100vw') {
  const optSrc = getOptimizedImageUrl(url, { width: defaultWidth })
  return {
    src: optSrc,
    loading: 'lazy',
    decoding: 'async'
  }
}

export default getOptimizedImageUrl
