/**
 * Génère un monogramme à 2 lettres à partir d'une raison sociale.
 * Ex: "RecrutExpert S.A.S." → "RE"
 *     "ACME Corporation"   → "AC"
 *     "Boulanger"          → "BO"
 */
export function generateInitials(name: string): string {
  const cleaned = name
    .replace(/S\.A\.S?\.?|S\.A\.|SARL|EURL|SCOP|SAS/gi, "")
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return "??";
}

/**
 * Formate un nombre en euros sans décimales.
 * Ex: 125000 → "125 000 €"
 */
export function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Concatène des classes CSS conditionnelles.
 * Mini implémentation maison pour éviter clsx en dépendance.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
