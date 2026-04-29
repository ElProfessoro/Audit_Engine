import { redirect } from "next/navigation";

/**
 * Page racine.
 * Pour le MVP, on redirige directement vers l'audit du prospect mock.
 * En v2, ce sera un dashboard listant tous les audits actifs.
 */
export default function HomePage() {
  redirect("/audit/2026-X042");
}
