/**
 * Types liés au prospect en cours d'audit.
 * Un prospect est l'entité commerciale (la PME) qu'on est en train de pitcher.
 */

export interface ProspectIdentity {
  /** Référence unique de l'audit, ex: "2026-X042" */
  ref: string;
  /** Raison sociale */
  name: string;
  /** Initiales générées (2 lettres en capitales) — utilisées pour le monogramme */
  initials: string;
  /** Domaine sans https://, ex: "recrutexpert.fr" */
  domain: string;
  /** Code NAF, ex: "7810Z" */
  nafCode: string;
  /** Libellé du code NAF, ex: "Recrutement" */
  nafLabel: string;
  /** Effectif (nombre de collaborateurs) */
  headcount: number;
  /** Région administrative */
  region: string;
  /** Adresse postale (utilisée sur le devis final) */
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  /** Contact principal pour le devis */
  contact: {
    name: string;
    title: string;
  };
}

/**
 * Le prospect complet : identité + résultats du scan.
 * C'est l'objet que les composants reçoivent.
 */
export interface Prospect {
  identity: ProspectIdentity;
  scan: import("./scan").ScanResult;
  riskProjection: import("./risk").RiskProjection;
}
