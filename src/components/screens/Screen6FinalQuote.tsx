"use client";

import { Mail, PenLine, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Prospect } from "@/types";
import { cn, formatEuros } from "@/lib/utils";

interface Screen6Props {
  prospect: Prospect;
}

const PACKAGES = {
  express: {
    name: "Audit RGPD Express",
    price: 990,
    priceLabel: "HT · forfait",
    features: [
      "Cartographie des traitements majeurs",
      "Rapport de conformité initial",
      "Plan d'action prioritaire",
      "Livraison sous 48h",
    ],
  },
  bundle: {
    name: "Bundle RGPD",
    accent: "+ Sécurité",
    price: 1790,
    priceLabel: "HT · forfait",
    badge: "Le plus choisi",
    features: [
      "Tout inclus dans Express",
      "Scan de vulnérabilités technique",
      "Registre de traitements complet",
      "Revue des contrats sous-traitants",
      "Dossier prêt pour assurance cyber",
    ],
  },
  continue: {
    name: "Conformité Continue",
    price: 190,
    priceLabel: "/ mois",
    features: [
      "Veille réglementaire personnalisée",
      "Mise à jour trimestrielle du registre",
      "Scan mensuel automatique",
      "Support prioritaire",
    ],
  },
} as const;

export function Screen6FinalQuote({ prospect }: Screen6Props) {
  const { selectedPackage, hasContinue, selectPackage, toggleContinue } =
    useAppStore();
  const { identity } = prospect;

  const mainPkg = PACKAGES[selectedPackage];
  const continuePkg = PACKAGES.continue;

  const totalHT = mainPkg.price;
  const tva = Math.round(totalHT * 0.2);
  const totalTTC = totalHT + tva;

  return (
    <section className="px-16 py-14 pb-20">
      <h1 className="text-display-xl mb-4 text-primary">Sélection des services</h1>
      <p className="text-body-lg mb-8 max-w-3xl text-on-surface-variant">
        Configurez votre niveau d&apos;intervention pour générer la proposition
        commerciale finale.
      </p>
      <div className="mb-12 h-[0.5px] bg-line-strong" />

      {/* Cartes pricing */}
      <div className="mb-14 grid grid-cols-3 gap-6">
        <PricingCard
          pkg="express"
          selected={selectedPackage === "express"}
          onSelect={() => selectPackage("express")}
        />
        <PricingCard
          pkg="bundle"
          selected={selectedPackage === "bundle"}
          onSelect={() => selectPackage("bundle")}
        />
        <PricingCard
          pkg="continue"
          selected={hasContinue}
          onSelect={toggleContinue}
          dashed
        />
      </div>

      {/* Document devis */}
      <div className="mb-8 border-hairline border-line-strong bg-white px-16 py-14">
        <div className="mb-9 grid grid-cols-2 gap-10 border-b-thin border-line-strong pb-7">
          <div>
            <div className="mb-4.5 font-serif text-[36px] font-extrabold leading-tight tracking-[-0.02em] text-primary">
              Proposition
              <br />
              commerciale
            </div>
            <div className="font-mono text-[12px] leading-relaxed text-on-surface-variant">
              Réf : Devis n°{identity.ref.replace("X", "A")}
              <br />
              Date : 14 octobre 2026
              <br />
              Validité : 30 jours
            </div>
          </div>
          <div className="text-right">
            <div className="mb-3 font-serif text-[22px] font-bold leading-tight text-primary">
              {identity.name}
            </div>
            <div className="font-mono text-[12px] leading-relaxed text-on-surface-variant">
              {identity.address.street}
              <br />
              {identity.address.postalCode} {identity.address.city}, {identity.address.country}
              <br />
              Attn : {identity.contact.name}, {identity.contact.title}
            </div>
          </div>
        </div>

        <table className="mb-8 w-full border-collapse">
          <thead>
            <tr className="border-b-thin border-line-strong">
              <th className="py-3.5 text-left text-label-sm text-on-surface-variant">
                Description des services
              </th>
              <th className="py-3.5 text-right text-label-sm text-on-surface-variant">
                Qté
              </th>
              <th className="py-3.5 text-right text-label-sm text-on-surface-variant">
                Prix U. HT
              </th>
              <th className="py-3.5 text-right text-label-sm text-on-surface-variant">
                Total HT
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b-hairline border-line">
              <td className="py-4.5">
                <div className="text-body-sm font-semibold">{mainPkg.name}</div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-on-surface-variant">
                  {mainPkg.features.slice(0, 3).join(", ")}. Livraison sous 48h.
                </div>
              </td>
              <td className="py-4.5 text-right font-mono text-[13px]">1.00</td>
              <td className="py-4.5 text-right font-mono text-[13px]">
                {formatEuros(mainPkg.price)}
              </td>
              <td className="py-4.5 text-right font-mono text-[13px]">
                {formatEuros(mainPkg.price)}
              </td>
            </tr>
            {hasContinue && (
              <tr className="border-b-hairline border-line">
                <td className="py-4.5">
                  <div className="text-body-sm font-semibold">
                    {continuePkg.name}
                  </div>
                  <div className="mt-1 text-[12.5px] leading-relaxed text-on-surface-variant">
                    Suivi mensuel, sans engagement de durée.
                  </div>
                </td>
                <td className="py-4.5 text-right font-mono text-[13px]">12.00</td>
                <td className="py-4.5 text-right font-mono text-[13px]">
                  {formatEuros(continuePkg.price)}
                </td>
                <td className="py-4.5 text-right font-mono text-[13px]">
                  {formatEuros(continuePkg.price * 12)}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex flex-col items-end gap-2.5">
          <div className="flex items-baseline gap-15 font-mono text-[13px]">
            <span>Total HT</span>
            <span className="ml-15 w-30 text-right">{formatEuros(totalHT + (hasContinue ? continuePkg.price * 12 : 0))}</span>
          </div>
          <div className="flex items-baseline gap-15 font-mono text-[13px]">
            <span>TVA (20%)</span>
            <span className="ml-15 w-30 text-right">
              {formatEuros(Math.round((totalHT + (hasContinue ? continuePkg.price * 12 : 0)) * 0.2))}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-15 border-t-thin border-line-strong pt-3 font-serif text-[22px] font-extrabold tracking-[-0.01em] text-primary">
            <span className="text-label-md font-sans">Total TTC</span>
            <span className="ml-15 w-30 text-right">
              {formatEuros(
                Math.round(
                  (totalHT + (hasContinue ? continuePkg.price * 12 : 0)) * 1.2,
                ),
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-2">
        <button className="inline-flex items-center gap-3 border-hairline border-primary bg-white px-8 py-4.5 text-primary text-label-sm transition-colors hover:bg-surface-low">
          <Mail className="size-4 stroke-[1.5]" />
          Recevoir le devis par email
        </button>
        <button className="inline-flex items-center gap-3 bg-primary px-8 py-4.5 text-white text-label-sm transition-colors hover:bg-primary-deep">
          <PenLine className="size-4 stroke-[1.5]" />
          Signer maintenant
        </button>
      </div>
    </section>
  );
}

function PricingCard({
  pkg,
  selected,
  onSelect,
  dashed,
}: {
  pkg: keyof typeof PACKAGES;
  selected: boolean;
  onSelect: () => void;
  dashed?: boolean;
}) {
  const data = PACKAGES[pkg];
  const badge = "badge" in data ? data.badge : undefined;
  const accent = "accent" in data ? data.accent : undefined;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative flex cursor-pointer flex-col border-hairline px-7 py-8 transition-colors",
        dashed
          ? "border-dashed border-outline-variant"
          : selected
            ? "border-[1.5px] border-primary bg-surface-high"
            : "border-line-strong bg-surface hover:border-primary",
      )}
    >
      {badge && (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-primary px-3.5 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-white">
          {badge}
        </span>
      )}

      <div className="mb-1.5 font-serif text-[24px] font-bold leading-tight tracking-tight text-primary">
        {data.name}
        {accent && <span className="ml-1 text-secondary">{accent}</span>}
      </div>

      <div className="mb-7 border-b-hairline border-line pb-4.5 font-serif">
        <span className="text-[22px] font-extrabold">
          {pkg === "continue" ? "+" : ""}
          {formatEuros(data.price)}
        </span>{" "}
        <span className="text-[14px] font-medium text-on-surface-variant">
          {data.priceLabel}
        </span>
      </div>

      <ul className="mb-7 flex-1 space-y-2.5">
        {data.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-body-sm">
            <Check className="mt-0.5 size-4 shrink-0 stroke-[2] text-success" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={cn(
          "border-hairline px-3.5 py-3.5 text-label-sm transition-colors",
          dashed
            ? "border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-high hover:text-primary"
            : selected
              ? "border-primary bg-primary text-white"
              : "border-primary text-primary hover:bg-primary hover:text-white",
        )}
      >
        {dashed
          ? selected
            ? "✓ Option ajoutée"
            : "+ Ajouter l'option"
          : selected
            ? "Sélectionné"
            : "Sélectionner"}
      </button>
    </div>
  );
}
