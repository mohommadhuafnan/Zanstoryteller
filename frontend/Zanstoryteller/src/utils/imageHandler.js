/**
 * Client-side image handling & WebP conversion utility for Zan Storyteller CMS.
 * Automatically converts any uploaded image format (PNG, JPG, JPEG, AVIF, HEIC, etc.)
 * into high-fidelity WebP format with pristine quality preservation (0.94+ quality ratio),
 * ensuring maximum sharpness and optimal web delivery.
 */

export function fileToBase64(file, maxWidth = 3840, maxHeight = 3840, quality = 0.95) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"))
      return
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error("Selected file is not an image"))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Failed to read image file"))

    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error("Failed to process image"))

      img.onload = () => {
        let { width, height } = img

        // If image exceeds max 4K bounds, gently scale to fit within bounds while preserving natural aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d', { alpha: true })
        if (!ctx) {
          resolve(e.target.result)
          return
        }

        // Maximum fidelity bicubic rendering
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Ultra high quality WebP encoding (0.95: visual parity with raw original, no perceptible loss)
        try {
          const webpData = canvas.toDataURL('image/webp', quality)
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData)
            return
          }
        } catch {
          // Fallback if browser canvas lacks webp export
        }

        // Secondary fallback to PNG for lossless preservation, or JPEG 0.96
        try {
          const pngData = canvas.toDataURL('image/png')
          resolve(pngData)
        } catch {
          const jpegData = canvas.toDataURL('image/jpeg', 0.96)
          resolve(jpegData)
        }
      }

      img.src = e.target.result
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Validates if a string is a valid image URL or base64 data URI
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./')
  )
}

/**
 * Checks if the image is in WebP format
 */
export function isWebPFormat(url) {
  if (!url || typeof url !== 'string') return false
  return url.startsWith('data:image/webp') || url.includes('.webp') || url.includes('format=webp')
}
