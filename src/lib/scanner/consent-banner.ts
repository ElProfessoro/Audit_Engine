import type { Page } from "playwright";
import type { ConsentBannerAnalysis } from "@/types";
import { KNOWN_CMPS } from "./known-cmps";

/**
 * Détecte la présence d'une bannière de consentement et analyse sa conformité.
 *
 * TODO Claude Code :
 * - Améliorer la détection en utilisant des heuristiques sur la position
 *   (élément fixed en bas/haut, z-index élevé)
 * - Détecter si "Accepter" et "Refuser" sont au même niveau de visibilité
 *   (taille, contraste, position)
 * - Détecter la granularité (catégories de cookies sélectionnables)
 */
export async function scanConsentBanner(
  page: Page,
): Promise<ConsentBannerAnalysis> {
  // Détection du CMP par sélecteur connu
  let cmp: string | null = null;
  for (const known of KNOWN_CMPS) {
    const found = await page.$(known.selector);
    if (found) {
      cmp = known.name;
      break;
    }
  }

  // Recherche heuristique d'une bannière
  const bannerSelectors = [
    "[id*='cookie']",
    "[class*='cookie']",
    "[id*='consent']",
    "[class*='consent']",
    "[class*='banner'][class*='gdpr']",
  ];

  let detected = !!cmp;
  for (const sel of bannerSelectors) {
    if (detected) break;
    const elem = await page.$(sel);
    if (elem) {
      const isVisible = await elem.isVisible();
      if (isVisible) {
        detected = true;
        break;
      }
    }
  }

  // Recherche de boutons "refuser"
  const refuseButtonTexts = [
    "tout refuser",
    "refuser tout",
    "refuser",
    "reject all",
    "decline",
  ];

  let hasRefuseButton = false;
  for (const text of refuseButtonTexts) {
    const btn = await page.$(`button:has-text("${text}")`);
    if (btn) {
      hasRefuseButton = true;
      break;
    }
  }

  return {
    detected,
    cmp,
    hasRefuseButton,
    refuseEqualToAccept: false, // TODO: comparer dimensions et styles
    granularConsent: false, // TODO: détecter les catégories
  };
}
