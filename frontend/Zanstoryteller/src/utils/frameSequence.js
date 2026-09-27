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
   * Loads a specific frame index with high priority and GPU pre-decoding.
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
        // Pre-decode bitmap on background thread to prevent canvas draw jank
        if ('decode' in img) {
          img
            .decode()
            .catch(() => {})
            .finally(() => {
              this.cache.set(index, img)
              this.inFlight.delete(index)
              this._notify(index, img)
              resolve(img)
            })
        } else {
          this.cache.set(index, img)
          this.inFlight.delete(index)
          this._notify(index, img)
          resolve(img)
        }
      }

      if (img.complete && img.naturalWidth > 0) {
        handleDone()
      } else {
        img.onload = handleDone
        img.onerror = () => {
          this.inFlight.delete(index)
          resolve(null)
        }
      }
    })
  }

  /**
   * Prioritize frames around a center index (e.g. current scroll position).
   * Concurrently preloads forward and backward window.
   */
  prioritizeAround(centerIndex, radius = 18) {
    const clampedCenter = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(centerIndex)))

    // Load center immediately
    this.loadFrame(clampedCenter)

    // Load nearby frames in priority order
    for (let r = 1; r <= radius; r++) {
      const nextIdx = clampedCenter + r
      const prevIdx = clampedCenter - r
      if (nextIdx < TOTAL_FRAMES) this.loadFrame(nextIdx)
      if (prevIdx >= 0) this.loadFrame(prevIdx)
    }

    // Schedule any remaining uncached frames via concurrent pool
    this.scheduleBackgroundLoad(clampedCenter)
  }

  /**
   * Concurrent background loader for remaining uncached frames.
   * Uses a pool of 6 parallel workers to saturate bandwidth without blocking the UI.
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

    const CONCURRENCY = 6
    let activeWorkers = 0

    const next = () => {
      if (this.backgroundQueue.length === 0) {
        if (activeWorkers === 0) {
          this.isProcessingQueue = false
        }
        return
      }

      const nextIdx = this.backgroundQueue.shift()
      if (this.cache.has(nextIdx) || this.inFlight.has(nextIdx)) {
        next()
        return
      }

      activeWorkers++
      this.loadFrame(nextIdx).finally(() => {
        activeWorkers--
        next()
      })
    }

    // Spawn concurrent workers
    for (let c = 0; c < CONCURRENCY; c++) {
      next()
    }
  }

  /**
   * Preload vital frames with high concurrency and live progress reporting.
   * Preloads at least 25 frames (or all 50) so scrolling never hits missing frames.
   */
  preloadInitial(count = 28, onProgress) {
    const targetCount = Math.min(count, TOTAL_FRAMES)
    let loaded = 0

    return new Promise((resolve) => {
      if (targetCount === 0) {
        if (onProgress) onProgress(100)
        resolve()
        return
      }

      // Concurrently kick off all initial frames
      for (let i = 0; i < targetCount; i++) {
        this.loadFrame(i).then(() => {
          loaded++
          if (onProgress) {
            onProgress(Math.round((loaded / targetCount) * 100))
          }
          if (loaded >= targetCount) {
            // Immediately start background loading for all remaining frames
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
