/**
 * Consent Management Platforms connus.
 * Permet d'identifier rapidement le CMP utilisé sur un site.
 */
export const KNOWN_CMPS = [
  { name: "Axeptio", selector: "#axeptio_overlay, .axeptio_widget" },
  { name: "Didomi", selector: "#didomi-host, .didomi-popup-container" },
  { name: "OneTrust", selector: "#onetrust-banner-sdk, #ot-sdk-cookie-policy" },
  { name: "Cookiebot", selector: "#CybotCookiebotDialog" },
  { name: "Tarteaucitron", selector: "#tarteaucitronRoot" },
  { name: "Trust Arc", selector: "#truste-consent-track" },
  { name: "Quantcast Choice", selector: ".qc-cmp2-container" },
  { name: "Iubenda", selector: "#iubenda-cs-banner" },
];
