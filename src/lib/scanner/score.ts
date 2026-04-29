import type {
  ComplianceScore,
  ScannedCookie,
  ThirdPartyScript,
  ConsentBannerAnalysis,
  PrivacyPolicyAnalysis,
  ScannedForm,
  Anomaly,
} from "@/types";

interface ScoreInput {
  cookies: ScannedCookie[];
  scripts: ThirdPartyScript[];
  consentBanner: ConsentBannerAnalysis;
  privacyPolicy: PrivacyPolicyAnalysis;
  forms: ScannedForm[];
  anomalies: Anomaly[];
}

/**
 * Calcule le score global de conformité RGPD à partir des résultats du scan.
 *
 * Le score est sur 100 :
 * - 100 = parfaitement conforme
 * - 0 = aucun élément conforme
 *
 * Pondération :
 * - 40% Site web public (cookies, bannière, scripts)
 * - 25% Documentation (politique de confidentialité)
 * - 20% Sécurité organisationnelle (estimée, à compléter par questionnaire)
 * - 15% Sous-traitance & DPA (estimée, à compléter par questionnaire)
 */
export function computeScores(input: ScoreInput): ComplianceScore {
  const websiteScore = computeWebsiteScore(input);
  const documentationScore = input.privacyPolicy.score;
  const securityScore = 50; // placeholder — à remplacer par questionnaire en v2
  const dpaScore = 30; // placeholder — à remplacer par questionnaire en v2

  const global = Math.round(
    websiteScore * 0.4 +
      documentationScore * 0.25 +
      securityScore * 0.2 +
      dpaScore * 0.15,
  );

  // TODO Claude Code : remplacer le secteur hardcodé par un lookup
  // basé sur le code NAF du prospect
  return {
    global,
    breakdown: [
      {
        label: "Site web public",
        value: websiteScore,
        severity: severityFromScore(websiteScore),
      },
      {
        label: "Documentation interne",
        value: documentationScore,
        severity: severityFromScore(documentationScore),
      },
      {
        label: "Sécurité organisationnelle",
        value: securityScore,
        severity: severityFromScore(securityScore),
      },
      {
        label: "Sous-traitance & DPA",
        value: dpaScore,
        severity: severityFromScore(dpaScore),
      },
    ],
    benchmarks: {
      you: global,
      sector: 54,
      sectorLabel: "Secteur RH",
      national: 61,
      target: 85,
    },
  };
}

function computeWebsiteScore(input: ScoreInput): number {
  let score = 100;

  // Cookies non-essentiels avant consentement
  const failedCookies = input.cookies.filter((c) => c.status === "fail").length;
  const warnedCookies = input.cookies.filter((c) => c.status === "warning").length;
  score -= failedCookies * 12;
  score -= warnedCookies * 5;

  // Bannière non conforme
  if (!input.consentBanner.detected) score -= 25;
  if (input.consentBanner.detected && !input.consentBanner.hasRefuseButton) score -= 20;

  // Scripts tiers en fail
  const failedScripts = input.scripts.filter((s) => s.status === "fail").length;
  score -= failedScripts * 8;

  // Formulaires sans consentement
  const formsWithoutConsent = input.forms.filter((f) => !f.hasConsentCheckbox).length;
  score -= formsWithoutConsent * 6;

  return Math.max(0, Math.min(100, score));
}

function severityFromScore(value: number): "low" | "mid" | "high" {
  if (value < 50) return "low";
  if (value < 70) return "mid";
  return "high";
}
