import type { Page } from "playwright";
import type { PrivacyPolicyAnalysis } from "@/types";

/**
 * Détecte et analyse la politique de confidentialité du site.
 *
 * TODO Claude Code :
 * - Détecter le lien vers la politique (footer, mentions légales, etc.)
 * - Naviguer vers la page et extraire le contenu textuel
 * - Vérifier la présence des éléments obligatoires RGPD
 * - Calculer un score de complétude
 */
export async function scanPrivacyPolicy(
  page: Page,
  baseUrl: string,
): Promise<PrivacyPolicyAnalysis> {
  // Recherche du lien dans le footer
  const policySelectors = [
    "a[href*='confidentialite']",
    "a[href*='privacy']",
    "a[href*='politique']",
    "a:has-text('confidentialité')",
    "a:has-text('Privacy')",
  ];

  let policyUrl: string | null = null;
  for (const sel of policySelectors) {
    const link = await page.$(sel);
    if (link) {
      const href = await link.getAttribute("href");
      if (href) {
        policyUrl = new URL(href, baseUrl).toString();
        break;
      }
    }
  }

  if (!policyUrl) {
    return {
      url: null,
      elementsFound: {
        controllerIdentity: false,
        purposes: false,
        legalBasis: false,
        retention: false,
        rights: false,
        transfers: false,
        dpoMention: false,
      },
      score: 0,
    };
  }

  // Charger la page et extraire le texte
  await page.goto(policyUrl, { waitUntil: "networkidle", timeout: 15_000 });
  const text = (await page.textContent("body")) ?? "";
  const lowerText = text.toLowerCase();

  const elementsFound = {
    controllerIdentity: /responsable.{0,30}traitement|data controller/i.test(lowerText),
    purposes: /finalit[ée]s?.{0,40}traitement|purposes? of processing/i.test(lowerText),
    legalBasis: /base.{0,20}l[ée]gale|legal basis|article 6/i.test(lowerText),
    retention: /dur[ée]e.{0,30}conservation|retention period/i.test(lowerText),
    rights: /droit.{0,30}(acc[èe]s|rectification|effacement)|right.{0,30}(access|erasure)/i.test(lowerText),
    transfers: /transfert.{0,30}hors.{0,10}(ue|union)|international transfer/i.test(lowerText),
    dpoMention: /d[ée]l[ée]gu[ée].{0,20}protection|dpo|data protection officer/i.test(lowerText),
  };

  const score = Math.round(
    (Object.values(elementsFound).filter(Boolean).length / 7) * 100,
  );

  return {
    url: policyUrl,
    elementsFound,
    score,
  };
}
