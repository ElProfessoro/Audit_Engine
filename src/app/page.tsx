"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Page racine.
 * MVP : redirige vers l'audit du prospect mock.
 * v2 : dashboard multi-audits.
 */
export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/audit/2026-X042");
  }, [router]);
  return null;
}
