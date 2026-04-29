import type { BrowserContext } from "playwright";
import type { ScannedCookie, CookieType, Status } from "@/types";

/**
 * Capture tous les cookies posés AVANT toute interaction utilisateur.
 *
 * Le timing est critique : cette fonction doit être appelée juste après le
 * page.goto(), avant tout clic ou interaction. Tout cookie présent à ce moment
 * a été posé sans consentement.
 */
export async function scanCookies(
  context: BrowserContext,
): Promise<ScannedCookie[]> {
  const cookies = await context.cookies();

  return cookies.map((cookie) => {
    const type = categorizeCookie(cookie.name, cookie.domain);
    const status = determineStatus(type);

    return {
      name: cookie.name,
      domain: cookie.domain,
      type,
      // Tous les cookies capturés ici ont été posés avant interaction
      deposedBeforeConsent: true,
      status,
    };
  });
}

/**
 * Catégorise un cookie selon son nom et son domaine.
 *
 * TODO Claude Code : enrichir la base de patterns connus en s'appuyant sur :
 * - https://cookiepedia.co.uk/
 * - https://cookiedatabase.org/
 * - La documentation CNIL sur les exemptions
 */
function categorizeCookie(name: string, domain: string): CookieType {
  const lowerName = name.toLowerCase();
  const lowerDomain = domain.toLowerCase();

  // Essentiels (techniques)
  const essentialPatterns = [
    "sess", "session", "csrf", "xsrf", "token", "auth",
    "cart", "panier", "lang", "locale", "_secure",
  ];
  if (essentialPatterns.some((p) => lowerName.includes(p))) {
    return "essential";
  }

  // Publicitaires connus
  const advertisingDomains = [
    "doubleclick.net",
    "facebook.com",
    "fbcdn.net",
    "adsystem.com",
    "adnxs.com",
    "googleadservices.com",
    "criteo.com",
  ];
  const advertisingPatterns = ["_fbp", "_fbc", "fr", "_gcl_", "ide", "test_cookie"];
  if (
    advertisingDomains.some((d) => lowerDomain.includes(d)) ||
    advertisingPatterns.some((p) => lowerName.startsWith(p))
  ) {
    return "advertising";
  }

  // Analytics connus
  const analyticsPatterns = [
    "_ga", "_gid", "_gat", "_utma", "_utmb", "_utmc",
    "_hjid", "_hjsessionuser", "amplitude", "mp_",
  ];
  if (analyticsPatterns.some((p) => lowerName.startsWith(p))) {
    return "analytics";
  }

  return "unknown";
}

function determineStatus(type: CookieType): Status {
  if (type === "essential") return "pass";
  if (type === "advertising") return "fail";
  if (type === "analytics") return "warning";
  return "warning";
}
