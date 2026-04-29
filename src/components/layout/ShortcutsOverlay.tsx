"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ShortcutsOverlay() {
  const { shortcutsVisible, toggleShortcuts } = useAppStore();

  // Affichage automatique 3s au chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      useAppStore.setState({ shortcutsVisible: true });
      setTimeout(() => useAppStore.setState({ shortcutsVisible: false }), 3000);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Esc pour fermer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        useAppStore.setState({ shortcutsVisible: false });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      onClick={toggleShortcuts}
      className={cn(
        "fixed bottom-6 right-6 z-50 cursor-pointer bg-primary px-5 py-4 text-tech-sm leading-relaxed text-primary-light shadow-lg transition-opacity",
        shortcutsVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="mb-1 font-bold text-white">Raccourcis clavier</div>
      <div>
        <Kbd>←</Kbd> <Kbd>→</Kbd> Navigation entre écrans
      </div>
      <div>
        <Kbd>1</Kbd>...<Kbd>6</Kbd> Saut direct vers écran
      </div>
      <div>
        <Kbd>F</Kbd> Mode présentation
      </div>
      <div>
        <Kbd>?</Kbd> Afficher / masquer cette aide
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-block border-hairline border-primary-light bg-primary-deep px-1.5 py-0.5 font-mono text-[10px]">
      {children}
    </kbd>
  );
}
