"use client";

import { useAppStore } from "@/lib/store";
import type { Prospect, Anomaly, Severity } from "@/types";
import { cn } from "@/lib/utils";

interface Screen3Props {
  prospect: Prospect;
}

export function Screen3DataMapping({ prospect }: Screen3Props) {
  const { selectedAnomalyId, selectAnomaly } = useAppStore();
  const { scan } = prospect;

  const counts = {
    critical: scan.anomalies.filter((a) => a.severity === "critical").length,
    moderate: scan.anomalies.filter((a) => a.severity === "moderate").length,
    watch: scan.anomalies.filter((a) => a.severity === "watch").length,
  };

  const selected =
    scan.anomalies.find((a) => a.id === selectedAnomalyId) ?? scan.anomalies[0];

  return (
    <section className="px-16 py-14 pb-20">
      <h1 className="text-display-xl mb-4 text-primary">Cartographie des anomalies</h1>
      <p className="text-body-lg mb-8 max-w-3xl text-on-surface-variant">
        Visualisation des non-conformités RGPD détectées sur l&apos;interface publique du domaine.
        Cliquez un marqueur pour examiner le détail.
      </p>
      <div className="mb-12 h-[0.5px] bg-line-strong" />

      {/* Barre anomalies */}
      <div className="mb-6 flex items-center gap-8 border-b-hairline border-line py-4">
        <div className="text-label-md text-on-surface-variant">Anomalies détectées :</div>
        <Tag dotClass="bg-secondary" count={counts.critical} label="Critiques" />
        <Tag dotClass="bg-secondary-bright" count={counts.moderate} label="Modérées" />
        <Tag dotClass="bg-tertiary-warm" count={counts.watch} label="Points de vigilance" />
      </div>

      {/* Layout split */}
      <div className="grid grid-cols-[1fr_380px] border-hairline border-line">
        {/* Screenshot mock */}
        <div className="relative min-h-[600px] overflow-hidden bg-primary-deep">
          <MockSite />
          {scan.anomalies.map((anomaly) => (
            <AnomalyMarker
              key={anomaly.id}
              anomaly={anomaly}
              selected={anomaly.id === selectedAnomalyId}
              onClick={() => selectAnomaly(anomaly.id)}
            />
          ))}
        </div>

        {/* Panneau détail */}
        <AnomalyDetail anomaly={selected} />
      </div>
    </section>
  );
}

function Tag({
  dotClass,
  count,
  label,
}: {
  dotClass: string;
  count: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[13.5px] font-medium text-on-surface">
      <span className={`size-2.5 rounded-full ${dotClass}`} />
      <strong>{count}</strong> {label}
    </div>
  );
}

function MockSite() {
  return (
    <div
      className="size-full p-12 text-on-surface-variant"
      style={{
        background: `
          linear-gradient(rgba(0,14,39,0.55), rgba(0,14,39,0.55)),
          repeating-linear-gradient(180deg, #000e27 0px, #000e27 60px, rgba(180,199,239,0.06) 60px, rgba(180,199,239,0.06) 61px)
        `,
      }}
    >
      <div className="mb-15 flex justify-between border-b-hairline border-primary-light/15 pb-6">
        <div className="font-serif text-[22px] font-bold text-primary-light/90">
          RecrutExpert
        </div>
        <div className="flex items-center gap-7 text-[11px] uppercase tracking-wider text-primary-light/50">
          <span>Notre cabinet</span>
          <span>Métiers</span>
          <span>Candidats</span>
          <span>Contact</span>
        </div>
      </div>

      <div className="mb-15 mt-14">
        <h2 className="mb-4 font-serif text-[48px] font-bold leading-tight text-primary-light/85">
          Le recrutement, <em className="italic text-primary-light/60">réinventé.</em>
        </h2>
        <p className="max-w-lg text-[13px] leading-relaxed text-primary-light/40">
          Nous accompagnons les entreprises de la région Auvergne-Rhône-Alpes
          dans la sélection de leurs futurs collaborateurs. Notre méthode
          combine intelligence artificielle et expertise métier.
        </p>
      </div>

      <div className="mb-12 max-w-lg border-hairline border-primary-light/10 bg-primary-light/[0.04] p-6">
        <div className="mb-3.5 flex gap-3.5">
          <div className="h-9 flex-1 border-hairline border-primary-light/15 bg-primary-light/[0.08]" />
          <div className="h-9 flex-1 border-hairline border-primary-light/15 bg-primary-light/[0.08]" />
        </div>
        <div className="flex gap-3.5">
          <div className="h-9 flex-1 border-hairline border-primary-light/15 bg-primary-light/[0.08]" />
          <div className="h-[38px] w-36 bg-secondary/70" />
        </div>
      </div>

      <div className="absolute bottom-6 left-12 right-12 flex items-center justify-between border-hairline border-primary-light/[0.18] bg-primary-light/[0.08] px-6 py-4 text-[11px] text-primary-light/55">
        <div>Ce site utilise des cookies pour améliorer votre expérience.</div>
        <div className="bg-secondary/60 px-4.5 py-2 text-[10px] font-bold uppercase tracking-wider text-white">
          Accepter
        </div>
      </div>
    </div>
  );
}

