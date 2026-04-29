"use client";

import { Gavel, Shield, Handshake, ArrowRight, Scale } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Prospect } from "@/types";

interface Screen5Props {
  prospect: Prospect;
}

/**
 * Écran 5 — Projection de risque chiffrée
 *
 * TODO Claude Code :
 * - Animer le count-up des chiffres principaux au mount
 * - Optionnel : ajouter un bouton "Et si je ne fais rien ?" qui déclenche
 *   une animation 12 mois (la balance se déséquilibre progressivement)
 */
export function Screen5RiskProjection({ prospect }: Screen5Props) {
  const { setScreen } = useAppStore();
  const { riskProjection } = prospect;

  return (
    <section className="px-16 py-14 pb-20">
      <h1 className="text-display-xl mb-4 text-primary">
        Projection de risque chiffrée
      </h1>
      <p className="text-body-lg mb-8 max-w-3xl text-on-surface-variant">
        Analyse des impacts financiers immédiats liés aux non-conformités
        identifiées lors du scan technique.
      </p>
      <div className="mb-12 h-[0.5px] bg-line-strong" />

      {/* 3 cartes de risque */}
      <div className="mb-8 grid grid-cols-3 gap-px border-hairline border-line bg-line">
        <RiskCard
          label="Risque CNIL"
          icon={<Gavel className="size-[22px] stroke-[1.5]" />}
          value={riskProjection.cnil.value}
          description={riskProjection.cnil.description}
          reference={`Réf. ${riskProjection.cnil.reference}`}
        />
        <RiskCard
          label="Surcoût assurance cyber"
          icon={<Shield className="size-[22px] stroke-[1.5]" />}
          value={riskProjection.insurance.value}
          description={riskProjection.insurance.description}
          reference={riskProjection.insurance.reference}
        />
        <RiskCard
          label="Risque contractuel B2B"
          icon={<Handshake className="size-[22px] stroke-[1.5]" />}
          value={riskProjection.b2b.value}
          description={riskProjection.b2b.description}
          reference={riskProjection.b2b.reference}
        />
      </div>

      {/* Balance */}
      <div className="grid grid-cols-[2fr_auto_1fr]">
        {/* Gauche - exposition */}
        <div className="bg-primary px-14 py-12 text-white">
          <div className="mb-4 text-label-md text-primary-light">
            Exposition annuelle estimée
          </div>
          <div className="font-serif text-[72px] font-extrabold leading-none tracking-[-0.04em]" style={{ color: "#ffd2c9" }}>
            {riskProjection.totalExposure.replace("€", "")}
            <span className="ml-2 text-[40px] opacity-85">€</span>
          </div>
          <div className="mt-6 border-l-2 border-primary-light px-4 py-3.5 font-mono text-[11.5px] leading-relaxed text-primary-light opacity-85">
            Avertissement : ce calcul agrège les risques réglementaires,
            assurantiels et commerciaux sur une période fiscale de 12 mois. Il
            n&apos;inclut pas l&apos;atteinte à la réputation.
          </div>
        </div>

        {/* Centre - balance */}
        <div className="flex w-20 items-center justify-center bg-primary-deep">
          <Scale className="size-9 stroke-[1.2] text-primary-light opacity-40" />
        </div>

        {/* Droite - prix */}
        <div className="bg-surface-high px-14 py-12 text-right">
          <div className="mb-4 text-label-md text-on-surface-variant">
            Audit MSDN Consulting
          </div>
          <div className="font-serif text-[56px] font-extrabold leading-none tracking-[-0.04em] text-primary">
            {riskProjection.auditPrice.replace("€", "")}
            <span className="ml-1 text-[32px] opacity-70">€</span>
          </div>
          <div className="mt-3 font-mono text-[11.5px] text-on-surface-variant">
            Investissement initial
          </div>
          <button
            onClick={() => setScreen(6)}
            className="mt-6 inline-flex items-center gap-3 border-hairline border-primary px-6 py-3.5 text-primary text-label-sm transition-colors hover:bg-primary hover:text-white"
          >
            Démarrer la remédiation
            <ArrowRight className="size-4 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}

function RiskCard({
  label,
  icon,
  value,
  description,
  reference,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  description: string;
  reference: string;
}) {
  return (
    <div className="flex min-h-[360px] flex-col bg-surface px-8 py-9">
      <div className="mb-8 flex items-center justify-between border-b-hairline border-line pb-3.5">
        <div className="text-label-md text-primary">{label}</div>
        <div className="text-secondary">{icon}</div>
      </div>

      <div className="mb-6 font-serif text-[56px] font-extrabold leading-none tracking-[-0.04em] text-secondary">
        {value}
      </div>

      <p className="text-body-sm mb-6 flex-1 leading-relaxed text-on-surface">
        {description}
      </p>

      <div className="self-start border-hairline border-line px-3.5 py-2.5 font-mono text-[11.5px] text-on-surface-variant">
        {reference}
      </div>
    </div>
  );
}
