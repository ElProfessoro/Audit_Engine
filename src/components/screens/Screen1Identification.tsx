"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Prospect } from "@/types";

interface Screen1Props {
  prospect: Prospect;
}

export function Screen1Identification({ prospect }: Screen1Props) {
  const { setScreen } = useAppStore();
  const { identity } = prospect;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Header */}
      <header className="flex items-start justify-between border-b-hairline border-line px-12 py-6">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="size-5 stroke-[1.5] text-primary" />
          <span className="text-label-md text-primary">MSDN Consulting</span>
        </div>
        <div className="text-right">
          <div className="text-label-sm text-on-surface-variant">Audit Préliminaire</div>
          <div className="mt-1.5 font-mono text-[13px] text-primary">Réf. #{identity.ref}</div>
          <div className="mt-0.5 font-mono text-[12px] text-on-surface-variant">14 octobre 2026</div>
        </div>
      </header>

      {/* Main */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-12 py-16">
        {/* Subtle background grid lines */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-12 px-12 opacity-[0.06]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={i < 11 ? "border-r-hairline border-primary" : ""} />
          ))}
        </div>

        <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
          {/* Company monogram box */}
          <div className="relative mb-12 flex size-48 items-center justify-center border-hairline border-line-strong bg-surface-container">
            <span className="absolute -left-px -top-px size-3 border-l-hairline border-t-hairline border-primary" />
            <span className="absolute -bottom-px -right-px size-3 border-b-hairline border-r-hairline border-primary" />
            <span className="font-serif text-[72px] font-extrabold leading-none tracking-[-2px] text-primary">
              {identity.initials}
            </span>
          </div>

          {/* Company name */}
          <h1 className="mb-12 text-center font-serif text-[72px] font-extrabold leading-none tracking-[-0.03em] text-primary">
            {identity.name}
          </h1>

          {/* Data grid */}
          <div className="mb-16 grid w-full grid-cols-4 border-y-hairline border-line-strong py-8">
            <DataCell label="Domaine" value={identity.domain} />
            <DataCell
              label="Code NAF"
              value={`${identity.nafCode} · ${identity.nafLabel}`}
            />
            <DataCell label="Effectif" value={`${identity.headcount} collaborateurs`} />
            <DataCell label="Implantation" value={identity.region} last />
          </div>

          {/* CTA */}
          <button
            onClick={() => setScreen(2)}
            className="inline-flex items-center gap-4 bg-primary px-12 py-5 text-on-primary text-label-md transition-colors hover:bg-primary-deep"
          >
            Lancer l&apos;analyse
            <ArrowRight className="size-[18px] stroke-[1.5]" />
          </button>

          {/* Disclaimer */}
          <p className="mt-20 max-w-2xl text-center font-mono text-[12px] leading-relaxed text-on-surface-variant opacity-70">
            Document généré par Audit Engine · MSDN Consulting. Données issues des
            registres publics et du pré-scan automatique du domaine. Confidentiel
            &amp; réservé à l&apos;usage interne.
          </p>
        </div>
      </main>
    </div>
  );
}

function DataCell({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={`px-7 ${last ? "" : "border-r-hairline border-line"}`}>
      <div className="mb-2.5 text-label-sm text-on-surface-variant">{label}</div>
      <div className="font-mono text-[14px] font-medium text-primary">{value}</div>
    </div>
  );
}
