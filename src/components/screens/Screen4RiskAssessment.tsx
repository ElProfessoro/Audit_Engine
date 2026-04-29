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
 * - Animer l'apparition des points scatter en fade-in
 */
export function Screen4RiskAssessment({ prospect }: Screen4Props) {
  const { scores } = prospect.scan;
  const { global, breakdown, benchmarks } = scores;

  // Calcul du stroke-dashoffset pour la jauge
  // Circumference d'un cercle r=86 ≈ 540
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
                  stroke="#b02d1d"
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-serif text-[64px] font-extrabold leading-none tracking-[-0.04em] text-secondary">
                  {global}
                </div>
                <div className="my-1.5 h-[0.5px] w-6 bg-line-strong" />
                <div className="font-mono text-[12px] text-on-surface-variant">
                  / 100
                </div>
              </div>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-label-sm text-white">
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
          <BenchmarkScatter benchmarks={benchmarks} />
          <div className="mt-3 flex justify-between border-t-hairline border-line pt-4 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
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

function BenchmarkScatter({
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
  const points = [
    { type: "target", label: "Cible", value: benchmarks.target, top: 12 },
    { type: "national", label: "National", value: benchmarks.national, top: 50 },
    { type: "sector", label: benchmarks.sectorLabel, value: benchmarks.sector, top: 60 },
    { type: "you", label: "Vous", value: benchmarks.you, top: 78 },
  ];

  return (
    <div className="relative h-[260px]">
      {/* Axes horizontaux */}
      <div className="absolute inset-x-0 top-[30%] h-[0.5px] bg-line" />
      <div className="absolute inset-x-0 top-[60%] h-[0.5px] bg-line" />
      <div className="absolute inset-x-0 top-[90%] h-[0.5px] bg-line" />

      {points.map((p) => (
        <BenchmarkPoint key={p.type} {...p} />
      ))}
    </div>
  );
}

function BenchmarkPoint({
  type,
  label,
  value,
  top,
}: {
  type: string;
  label: string;
  value: number;
  top: number;
}) {
  const dotClass =
    type === "you"
      ? "bg-secondary size-[18px]"
      : type === "sector"
        ? "bg-warning size-[14px]"
        : type === "national"
          ? "bg-on-surface-variant size-[14px]"
          : "bg-success size-[14px]";

  const labelClass =
    type === "you"
      ? "text-secondary"
      : type === "target"
        ? "text-success"
        : "text-on-surface-variant";

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
      style={{ top: `${top}%`, left: `${value}%` }}
    >
      <div
        className={cn(
          "mb-1 text-[10px] font-bold uppercase tracking-[0.14em] whitespace-nowrap",
          labelClass,
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "mx-auto mb-2 rounded-full border-2 border-surface ring-[0.5px] ring-line-strong",
          dotClass,
        )}
      />
      <div className="font-mono text-[11.5px] font-semibold text-on-surface">
        {value} / 100
      </div>
    </div>
  );
}
