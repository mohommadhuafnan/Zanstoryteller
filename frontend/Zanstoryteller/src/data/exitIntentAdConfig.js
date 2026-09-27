/**
 * Configuration for the ZanStoryTeller Exit-Intent Advertisement Popup.
 * Easily customize text, image, targeting timing, and CTA links here
 * without touching component code.
 */
export const exitIntentAdConfig = {
  // Master toggle to enable or disable the exit intent advertisement
  enabled: true,

  // Session storage key to ensure popup shows at most ONCE per session
  storageKey: "zanstoryteller_exit_intent_active",

  // Minimum time on page (milliseconds) before exit-intent detection is armed
  minTimeOnPageMs: 600,

  // Desktop only restriction (detects pointer type)
  desktopOnly: true,

  // Content configuration
  brandLabel: "ZANSTORYTELLER",
  badgeText: "2025 / 2026 CALENDAR OPEN",
  headline: "Your Story Deserves",
  headlineEmphasized: "To Be Remembered.",
  description: "Capture your most meaningful celebrations with cinematic artistry, emotional depth, and quiet discretion. Limited destination dates remaining.",

  // High-resolution photography matching brand aesthetics
  image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  imageAlt: "Intimate golden-hour wedding moment captured by ZanStoryTeller",

  // Primary Call to Action
  primaryCtaText: "EXPLORE OUR STORIES",
  primaryCtaTarget: "#portfolio", // Target anchor on home page or route like /book-session

  // Secondary dismiss action
  secondaryDismissText: "CONTINUE BROWSING",

  // Feature highlight pills
  features: [
    "Full-Day Narrative Coverage",
    "Handcrafted Fine-Art Albums",
    "Available Worldwide"
  ]
}
