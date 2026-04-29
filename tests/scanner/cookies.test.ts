import { describe, it, expect } from "vitest";

/**
 * Tests unitaires pour la catégorisation des cookies.
 *
 * NOTE : la fonction categorizeCookie n'est pas exportée pour l'instant.
 * Claude Code : extraire categorizeCookie dans un fichier séparé pour la tester
 * proprement, ou ajouter un export nommé.
 */

describe("Catégorisation des cookies", () => {
  it.todo("identifie les cookies essentiels (session, csrf)");
  it.todo("identifie les cookies advertising (Meta Pixel, DoubleClick)");
  it.todo("identifie les cookies analytics (GA, GTM)");
  it.todo("classe en 'unknown' les cookies non reconnus");

  // Squelette pour Claude Code à compléter
  it("le test runner fonctionne", () => {
    expect(1 + 1).toBe(2);
  });
});
