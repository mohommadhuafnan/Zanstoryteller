// Frame loader utility for Zanstoryteller Hero Scrollytelling
// Loads and strictly sorts all frames from cinematicframes/

const frameModules = import.meta.glob('../assets/cinematicframes/*.png', {
  eager: true,
  import: 'default',
})

// Sort keys numerically to ensure strict frame ordering (001 -> 050)
const sortedKeys = Object.keys(frameModules).sort((a, b) => {
  const numA = parseInt(a.match(/(\d+)\.png$/)?.[1] || '0', 10)
  const numB = parseInt(b.match(/(\d+)\.png$/)?.[1] || '0', 10)
  return numA - numB
})

export const FRAME_URLS = sortedKeys.map((key) => frameModules[key])
export const TOTAL_FRAMES = FRAME_URLS.length
export const FIRST_FRAME_INDEX = 0
export const LAST_FRAME_INDEX = TOTAL_FRAMES - 1

// Dimensions of the cinematic photography frames
export const FRAME_WIDTH = 1280
export const FRAME_HEIGHT = 720
export const FRAME_ASPECT_RATIO = 1280 / 720 // 16:9 (1.7778)

/**
 * Preload all frames into HTMLImageElement instances.
 * @param {(progress: number) => void} onProgress - Callback with 0-100 percentage.
 * @returns {Promise<HTMLImageElement[]>}
 */
export function preloadFrames(onProgress) {
  return new Promise((resolve) => {
    let loadedCount = 0
    const images = new Array(TOTAL_FRAMES)
    const total = TOTAL_FRAMES

    if (total === 0) {
      if (onProgress) onProgress(100)
      resolve([])
      return
    }

    FRAME_URLS.forEach((url, idx) => {
      const img = new Image()
      img.src = url

      const handleDone = () => {
        loadedCount++
        if (onProgress) {
          onProgress(Math.round((loadedCount / total) * 100))
        }
        if (loadedCount >= total) {
          resolve(images)
        }
      }

      if (img.complete) {
        images[idx] = img
        handleDone()
      } else {
        img.onload = () => {
          images[idx] = img
          handleDone()
        }
        img.onerror = () => {
          console.warn(`[FrameLoader] Warning: failed to load frame ${idx + 1}`)
          images[idx] = img
          handleDone()
        }
      }
    })
  })
}

/**
 * Maps scroll progress (0.0 to 1.0) to frame index (0 to 49 and back to 0).
 *
 * Timeline:
 *  0.00 - 0.70 : Forward explosion (assembled frame 0 -> fully exploded frame 49)
 *  0.70 - 1.00 : Smooth reassembly (frame 49 -> frame 0)
 *
 * @param {number} progress - Scroll progress between 0 and 1
 * @returns {number} Floating or rounded frame index
 */
export function getFrameIndexFromProgress(progress) {
  const p = Math.max(0, Math.min(1, progress))

  // Explosion apex is at 70% scroll progress
  const APEX_PROGRESS = 0.70

  if (p <= APEX_PROGRESS) {
    const ratio = p / APEX_PROGRESS
    return ratio * (TOTAL_FRAMES - 1)
  } else {
    const ratio = (p - APEX_PROGRESS) / (1.0 - APEX_PROGRESS)
    return (1.0 - ratio) * (TOTAL_FRAMES - 1)
  }
}
