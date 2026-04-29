"use client";

import { Bell, UserCircle2 } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b-hairline border-line bg-surface px-12 py-5">
      <div className="font-serif text-base font-bold tracking-tight text-primary">
        Audit Engine
      </div>

      <div className="flex items-center gap-7">
        <div className="flex items-center gap-2.5 border-b-hairline border-on-surface-variant pb-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
          <span className="size-[7px] animate-pulse-soft bg-secondary" />
          <span>Live audit status</span>
        </div>

        <button className="text-on-surface-variant hover:text-primary" aria-label="Notifications">
          <Bell className="size-5 stroke-[1.5]" />
        </button>
        <button className="text-on-surface-variant hover:text-primary" aria-label="Profil">
          <UserCircle2 className="size-5 stroke-[1.5]" />
        </button>
      </div>
    </header>
  );
}
