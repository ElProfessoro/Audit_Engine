"use client";

import { Info, AlertTriangle } from "lucide-react";
import type { Prospect } from "@/types";
import { cn } from "@/lib/utils";

interface Screen4Props {
  prospect: Prospect;
}

/**
 * Écran 4 — Score de conformité
 *
 * TODO Claude Code :
 * - Animer le stroke-dashoffset de la jauge au mount (de 540 vers la valeur cible, 1s ease)
 * - Animer la largeur des barres breakdown en cascade (100ms entre chaque)
 */
export function Screen4RiskAssessment({ prospect }: Screen4Props) {
  const { scores } = prospect.scan;
  const { global, breakdown, benchmarks } = scores;

  // Circumference for r=86 ≈ 540
  const circumference = 540;
  const offset = circumference - (global / 100) * circumference;

  return (
    <section className="px-16 py-14 pb-20">
      <h1 className="text-display-xl mb-4 text-primary">Score de conformité</h1>
      <p className="text-body-lg mb-8 max-w-3xl text-on-surface-variant">
        Évaluation globale de votre posture RGPD actuelle, basée sur les
        résultats de l&apos;audit automatisé et l&apos;analyse documentaire.
      </p>
      <div className="mb-12 h-[0.5px] bg-line-strong" />

      <div className="mb-6 grid grid-cols-3 gap-px border-hairline border-line bg-line">
        {/* Indice global */}
        <div className="bg-surface px-8 py-9">
          <div className="mb-8 text-label-md text-on-surface-variant">
            Indice global
          </div>
          <div className="flex h-[280px] flex-col items-center justify-center">
            <div className="relative size-[200px]">
              <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="#e9e7eb"
                  strokeWidth="14"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-serif text-[64px] font-extrabold leading-none tracking-[-0.04em] text-[#d97706]">
                  {global}
                </div>
                <div className="my-1.5 h-[0.5px] w-6 bg-line-strong" />
                <div className="font-mono text-[12px] text-on-surface-variant">
                  / 100
                </div>
              </div>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 border-hairline border-[#ba1a1a]/30 bg-[#ffdad6]/30 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ba1a1a]">
              <AlertTriangle className="size-3.5 stroke-[1.5]" />
              Risque élevé
            </div>
          </div>
        </div>

        {/* Ventilation par domaine */}
        <div className="bg-surface px-8 py-9">
          <div className="mb-8 text-label-md text-on-surface-variant">
            Ventilation par domaine
          </div>
          <div className="space-y-6">
            {breakdown.map((row) => (
              <BreakdownRow
                key={row.label}
                label={row.label}
                value={row.value}
                severity={row.severity}
              />
            ))}
          </div>
        </div>

        {/* Benchmark sectoriel */}
        <div className="bg-surface px-8 py-9">
          <div className="mb-8 text-label-md text-on-surface-variant">
            Benchmark sectoriel
          </div>
          <BenchmarkBars benchmarks={benchmarks} />
        </div>
      </div>

      {/* Callout */}
      <div className="flex items-start gap-4 border-hairline border-line bg-surface px-6 py-5">
        <Info className="mt-0.5 size-5 shrink-0 stroke-[1.5] text-secondary" />
        <div className="text-[15px] leading-relaxed text-on-surface">
          <strong className="font-bold text-primary">
            Votre score vous place dans le tiers inférieur des entreprises de
            votre secteur.
          </strong>{" "}
          Les manquements détectés sur le site public — la zone la plus exposée
          à un signalement externe ou à un contrôle CNIL — sont les premiers à
          corriger.
        </div>
      </div>
    </section>
  );
}

function BreakdownRow({
  label,
  value,
  severity,
}: {
  label: string;
  value: number;
  severity: "low" | "mid" | "high";
}) {
  const fillColor =
    severity === "low"
      ? "bg-secondary"
      : severity === "mid"
        ? "bg-warning"
        : "bg-success";
  const textColor =
    severity === "low"
      ? "text-secondary"
      : severity === "mid"
        ? "text-warning"
        : "text-success";

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-body-sm font-medium text-on-surface">{label}</div>
        <div
          className={cn(
            "font-serif text-[18px] font-bold tracking-tight",
            textColor,
          )}
        >
          {value}%
        </div>
      </div>
      <div className="relative h-1 overflow-hidden bg-surface-high">
        <div
          className={cn("h-full transition-[width] duration-1000", fillColor)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function BenchmarkBars({
  benchmarks,
}: {
  benchmarks: {
    you: number;
    sector: number;
    sectorLabel: string;
    national: number;
    target: number;
  };
}) {
  const bars = [
    { label: "Vous", value: benchmarks.you, style: "bg-[#d97706]", textClass: "text-[#d97706] font-bold" },
    { label: benchmarks.sectorLabel, value: benchmarks.sector, style: "bg-[#4c5f82] opacity-50", textClass: "text-on-surface-variant" },
    { label: "National", value: benchmarks.national, style: "bg-[#4c5f82] opacity-30", textClass: "text-on-surface-variant" },
    { label: "Cible", value: benchmarks.target, style: "border-hairline border-primary border-dashed bg-transparent", textClass: "text-primary font-bold" },
  ];

  return (
    <div className="flex h-[260px] flex-col">
      <div className="relative flex flex-1 items-end justify-between gap-3 pb-8 border-b-hairline border-line">
        {/* Dashed grid lines */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(8px+25%)] border-t-hairline border-line-strong border-dashed" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(8px+50%)] border-t-hairline border-line-strong border-dashed" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(8px+75%)] border-t-hairline border-line-strong border-dashed" />

        {bars.map((bar) => (
          <div key={bar.label} className="group z-10 flex w-full flex-col items-center gap-2">
            <span className={cn("font-mono text-[11px] opacity-0 transition-opacity group-hover:opacity-100", bar.textClass)}>
              {bar.value}
            </span>
            <div
              className={cn("w-8 transition-all", bar.style)}
              style={{ height: `${bar.value}%` }}
            />
            <span className={cn("font-mono text-[11px] whitespace-nowrap text-center", bar.textClass)}>
              {bar.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}
