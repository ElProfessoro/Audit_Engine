"use client";

import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Prospect } from "@/types";

interface Screen1Props {
  prospect: Prospect;
}

export function Screen1Identification({ prospect }: Screen1Props) {
  const { setScreen } = useAppStore();
  const { identity } = prospect;

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-16 py-10 pb-20">
      {/* Grille décorative en arrière-plan */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-12 px-16 opacity-[0.06]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={i < 11 ? "border-r-hairline border-primary" : ""}
          />
        ))}
      </div>

      {/* Tag préliminaire */}
      <div className="mb-12 w-full max-w-5xl text-right">
        <div className="mb-1.5 text-label-sm text-on-surface-variant">
          Audit préliminaire
        </div>
        <div className="font-mono text-[13px] text-primary">
          Réf. #{identity.ref}
        </div>
        <div className="mt-0.5 font-mono text-[12px] text-on-surface-variant">
          14 octobre 2026
        </div>
      </div>

      {/* Monogramme */}
      <div className="relative mb-14 flex size-[180px] items-center justify-center border-hairline border-line-strong bg-surface">
        {/* Coins */}
        <span className="absolute -left-px -top-px size-3 border-l-hairline border-t-hairline border-primary" />
        <span className="absolute -bottom-px -right-px size-3 border-b-hairline border-r-hairline border-primary" />
        <span className="font-serif text-[72px] font-extrabold leading-none tracking-[-2px] text-primary">
          {identity.initials}
        </span>
      </div>

      {/* Nom */}
      <h1 className="relative z-10 mb-14 text-center font-serif text-[80px] font-extrabold leading-none tracking-[-0.03em] text-primary">
        {identity.name}
      </h1>

      {/* Données */}
      <div className="relative z-10 mb-16 grid w-full max-w-5xl grid-cols-4 border-y-hairline border-line-strong py-7">
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
        className="relative z-10 inline-flex items-center gap-4 bg-primary px-12 py-5 text-on-primary text-label-md transition-colors hover:bg-primary-deep"
      >
        Lancer l&apos;analyse
        <ArrowRight className="size-[18px] stroke-[1.5]" />
      </button>

      {/* Disclaimer */}
      <div className="relative z-10 mt-16 max-w-2xl text-center font-mono text-[12px] leading-relaxed text-on-surface-variant opacity-70">
        Document généré par Audit Engine · MSDN Consulting. Données issues des
        registres publics et du pré-scan automatique du domaine. Confidentiel
        &amp; réservé à l&apos;usage interne.
      </div>
    </section>
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
