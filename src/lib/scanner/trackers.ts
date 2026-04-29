import type { Page } from "playwright";
import type { ThirdPartyScript } from "@/types";
import { KNOWN_TRACKERS } from "./known-trackers";

/**
 * Énumère les scripts tiers chargés par la page et les cross-référence avec
 * la base des trackers connus.
 *
 * TODO Claude Code :
 * - Capturer les requêtes réseau via page.on("request") et filtrer celles vers
 *   des domaines tiers
 * - Mémoriser le timing (avant ou après interaction) pour identifier les
 *   trackers chargés sans consentement
 * - Détecter les pixels d'image (1x1 GIF) qui sont des trackers déguisés
 */
export async function scanThirdPartyScripts(
  page: Page,
  url: string,
): Promise<ThirdPartyScript[]> {
  const baseDomain = new URL(url).hostname;
  const scripts: ThirdPartyScript[] = [];

  // Approche basique : récupère tous les <script src> et tracks via DOM
  const scriptSrcs = await page.$$eval("script[src]", (els) =>
    els.map((el) => (el as HTMLScriptElement).src),
  );

  for (const src of scriptSrcs) {
    try {
      const scriptDomain = new URL(src).hostname;

      // On ne retient que les scripts vraiment tiers
      if (scriptDomain === baseDomain || scriptDomain.endsWith(`.${baseDomain}`)) {
        continue;
      }

      const tracker = KNOWN_TRACKERS.find((t) =>
        scriptDomain.includes(t.domain),
      );

      scripts.push({
        url: src,
        domain: scriptDomain,
        category: tracker?.category ?? "unknown",
        knownTracker: !!tracker,
        status: tracker?.severity === "fail" ? "fail" : tracker?.severity === "warning" ? "warning" : "ok",
      });
    } catch {
      // URL malformée, on ignore
    }
  }

  return scripts;
}
