import { chromium, type Browser } from "playwright";
import type { ScanResult } from "@/types";
import { scanCookies } from "./cookies";
import { scanThirdPartyScripts } from "./trackers";
import { scanConsentBanner } from "./consent-banner";
import { scanPrivacyPolicy } from "./privacy-policy";
import { scanForms } from "./forms";
import { computeScores } from "./score";
import { generateAnomalies } from "./anomalies";

export interface ScanInput {
  url: string;
  options?: {
    timeout?: number;
    waitForLoad?: boolean;
    userAgent?: string;
  };
}

const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 AuditEngine/1.0 MSDN-Consulting (+https://msdn-consulting.fr)";

/**
 * Lance un scan complet sur une URL et retourne un ScanResult typé.
 *
 * Le scanner ne fait aucun pentest ni scan intrusif. Il agit comme un visiteur
 * lambda : il ouvre la page, regarde ce qui est public, et catégorise.
 *
 * @example
 * const result = await scan({ url: "https://example.com" });
 * console.log(result.scores.global); // 47
 */
export async function scan(input: ScanInput): Promise<ScanResult> {
  const startTime = Date.now();
  const url = normalizeUrl(input.url);
  const timeout = input.options?.timeout ?? DEFAULT_TIMEOUT;
  const userAgent = input.options?.userAgent ?? DEFAULT_USER_AGENT;

  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent,
      viewport: { width: 1280, height: 800 },
      locale: "fr-FR",
    });

    const page = await context.newPage();

    // Capture des cookies AVANT navigation et AVANT toute interaction
    // C'est le point critique : on regarde ce qui est posé sans rien accepter.
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout,
    });

    // Lancer toutes les analyses en parallèle quand c'est possible
    const [cookies, scripts, consentBanner, forms] = await Promise.all([
      scanCookies(context),
      scanThirdPartyScripts(page, url),
      scanConsentBanner(page),
      scanForms(page, url),
    ]);

    // La politique de confidentialité nécessite une navigation séparée
    const privacyPolicy = await scanPrivacyPolicy(page, url);

    // Génération des anomalies à partir de tous les résultats
    const anomalies = generateAnomalies({
      cookies,
      scripts,
      consentBanner,
      privacyPolicy,
      forms,
    });

    // Calcul des scores
    const scores = computeScores({
      cookies,
      scripts,
      consentBanner,
      privacyPolicy,
      forms,
      anomalies,
    });

    const result: ScanResult = {
      domain: new URL(url).hostname,
      scannedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      cookies,
      thirdPartyScripts: scripts,
      consentBanner,
      privacyPolicy,
      forms,
      anomalies,
      scores,
    };

    return result;
  } finally {
    await browser?.close();
  }
}

function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  if (url.startsWith("http://")) {
    throw new Error("Le scanner refuse les URLs en HTTP. Utilisez HTTPS.");
  }
  return url;
}
