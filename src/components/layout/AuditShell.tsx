"use client";

import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ShortcutsOverlay } from "./ShortcutsOverlay";
import { useAppStore } from "@/lib/store";
import type { Prospect, ScreenId } from "@/types";
import { cn } from "@/lib/utils";

import { Screen1Identification } from "@/components/screens/Screen1Identification";
import { Screen2TechnicalScan } from "@/components/screens/Screen2TechnicalScan";
import { Screen3DataMapping } from "@/components/screens/Screen3DataMapping";
import { Screen4RiskAssessment } from "@/components/screens/Screen4RiskAssessment";
import { Screen5RiskProjection } from "@/components/screens/Screen5RiskProjection";
import { Screen6FinalQuote } from "@/components/screens/Screen6FinalQuote";

interface AuditShellProps {
  prospect: Prospect;
}

export function AuditShell({ prospect }: AuditShellProps) {
  const {
    currentScreen,
    fullscreen,
    setScreen,
    nextScreen,
    prevScreen,
    toggleFullscreen,
    toggleShortcuts,
  } = useAppStore();

  // Raccourcis clavier globaux
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ne pas intercepter si l'utilisateur tape dans un input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowRight") nextScreen();
      else if (e.key === "ArrowLeft") prevScreen();
      else if (["1", "2", "3", "4", "5", "6"].includes(e.key)) {
        setScreen(Number(e.key) as ScreenId);
      } else if (e.key === "f" || e.key === "F") toggleFullscreen();
      else if (e.key === "?") toggleShortcuts();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setScreen, nextScreen, prevScreen, toggleFullscreen, toggleShortcuts]);

  return (
    <div
      className={cn(
        "grid min-h-screen",
        fullscreen ? "grid-cols-[0_1fr]" : "grid-cols-[240px_1fr]",
      )}
    >
      {!fullscreen && <Sidebar />}

      <main className="flex min-h-screen flex-col bg-surface-low">
        {!fullscreen && <Topbar />}

        <div className="flex-1">
          {currentScreen === 1 && <Screen1Identification prospect={prospect} />}
          {currentScreen === 2 && <Screen2TechnicalScan prospect={prospect} />}
          {currentScreen === 3 && <Screen3DataMapping prospect={prospect} />}
          {currentScreen === 4 && <Screen4RiskAssessment prospect={prospect} />}
          {currentScreen === 5 && <Screen5RiskProjection prospect={prospect} />}
          {currentScreen === 6 && <Screen6FinalQuote prospect={prospect} />}
        </div>
      </main>

      <ShortcutsOverlay />
    </div>
  );
}
