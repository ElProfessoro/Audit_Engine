"use client";

import Image from "next/image";
import { useAppStore } from "@/lib/store";
import {
  IdCard,
  Terminal,
  Network,
  Scale,
  TrendingUp,
  FileText,
  Download,
  Keyboard,
  Maximize2,
} from "lucide-react";
import type { ScreenId } from "@/types";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { num: string; id: ScreenId; label: string; icon: typeof IdCard }[] = [
  { num: "01", id: 1, label: "Identification", icon: IdCard },
  { num: "02", id: 2, label: "Technical Scan", icon: Terminal },
  { num: "03", id: 3, label: "Data Mapping", icon: Network },
  { num: "04", id: 4, label: "Risk Assessment", icon: Scale },
  { num: "05", id: 5, label: "Risk Projection", icon: TrendingUp },
  { num: "06", id: 6, label: "Final Quote", icon: FileText },
];

export function Sidebar() {
  const { currentScreen, setScreen, toggleFullscreen, toggleShortcuts } =
    useAppStore();

  return (
    <aside className="sticky top-0 flex h-screen flex-col border-r-hairline border-line bg-surface px-6 py-8">
      {/* Brand */}
      <div className="mb-2 flex items-center gap-3 border-b-hairline border-line pb-6">
        <Image
          src="/logo/msdn.png"
          alt="MSDN Consulting"
          width={32}
          height={32}
          className="shrink-0"
        />
        <div>
          <div className="font-serif text-[17px] font-bold leading-none tracking-tight text-primary">
            MSDN Consulting
          </div>
          <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.15em] text-on-surface-variant">
            Cabinet conformité
          </div>
        </div>
      </div>

      {/* Product label */}
      <div className="mt-7 text-label-md text-primary">Audit Engine</div>
      <div className="mt-1.5 mb-6 border-b-hairline border-line pb-6 font-mono text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">
        v.24.1 · Compliance
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map(({ num, id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setScreen(id)}
            className={cn(
              "flex w-full items-center gap-3.5 px-3.5 py-3 text-left text-[11.5px] font-bold uppercase tracking-[0.12em] transition-colors",
              currentScreen === id
                ? "bg-primary text-on-primary"
                : "text-on-surface hover:bg-surface-low",
            )}
          >
            <span
              className={cn(
                "font-mono text-[10px]",
                currentScreen === id ? "opacity-70" : "opacity-55",
              )}
            >
              {num}
            </span>
            <Icon className="size-[18px] shrink-0 stroke-[1.5]" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-2.5 border-t-hairline border-line pt-5">
        <button className="flex w-full items-center gap-3 bg-primary px-3.5 py-3.5 text-on-primary text-label-sm transition-colors hover:bg-primary-deep">
          <Download className="size-4 stroke-[1.5]" />
          Export Findings
        </button>
        <button
          onClick={toggleShortcuts}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-on-surface-variant text-label-sm transition-colors hover:text-primary"
        >
          <Keyboard className="size-4 stroke-[1.5]" />
          Shortcuts
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-on-surface-variant text-label-sm transition-colors hover:text-primary"
        >
          <Maximize2 className="size-4 stroke-[1.5]" />
          Mode présentation
        </button>
      </div>
    </aside>
  );
}
