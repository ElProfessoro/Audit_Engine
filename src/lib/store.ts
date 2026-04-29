"use client";

import { create } from "zustand";
import type { ScreenId } from "@/types";

interface AppStore {
  currentScreen: ScreenId;
  fullscreen: boolean;
  shortcutsVisible: boolean;
  selectedAnomalyId: string | null;
  selectedPackage: "express" | "bundle";
  hasContinue: boolean;

  // Actions
  setScreen: (screen: ScreenId) => void;
  nextScreen: () => void;
  prevScreen: () => void;
  toggleFullscreen: () => void;
  toggleShortcuts: () => void;
  selectAnomaly: (id: string | null) => void;
  selectPackage: (pkg: "express" | "bundle") => void;
  toggleContinue: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentScreen: 1,
  fullscreen: false,
  shortcutsVisible: false,
  selectedAnomalyId: "anom-1",
  selectedPackage: "bundle",
  hasContinue: false,

  setScreen: (screen) => set({ currentScreen: screen }),
  nextScreen: () =>
    set((s) => ({
      currentScreen: Math.min(6, s.currentScreen + 1) as ScreenId,
    })),
  prevScreen: () =>
    set((s) => ({
      currentScreen: Math.max(1, s.currentScreen - 1) as ScreenId,
    })),
  toggleFullscreen: () => set((s) => ({ fullscreen: !s.fullscreen })),
  toggleShortcuts: () => set((s) => ({ shortcutsVisible: !s.shortcutsVisible })),
  selectAnomaly: (id) => set({ selectedAnomalyId: id }),
  selectPackage: (pkg) => set({ selectedPackage: pkg }),
  toggleContinue: () => set((s) => ({ hasContinue: !s.hasContinue })),
}));
