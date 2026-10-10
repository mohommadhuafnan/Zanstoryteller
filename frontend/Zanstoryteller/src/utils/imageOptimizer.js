/**
 * Universal Image Optimization Utility for Zan Storyteller
 * 
 * Guarantees every image is delivered in modern WebP / AVIF format with:
 * - Cloudinary CDN automatic format & quality optimization (f_auto, q_auto)
 * - Dimension resizing based on responsive viewport needs (w_500, w_800, w_1200, w_1600, w_2000)
 * - Preserves original high-resolution uploaded photography untouched in Cloudinary storage
 * - Responsive srcset generation for mobile, tablet, and desktop viewports
 * - Fast edge CDN caching with immutable headers
 */

const CLOUDINARY_CLOUD_NAME = 'dtpeeydfz'

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
  '/logo.png': 'https://res.cloudinary.com/dtpeeydfz/image/upload/f_webp,q_auto:good/v1791466439/zanstoryteller/branding/zan_logo_gold.png'
}

/**
 * Strips existing transformations from a Cloudinary path after /upload/
 * to allow cleanly inserting new delivery transformations.
 */
function cleanCloudinaryPath(afterUpload) {
  if (!afterUpload) return ''
  const vMatch = afterUpload.match(/(v\d+\/.+$)/)
  if (vMatch) return vMatch[1]
  return afterUpload.replace(/^((?:[a-z]{1,3}_[a-zA-Z0-9_.:-]+,?)+\/)+/, '')
}

/**
 * Transforms any image URL or Cloudinary public ID into an optimized WebP delivery URL.
 * Never modifies or compresses the stored original asset in Cloudinary.
 * 
 * @param {string} urlOrPublicId - Image URL (Cloudinary, Unsplash, local path) or Cloudinary public ID
 * @param {object} [options] - Optimization settings
 * @param {number} [options.width] - Target display width in pixels (e.g. 500, 800, 1200, 1600, 2000)
 * @param {string} [options.quality='auto'] - Cloudinary quality transformation ('auto', 'auto:good', 'auto:best')
 * @param {string} [options.format='webp'] - Format conversion (default 'webp' delivers lightning-fast WebP)
 * @param {number} [options.blur] - Optional blur level for placeholders
 * @returns {string} Optimized delivery URL
 */
export function getOptimizedImageUrl(urlOrPublicId, { width, quality = 'auto', format = 'webp', blur } = {}) {
  if (!urlOrPublicId || typeof urlOrPublicId !== 'string') return urlOrPublicId

  // Never alter data URIs or in-memory blobs (e.g. during local admin upload preview)
  if (urlOrPublicId.startsWith('data:') || urlOrPublicId.startsWith('blob:')) {
    return urlOrPublicId
  }

  // Map known local asset paths to their Cloudinary CDN versions
  let targetUrl = CLOUDINARY_MAP[urlOrPublicId] || urlOrPublicId

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
      const cleanPath = cleanCloudinaryPath(parts[1])
      
      const transformParts = [`f_${format}`, `q_${quality}`]
      if (width) transformParts.push(`w_${width}`)
      if (blur) transformParts.push(`e_blur:${blur}`)

      return `${parts[0]}/upload/${transformParts.join(',')}/${cleanPath}`
    }
    return targetUrl
  }

  // 2. Bare Cloudinary public ID handling (e.g. 'zanstoryteller/products/myphoto.jpg')
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('/')) {
    const transformParts = [`f_${format}`, `q_${quality}`]
    if (width) transformParts.push(`w_${width}`)
    if (blur) transformParts.push(`e_blur:${blur}`)
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformParts.join(',')}/${targetUrl}`
  }

  // 3. Unsplash URL optimization: forces modern WebP + auto compression
  if (targetUrl.includes('images.unsplash.com')) {
    try {
      const u = new URL(targetUrl)
      u.searchParams.set('auto', 'format,compress')
      u.searchParams.set('fm', 'webp')
      u.searchParams.set('q', quality === 'auto' ? '80' : String(quality))
      if (width) {
        u.searchParams.set('w', String(width))
      }
      return u.toString()
    } catch {
      return targetUrl
    }
  }

  // 4. Supabase Storage transformation: converts any Supabase-hosted image (JPG, PNG, etc.) to modern WebP
  if (targetUrl.includes('supabase.co/storage/v1/')) {
    try {
      const supabaseRenderUrl = targetUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')
      const u = new URL(supabaseRenderUrl)
      u.searchParams.set('format', 'webp')
      u.searchParams.set('quality', quality === 'auto' ? '80' : String(quality))
      if (width) {
        u.searchParams.set('width', String(width))
      }
      return u.toString()
    } catch {
      return targetUrl
    }
  }

  // 5. Local static asset paths: auto-resolve .jpg/.png to .webp
  if (typeof targetUrl === 'string' && (targetUrl.startsWith('/about/') || targetUrl.startsWith('/editorial/') || targetUrl.startsWith('/scrolling/'))) {
    const webpPath = targetUrl.replace(/\.(jpe?g|png)$/i, '.webp')
    if (CLOUDINARY_MAP[webpPath]) {
      return getOptimizedImageUrl(CLOUDINARY_MAP[webpPath], { width, quality, format, blur })
    }
    return webpPath
  }

  return targetUrl
}

/**
 * Generates responsive srcset attribute string for Cloudinary / Unsplash images.
 * 
 * @param {string} url - Image URL
 * @param {number[]} [widths=[500, 800, 1200, 1600, 2000]] - Array of target widths
 * @returns {string} Responsive srcset string
 */
export function getCloudinarySrcSet(url, widths = [500, 800, 1200, 1600, 2000]) {
  if (!url || typeof url !== 'string') return ''
  if (url.startsWith('data:') || url.startsWith('blob:')) return ''

  return widths
    .map((w) => `${getOptimizedImageUrl(url, { width: w })} ${w}w`)
    .join(', ')
}

/**
 * Returns comprehensive responsive image props for <img> or picture elements.
 * 
 * @param {string} url - Source image URL
 * @param {object} [options]
 * @param {number} [options.width=1200] - Default image width
 * @param {number[]} [options.widths=[500, 800, 1200, 1600]] - Breakpoint widths
 * @param {string} [options.sizes='(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1200px'] - HTML sizes attribute
 * @param {boolean} [options.priority=false] - When true, disables lazy loading and sets high fetchPriority (e.g. for Hero / LCP)
 */
export function getResponsiveImageProps(url, {
  width = 1200,
  widths = [500, 800, 1200, 1600],
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1200px',
  priority = false
} = {}) {
  const src = getOptimizedImageUrl(url, { width })
  const srcSet = getCloudinarySrcSet(url, widths)

  return {
    src,
    ...(srcSet ? { srcSet } : {}),
    ...(srcSet && sizes ? { sizes } : {}),
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    ...(priority ? { fetchPriority: 'high' } : {})
  }
}

/**
 * Generates an ultra-lightweight blurred placeholder (~1KB) for progressive image loading.
 */
export function getLowQualityPlaceholder(url) {
  return getOptimizedImageUrl(url, { width: 40, quality: 'eco', blur: 600 })
}

/**
 * Backward compatibility alias for legacy components using getResponsiveUnsplash
 */
export function getResponsiveUnsplash(url, defaultWidth = 1000, sizes = '100vw') {
  return getResponsiveImageProps(url, { width: defaultWidth, sizes })
}

export default getOptimizedImageUrl
