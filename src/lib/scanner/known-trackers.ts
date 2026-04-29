/**
 * Base de données des trackers connus.
 *
 * Cette liste est utilisée pour cross-référencer les scripts détectés sur les
 * sites scannés. Elle doit être maintenue à jour au fur et à mesure que de
 * nouveaux outils émergent.
 *
 * Sources de référence :
 * - https://github.com/easylist/easylist
 * - https://disconnect.me/trackerprotection/blocked
 * - https://better.fyi/blockers/
 */

export interface KnownTracker {
  domain: string;
  name: string;
  category: "advertising" | "analytics" | "social" | "tag-manager" | "session-replay" | "ab-testing";
  /** Sévérité par défaut quand détecté avant consentement */
  severity: "ok" | "warning" | "fail";
}

export const KNOWN_TRACKERS: KnownTracker[] = [
  // Google
  { domain: "googletagmanager.com", name: "Google Tag Manager", category: "tag-manager", severity: "warning" },
  { domain: "google-analytics.com", name: "Google Analytics", category: "analytics", severity: "warning" },
  { domain: "googletagservices.com", name: "Google Ad Services", category: "advertising", severity: "fail" },
  { domain: "doubleclick.net", name: "DoubleClick", category: "advertising", severity: "fail" },
  { domain: "googleadservices.com", name: "Google Ads", category: "advertising", severity: "fail" },

  // Meta / Facebook
  { domain: "connect.facebook.net", name: "Meta Pixel", category: "advertising", severity: "fail" },
  { domain: "facebook.com", name: "Facebook", category: "social", severity: "fail" },

  // Analytics tiers
  { domain: "hotjar.com", name: "Hotjar", category: "session-replay", severity: "fail" },
  { domain: "static.hotjar.com", name: "Hotjar", category: "session-replay", severity: "fail" },
  { domain: "fullstory.com", name: "FullStory", category: "session-replay", severity: "fail" },
  { domain: "mouseflow.com", name: "Mouseflow", category: "session-replay", severity: "fail" },
  { domain: "amplitude.com", name: "Amplitude", category: "analytics", severity: "warning" },
  { domain: "mixpanel.com", name: "Mixpanel", category: "analytics", severity: "warning" },
  { domain: "segment.io", name: "Segment", category: "analytics", severity: "warning" },
  { domain: "segment.com", name: "Segment", category: "analytics", severity: "warning" },

  // Advertising réseaux
  { domain: "criteo.com", name: "Criteo", category: "advertising", severity: "fail" },
  { domain: "adnxs.com", name: "AppNexus", category: "advertising", severity: "fail" },
  { domain: "rubiconproject.com", name: "Rubicon", category: "advertising", severity: "fail" },
  { domain: "linkedin.com/px", name: "LinkedIn Insight", category: "advertising", severity: "fail" },
  { domain: "ads.linkedin.com", name: "LinkedIn Ads", category: "advertising", severity: "fail" },
  { domain: "ads.tiktok.com", name: "TikTok Pixel", category: "advertising", severity: "fail" },
  { domain: "analytics.tiktok.com", name: "TikTok Analytics", category: "advertising", severity: "fail" },

  // A/B testing
  { domain: "optimizely.com", name: "Optimizely", category: "ab-testing", severity: "warning" },
  { domain: "vwo.com", name: "VWO", category: "ab-testing", severity: "warning" },

  // Social embeds
  { domain: "platform.twitter.com", name: "Twitter / X widgets", category: "social", severity: "warning" },
  { domain: "youtube.com", name: "YouTube embeds", category: "social", severity: "warning" },

  // CRM / Marketing
  { domain: "hs-scripts.com", name: "HubSpot", category: "analytics", severity: "warning" },
  { domain: "hubspot.com", name: "HubSpot", category: "analytics", severity: "warning" },
  { domain: "intercom.io", name: "Intercom", category: "analytics", severity: "warning" },
  { domain: "drift.com", name: "Drift", category: "analytics", severity: "warning" },
];
