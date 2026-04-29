/**
 * Types liés à la projection de risque financier (écran 5).
 * Ces données sont calculées à partir du ScanResult et de paramètres sectoriels.
 */

export interface RiskCard {
  /** Valeur principale affichée, ex: "15k — 75k €" ou "+35%/an" */
  value: string;
  description: string;
  /** Référence pour crédibiliser, ex: "Délibération SAN-2025-014" */
  reference: string;
}

export interface RiskProjection {
  cnil: RiskCard;
  insurance: RiskCard;
  b2b: RiskCard;
  /** Total agrégé, ex: "> 125 000 €" */
  totalExposure: string;
  /** Prix de l'audit, ex: "990 €" */
  auditPrice: string;
}
