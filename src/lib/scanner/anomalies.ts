import type {
  Anomaly,
  ScannedCookie,
  ThirdPartyScript,
  ConsentBannerAnalysis,
  PrivacyPolicyAnalysis,
  ScannedForm,
} from "@/types";

interface AnomaliesInput {
  cookies: ScannedCookie[];
  scripts: ThirdPartyScript[];
  consentBanner: ConsentBannerAnalysis;
  privacyPolicy: PrivacyPolicyAnalysis;
  forms: ScannedForm[];
}

/**
 * Génère la liste des anomalies à présenter à l'écran 3 à partir des résultats
 * du scan.
 *
 * TODO Claude Code :
 * - Calculer dynamiquement les positions x/y sur le screenshot du site
 *   (actuellement hardcodées en cas de fallback)
 * - Enrichir les sanctions de référence par secteur (lookup sur le code NAF)
 * - Ajuster les fourchettes d'exposition selon la taille de l'entreprise
 */
export function generateAnomalies(input: AnomaliesInput): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Cookies advertising avant consentement → critique
  const adCookies = input.cookies.filter(
    (c) => c.type === "advertising" && c.deposedBeforeConsent,
  );
  if (adCookies.length > 0) {
    anomalies.push({
      id: `anom-cookies-${Date.now()}`,
      severity: "critical",
      title: "Cookies publicitaires déposés avant consentement",
      legalRef: "Article 82 · Loi Informatique et Libertés",
      description: `Le scan détecte ${adCookies.length} cookie(s) publicitaire(s) déposé(s) avant que le visiteur n'ait interagi avec la bannière de consentement.`,
      position: { x: 75, y: 17 },
      sanctionRef: {
        name: "SHEIN",
        amount: "150 M€",
        date: "juillet 2025",
        reason: "cookies déposés sans consentement",
      },
      exposure: {
        label: "Procédure simplifiée CNIL",
        range: "15 000 — 20 000 €",
      },
    });
  }

  // Bannière sans bouton refuser → critique
  if (input.consentBanner.detected && !input.consentBanner.hasRefuseButton) {
    anomalies.push({
      id: `anom-banner-${Date.now()}`,
      severity: "critical",
      title: "Bannière cookies sans bouton 'Tout refuser'",
      legalRef: "Recommandation CNIL · 17 septembre 2020",
      description:
        "La bannière de consentement présente un bouton 'Accepter' mais aucun bouton 'Tout refuser' au même niveau.",
      position: { x: 35, y: 79 },
      sanctionRef: {
        name: "Google + Facebook",
        amount: "150 M€ + 60 M€",
        date: "janvier 2022",
        reason: "absence de bouton de refus aussi accessible",
      },
      exposure: {
        label: "Mise en demeure publique probable",
        range: "20 000 — 50 000 €",
      },
    });
  }

  // Formulaire sans consentement → critique
  const formsWithoutConsent = input.forms.filter((f) => !f.hasConsentCheckbox);
  if (formsWithoutConsent.length > 0) {
    anomalies.push({
      id: `anom-form-${Date.now()}`,
      severity: "critical",
      title: "Formulaire sans case de consentement",
      legalRef: "Article 7 RGPD · Conditions du consentement",
      description: `${formsWithoutConsent.length} formulaire(s) collectent des données personnelles sans case de consentement explicite.`,
      position: { x: 50, y: 60 },
      sanctionRef: {
        name: "Cabinet Bouygues Recrutement",
        amount: "14 000 €",
        date: "2025",
        reason: "absence d'information dans le parcours candidat",
      },
      exposure: {
        label: "Procédure simplifiée CNIL",
        range: "8 000 — 14 000 €",
      },
    });
  }

  // Politique de confidentialité incomplète → modéré
  if (input.privacyPolicy.score < 60 && input.privacyPolicy.url) {
    anomalies.push({
      id: `anom-policy-${Date.now()}`,
      severity: "moderate",
      title: "Politique de confidentialité incomplète",
      legalRef: "Article 13 RGPD · Information du visiteur",
      description: `La politique de confidentialité n'est complète qu'à ${input.privacyPolicy.score}%. Plusieurs éléments obligatoires manquent.`,
      position: { x: 50, y: 30 },
      sanctionRef: {
        name: "Sanctions PME 2024-2025",
        amount: "5 000 — 12 000 €",
        date: "2024-2025",
        reason: "information incomplète",
      },
      exposure: {
        label: "Manquement à l'obligation d'information",
        range: "5 000 — 10 000 €",
      },
    });
  }

  return anomalies;
}
