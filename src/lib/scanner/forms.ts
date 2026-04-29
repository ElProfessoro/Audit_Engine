import type { Page } from "playwright";
import type { ScannedForm } from "@/types";

/**
 * Énumère les formulaires de la page et analyse leur conformité RGPD.
 *
 * TODO Claude Code :
 * - Crawler plusieurs pages clés (contact, candidature, inscription)
 * - Améliorer la détection de la case consentement (case à cocher avec
 *   texte mentionnant RGPD, données personnelles, ou politique)
 */
export async function scanForms(
  page: Page,
  url: string,
): Promise<ScannedForm[]> {
  const forms = await page.$$("form");
  const results: ScannedForm[] = [];

  for (const form of forms) {
    // Champs du formulaire
    const inputs = await form.$$eval(
      "input[name], textarea[name], select[name]",
      (els) =>
        els
          .map((el) => (el as HTMLInputElement).name)
          .filter(
            (name) =>
              name &&
              !["_csrf", "_token", "_method"].includes(name) &&
              !name.startsWith("g-recaptcha"),
          ),
    );

    if (inputs.length === 0) continue;

    // Recherche de case consentement
    const checkboxes = await form.$$('input[type="checkbox"]');
    let hasConsentCheckbox = false;
    for (const cb of checkboxes) {
      const label = await cb.evaluate((el) => {
        const id = el.id;
        if (id) {
          const labelEl = document.querySelector(`label[for="${id}"]`);
          if (labelEl) return labelEl.textContent ?? "";
        }
        const parent = el.closest("label");
        return parent?.textContent ?? "";
      });
      if (
        /rgpd|consent|donn[ée]es personnelles|politique|privacy/i.test(label)
      ) {
        hasConsentCheckbox = true;
        break;
      }
    }

    // Lien vers la politique à proximité
    const hasPolicyLink = await form.evaluate((el) => {
      const html = el.innerHTML.toLowerCase();
      return /confidentialit[ée]|politique|privacy/.test(html);
    });

    results.push({
      path: new URL(url).pathname,
      fields: inputs,
      hasConsentCheckbox,
      hasPolicyLink,
    });
  }

  return results;
}
