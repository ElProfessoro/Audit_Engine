/**
 * Types liés au résultat d'un scan Playwright.
 * C'est le contrat d'interface entre le module scanner et l'UI.
 */

export type CookieType = "essential" | "analytics" | "advertising" | "unknown";
export type Status = "pass" | "warning" | "fail";
export type Severity = "critical" | "moderate" | "watch";

export interface ScannedCookie {
  name: string;
  domain: string;
  type: CookieType;
  /** True si le cookie est posé avant que le visiteur n'ait interagi avec la bannière */
  deposedBeforeConsent: boolean;
  status: Status;
}

export interface ThirdPartyScript {
  url: string;
  domain: string;
  /** Catégorie issue de known-trackers.ts, ex: "advertising", "analytics", "social" */
  category: string;
  knownTracker: boolean;
  status: "ok" | "warning" | "fail";
}

export interface ConsentBannerAnalysis {
  detected: boolean;
  /** Nom du Consent Management Platform si reconnu (Axeptio, Didomi, etc.) */
  cmp: string | null;
  hasRefuseButton: boolean;
  refuseEqualToAccept: boolean;
  granularConsent: boolean;
}

export interface PrivacyPolicyAnalysis {
  url: string | null;
  elementsFound: {
    controllerIdentity: boolean;
    purposes: boolean;
    legalBasis: boolean;
    retention: boolean;
    rights: boolean;
    transfers: boolean;
    dpoMention: boolean;
  };
  /** Score de complétude 0-100 */
  score: number;
}

export interface ScannedForm {
  path: string;
  fields: string[];
  hasConsentCheckbox: boolean;
  hasPolicyLink: boolean;
}

/**
 * Une anomalie détectée par le scanner.
 * Chaque anomalie est convertie en marqueur sur l'écran 3.
 */
export interface Anomaly {
  id: string;
  severity: Severity;
  title: string;
  /** Référence légale, ex: "Article 82 · Loi Informatique et Libertés" */
  legalRef: string;
  description: string;
  /** Position du marqueur sur le screenshot du site, en pourcentages 0-100 */
  position: { x: number; y: number };
  /** Sanction de référence à présenter au prospect */
  sanctionRef: {
    name: string;
    amount: string;
    date: string;
    reason: string;
  };
  /** Estimation chiffrée de l'exposition pour ce manquement */
  exposure: {
    label: string;
    range: string;
  };
}

/**
 * Score global et ventilation par domaine.
 * Affiché sur l'écran 4.
 */
export interface ComplianceScore {
  /** Score global 0-100 */
  global: number;
  breakdown: {
    label: string;
    value: number;
    severity: "low" | "mid" | "high";
  }[];
  benchmarks: {
    you: number;
    sector: number;
    sectorLabel: string;
    national: number;
    target: number;
  };
}

/**
 * Résultat complet d'un scan.
 * Persisté en JSON dans data/scans/<ref>.json.
 */
export interface ScanResult {
  domain: string;
  scannedAt: string;
  durationMs: number;

  cookies: ScannedCookie[];
  thirdPartyScripts: ThirdPartyScript[];
  consentBanner: ConsentBannerAnalysis;
  privacyPolicy: PrivacyPolicyAnalysis;
  forms: ScannedForm[];

  anomalies: Anomaly[];
  scores: ComplianceScore;
}
