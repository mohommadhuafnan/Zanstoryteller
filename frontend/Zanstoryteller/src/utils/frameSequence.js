// Intelligent frame sequence loader & caching system for Zanstoryteller
// Auto-discovers and strictly sorts frames from ../assets/frames/

const frameModules = import.meta.glob('../assets/frames/*.{png,webp,jpg,jpeg}', {
  eager: true,
  import: 'default',
})

// Sort keys numerically to ensure strict frame ordering (e.g. frame_001 -> frame_050)
const sortedKeys = Object.keys(frameModules).sort((a, b) => {
  const matchA = a.match(/(\d+)\.(png|webp|jpg|jpeg)$/i)
  const matchB = b.match(/(\d+)\.(png|webp|jpg|jpeg)$/i)
  const numA = matchA ? parseInt(matchA[1], 10) : 0
  const numB = matchB ? parseInt(matchB[1], 10) : 0
  return numA - numB
})

export const FRAME_URLS = sortedKeys.map((key) => frameModules[key])
export const TOTAL_FRAMES = FRAME_URLS.length
export const FIRST_FRAME_INDEX = 0
export const LAST_FRAME_INDEX = Math.max(0, TOTAL_FRAMES - 1)

// Canonical aspect ratio: 1280x720 (16:9)
export const FRAME_WIDTH = 1280
export const FRAME_HEIGHT = 720
export const FRAME_ASPECT_RATIO = 1280 / 720

/**
 * Intelligent Image Cache & Priority Loader
 */
class FrameCacheManager {
  constructor() {
    this.cache = new Map() // frameIndex -> HTMLImageElement
    this.inFlight = new Set() // frameIndex being fetched
    this.onFrameLoadedCallbacks = new Set()
    this.backgroundQueue = []
    this.isProcessingQueue = false
  }

  onFrameLoaded(callback) {
    this.onFrameLoadedCallbacks.add(callback)
    return () => this.onFrameLoadedCallbacks.delete(callback)
  }

  _notify(index, img) {
    for (const cb of this.onFrameLoadedCallbacks) {
      try {
        cb(index, img)
      } catch (err) {
        console.error('[FrameCache] Callback error:', err)
      }
    }
  }

  isLoaded(index) {
    return this.cache.has(index)
  }

  get(index) {
    return this.cache.get(index) || null
  }

  /**
   * Find nearest loaded frame if target frame is still downloading.
   * Guarantees zero blank frames, zero flashes, and seamless continuity.
   */
  getNearest(targetIndex) {
    if (this.cache.has(targetIndex)) {
      return { frame: this.cache.get(targetIndex), index: targetIndex }
    }

    // Search outwards from target index
    const maxDistance = TOTAL_FRAMES
    for (let dist = 1; dist < maxDistance; dist++) {
      const lower = targetIndex - dist
      if (lower >= 0 && this.cache.has(lower)) {
        return { frame: this.cache.get(lower), index: lower }
      }
      const upper = targetIndex + dist
      if (upper < TOTAL_FRAMES && this.cache.has(upper)) {
        return { frame: this.cache.get(upper), index: upper }
      }
    }

    return null
  }

  /**
   * Loads a specific frame index with high priority.
   */
  loadFrame(index) {
    if (index < 0 || index >= TOTAL_FRAMES) return Promise.resolve(null)
    if (this.cache.has(index)) return Promise.resolve(this.cache.get(index))
    if (this.inFlight.has(index)) return Promise.resolve(null)

    this.inFlight.add(index)

    return new Promise((resolve) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = FRAME_URLS[index]

      const handleDone = () => {
        this.cache.set(index, img)
        this.inFlight.delete(index)
        this._notify(index, img)
        resolve(img)
      }

      if (img.complete && img.naturalWidth > 0) {
        handleDone()
      } else {
        img.onload = handleDone
        img.onerror = () => {
          console.warn(`[FrameCache] Failed to load frame ${index + 1}`)
          this.inFlight.delete(index)
          resolve(null)
        }
      }
    })
  }

  /**
   * Prioritize frames around a center index (e.g. current scroll position).
   * Desktop: ±15 frames; Mobile: ±8 frames.
   */
  prioritizeAround(centerIndex, radius = 15) {
    const clampedCenter = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(centerIndex)))

    // Priority 1: Current frame
    this.loadFrame(clampedCenter)

    // Priority 2: Nearby frames outward
    for (let r = 1; r <= radius; r++) {
      const nextIdx = clampedCenter + r
      const prevIdx = clampedCenter - r
      if (nextIdx < TOTAL_FRAMES) this.loadFrame(nextIdx)
      if (prevIdx >= 0) this.loadFrame(prevIdx)
    }

    // Schedule remaining frames for background idle loading
    this.scheduleBackgroundLoad(clampedCenter)
  }

  /**
   * Background loader for remaining uncached frames.
   */
  scheduleBackgroundLoad(centerIndex = 0) {
    if (this.isProcessingQueue) return

    // Build list of uncached indices ordered by distance from center
    const pending = []
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!this.cache.has(i) && !this.inFlight.has(i)) {
        pending.push(i)
      }
    }

    if (pending.length === 0) return

    pending.sort((a, b) => Math.abs(a - centerIndex) - Math.abs(b - centerIndex))
    this.backgroundQueue = pending
    this.isProcessingQueue = true

    const loadNext = () => {
      if (this.backgroundQueue.length === 0) {
        this.isProcessingQueue = false
        return
      }

      const nextIdx = this.backgroundQueue.shift()
      if (this.cache.has(nextIdx) || this.inFlight.has(nextIdx)) {
        loadNext()
        return
      }

      this.loadFrame(nextIdx).then(() => {
        // Small delay between background loads to prevent network choking
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          window.requestIdleCallback(() => loadNext(), { timeout: 100 })
        } else {
          setTimeout(loadNext, 30)
        }
      })
    }

    loadNext()
  }

  /**
   * Preload initial vital frames (e.g. first frame + opening burst)
   * Calls onProgress(percent)
   */
  preloadInitial(count = 10, onProgress) {
    const targetCount = Math.min(count, TOTAL_FRAMES)
    let loaded = 0

    return new Promise((resolve) => {
      if (targetCount === 0) {
        if (onProgress) onProgress(100)
        resolve()
        return
      }

      for (let i = 0; i < targetCount; i++) {
        this.loadFrame(i).then(() => {
          loaded++
          if (onProgress) {
            onProgress(Math.round((loaded / targetCount) * 100))
          }
          if (loaded >= targetCount) {
            // Also start background queue for remaining frames
            this.scheduleBackgroundLoad(0)
            resolve()
          }
        })
      }
    })
  }

  clear() {
    this.cache.clear()
    this.inFlight.clear()
    this.backgroundQueue = []
    this.onFrameLoadedCallbacks.clear()
  }
}

export const frameCacheManager = new FrameCacheManager()
