import type { Prospect } from "@/types";
import recrutexpertMock from "@/data/mocks/recrutexpert.json";

/**
 * Charge un prospect par sa référence d'audit.
 *
 * MVP : on ne sert que le mock. La vraie version v2 lira depuis Postgres
 * ou depuis le résultat d'un scan en cache.
 */
export async function loadProspect(ref: string): Promise<Prospect | null> {
  // Pour le MVP, toutes les refs renvoient le même mock
  if (ref === "2026-X042") {
    return recrutexpertMock as Prospect;
  }
  return null;
}