function AnomalyMarker({
  anomaly,
  selected,
  onClick,
}: {
  anomaly: Anomaly;
  selected: boolean;
  onClick: () => void;
}) {
  const colorClass =
    anomaly.severity === "critical"
      ? "bg-secondary"
      : anomaly.severity === "moderate"
        ? "bg-secondary-bright"
        : "bg-tertiary-warm";

  return (
    <button
      onClick={onClick}
      aria-label={anomaly.title}
      className={cn(
        "absolute z-10 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform",
        colorClass,
        selected ? "scale-125 ring-[3px] ring-white ring-offset-2 ring-offset-transparent" : "hover:scale-110",
      )}
      style={{ top: `${anomaly.position.y}%`, left: `${anomaly.position.x}%` }}
    >
      <span
        className={cn(
          "absolute inset-0 animate-ping-marker rounded-full",
          colorClass,
          "opacity-50",
        )}
      />
      <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
    </button>
  );
}

function AnomalyDetail({ anomaly }: { anomaly: Anomaly }) {
  const pillStyle = severityPillClass(anomaly.severity);

  return (
    <div className="overflow-y-auto border-l-hairline border-line bg-surface px-7 py-8">
      <span className={cn("mb-4 inline-flex items-center gap-2 px-3 py-1.5 text-label-sm text-white", pillStyle)}>
        {anomaly.severity === "critical"
          ? "Anomalie critique"
          : anomaly.severity === "moderate"
            ? "Anomalie modérée"
            : "Point de vigilance"}
      </span>

      <h3 className="mb-3.5 font-serif text-[22px] font-bold leading-tight tracking-tight text-primary">
        {anomaly.title}
      </h3>

      <div className="mb-5 border-b-hairline border-line pb-4 font-mono text-[11.5px] text-on-surface-variant">
        {anomaly.legalRef}
      </div>

      <p className="mb-5.5 text-body-sm leading-relaxed text-on-surface">
        {anomaly.description}
      </p>

      <div className="mb-2 text-label-sm text-on-surface-variant">
        Sanction de référence
      </div>
      <div className="mb-5.5 border-l-2 border-secondary bg-surface-low px-4 py-3.5 text-[13px] leading-relaxed">
        <strong className="font-bold text-secondary">
          {anomaly.sanctionRef.name} — {anomaly.sanctionRef.amount} ({anomaly.sanctionRef.date})
        </strong>{" "}
        — {anomaly.sanctionRef.reason}
      </div>

      <div className="mb-2 text-label-sm text-on-surface-variant">
        Exposition estimée
      </div>
      <div className="border-hairline border-line p-5 text-center">
        <div className="mb-2.5 text-label-sm text-on-surface-variant">
          {anomaly.exposure.label}
        </div>
        <div className="font-serif text-[32px] font-extrabold tracking-[-0.02em] text-secondary">
          {anomaly.exposure.range}
        </div>
      </div>
    </div>
  );
}

function severityPillClass(severity: Severity): string {
  if (severity === "critical") return "bg-secondary";
  if (severity === "moderate") return "bg-secondary-bright";
  return "bg-tertiary-warm";
}
