"use client";

import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Prospect } from "@/types";

interface Screen2Props {
  prospect: Prospect;
}

/**
 * Écran 2 — Scan technique en cours
 *
 * TODO Claude Code :
 * - Animer l'apparition des lignes du terminal une par une (50-100ms cascade) avec Framer Motion
 * - Permettre de skipper l'animation par espace ou clic
 * - Animer les compteurs (count-up de 0 vers la valeur)
 */
export function Screen2TechnicalScan({ prospect }: Screen2Props) {
  const { setScreen } = useAppStore();
  const { scan } = prospect;

  return (
    <section className="grid min-h-[calc(100vh-64px)] grid-cols-2">
      {/* Terminal */}
      <div className="bg-primary px-14 py-16 font-mono text-[13.5px] leading-relaxed text-on-primary">
        <div className="mb-8 text-[12px] leading-tight text-primary-light opacity-85">
          <div>AUDIT_ENGINE_V24.1</div>
          <div>TARGET: https://{scan.domain}</div>
          <div>TIMESTAMP: {scan.scannedAt}</div>
          <div>MODE: DEEP_INSPECTION</div>
        </div>

        <ScanLine>&gt; INITIATING SEQUENCE...</ScanLine>
        <ScanLine>&gt; RESOLVING DNS...</ScanLine>
        <ScanLine status="ok">&gt; CONNECTING TO DOMAIN...</ScanLine>

        <ScanLine status="ok" head>
          &gt; ENUMERATING COOKIES...
        </ScanLine>
        {scan.cookies.map((c) => (
          <ScanLine key={c.name} indent status={c.status}>
            {c.name} ({c.type})
          </ScanLine>
        ))}

        <ScanLine status="ok" head>
          &gt; SCANNING THIRD-PARTY SCRIPTS...
        </ScanLine>
        {scan.thirdPartyScripts.map((s) => (
          <ScanLine key={s.url} indent status={s.status === "ok" ? "ok" : s.status}>
            {s.domain}
          </ScanLine>
        ))}

        <ScanLine status="ok" head>
          &gt; PARSING PRIVACY POLICY...
        </ScanLine>
        <ScanLine indent status="found">
          Article 13 RGPD references
        </ScanLine>
        <ScanLine indent status="missing">
          Explicit opt-out mechanism
        </ScanLine>
        <ScanLine indent status="missing">
          Data retention statement
        </ScanLine>

        <div className="mt-6 flex items-center gap-1 text-primary-light">
          <span>&gt; COMPILING FINDINGS</span>
          <span className="ml-1 inline-block size-2 h-3.5 animate-blink bg-primary-light" />
        </div>
      </div>

      {/* Côté droit */}
      <div className="flex flex-col bg-surface px-14 py-16">
        <div className="mb-8 flex items-baseline justify-between border-b-hairline border-line-strong pb-4">
          <h2 className="font-serif text-[36px] font-bold tracking-tight text-primary">
            Analyse en cours
          </h2>
          <div className="text-label-sm text-on-surface-variant">Phase 3/4</div>
        </div>

        {/* Radar */}
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="relative size-60">
            {/* Cercles */}
            <div className="absolute left-1/2 top-1/2 size-60 -translate-x-1/2 -translate-y-1/2 rounded-full border-hairline border-line-strong" />
            <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-hairline border-line-strong opacity-60" />
            <div className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-hairline border-line-strong opacity-40" />

            {/* Sweep */}
            <div className="absolute left-1/2 top-1/2 h-px w-30 origin-left animate-sweep bg-gradient-to-r from-primary to-transparent" />

            {/* Centre */}
            <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />

            {/* Blips */}
            <div className="absolute size-1.5 rounded-full bg-secondary" style={{ top: "38%", left: "62%", transform: "translate(-50%,-50%)" }} />
            <div className="absolute size-1.5 rounded-full bg-on-surface-variant opacity-50" style={{ top: "64%", left: "70%", transform: "translate(-50%,-50%)" }} />
            <div className="absolute size-1.5 rounded-full bg-warning" style={{ top: "58%", left: "32%", transform: "translate(-50%,-50%)" }} />
          </div>
        </div>

        {/* Compteurs */}
        <div className="grid grid-cols-3 gap-px bg-line">
          <Counter label="Cookies\ndétectés" value={scan.cookies.length * 10 + 2} accent="secondary" />
          <Counter label="Scripts\ntiers" value={18} accent="warning" />
          <Counter label="Formulaires\nanalysés" value={scan.forms.length} accent="primary" />
        </div>

        {/* CTA */}
        <button
          onClick={() => setScreen(3)}
          className="mt-8 flex w-full items-center justify-center gap-3.5 bg-primary px-8 py-5 text-on-primary text-label-md transition-colors hover:bg-primary-deep"
        >
          Voir le rapport
          <ArrowRight className="size-[18px] stroke-[1.5]" />
        </button>
      </div>
    </section>
  );
}

function ScanLine({
  children,
  status,
  indent,
  head,
}: {
  children: React.ReactNode;
  status?: "ok" | "pass" | "warning" | "fail" | "found" | "missing";
  indent?: boolean;
  head?: boolean;
}) {
  const statusColor =
    status === "warning"
      ? "text-warning"
      : status === "fail" || status === "missing"
        ? "text-secondary-bright"
        : "text-white";

  const statusLabel = status
    ? `[${status.toUpperCase()}]`
    : "";

  return (
    <div
      className={`mb-1 flex justify-between gap-4 ${indent ? "pl-6" : ""} ${head ? "mt-4 mb-2 font-semibold" : ""}`}
    >
      <span className="flex items-center gap-2">
        {indent && <span className="text-white/30">│</span>}
        {children}
      </span>
      {statusLabel && (
        <span className={`font-semibold tracking-wide ${statusColor}`}>
          {statusLabel}
        </span>
      )}
    </div>
  );
}

function Counter({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "secondary" | "warning" | "primary";
}) {
  const accentColor =
    accent === "secondary"
      ? "bg-secondary"
      : accent === "warning"
        ? "bg-warning"
        : "bg-primary";

  return (
    <div className="relative bg-surface px-5 py-6">
      <div className="mb-3.5 whitespace-pre-line text-label-sm leading-tight text-on-surface-variant">
        {label}
      </div>
      <div className="font-serif text-[56px] font-extrabold leading-none tracking-[-0.04em] text-primary">
        {String(value).padStart(2, "0")}
      </div>
      <div className={`absolute bottom-3 left-5 h-[1.5px] w-8 ${accentColor}`} />
    </div>
  );
}
