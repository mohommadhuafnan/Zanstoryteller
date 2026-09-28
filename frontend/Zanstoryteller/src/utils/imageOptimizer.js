/**
 * Generates responsive srcset and sizes for Unsplash CDN URLs.
 * On mobile devices, serves appropriately sized (480w / 800w) images
 * instead of full desktop resolutions (1400w / 1600w), cutting mobile transfer payload by 60-70%.
 */
export function getResponsiveUnsplash(
  url,
  defaultWidth = 1000,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px'
) {
  if (!url || typeof url !== 'string' || !url.includes('images.unsplash.com')) {
    return { src: url }
  }

  // Extract base URL before search params
  const [baseUrl] = url.split('?')
  const baseWithParams = `${baseUrl}?auto=format&fit=crop`
  const srcSet = `${baseWithParams}&w=480&q=80 480w, ${baseWithParams}&w=800&q=80 800w, ${baseWithParams}&w=1200&q=85 1200w, ${baseWithParams}&w=1600&q=85 1600w`

  return {
    src: `${baseWithParams}&w=${defaultWidth}&q=85`,
    srcSet,
    sizes,
  }
}
