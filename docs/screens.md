# Spécification des 6 écrans

> Les 6 écrans suivent un **parcours commercial chronologique** : identification → preuve technique → preuve visuelle → diagnostic → projection financière → closing. **L'ordre est calé sur le pitch de RDV de 20 minutes et ne doit pas être modifié sans en parler à Youssef.**

## Timing pendant le RDV (20 min)

| Écran | Durée cible | Moment commercial |
|---|---|---|
| 1 — Identification | 30 sec | Entrée en matière, personnalisation |
| 2 — Technical Scan | 2-3 min | "Voici ce qu'on a trouvé" |
| 3 — Data Mapping | 5-7 min | Le cœur de la conviction |
| 4 — Risk Assessment | 2-3 min | Mise en perspective |
| 5 — Risk Projection | 3-4 min | Bascule émotionnelle |
| 6 — Final Quote | 3-5 min | Closing |

Chaque écran doit pouvoir tenir dans son créneau **sans précipitation**, et permettre à Youssef de s'attarder sur les zones d'intérêt si le prospect réagit. La navigation est libre (←/→, 1-6, sidebar).

---

## Écran 1 — Identification

**Route :** `/audit/[ref]` (écran par défaut)

**Objectif commercial :** poser le sérieux du cabinet et personnaliser instantanément. Le prospect doit voir son nom à l'écran dans les 2 secondes.

### Contenu

- En haut à droite : tag "Audit préliminaire", référence (`#2026-X042`), date du jour
- Au centre : monogramme typographique 180×180px avec les initiales du prospect en Fraunces 72px
- Sous le monogramme : nom de la société en Fraunces 80px, navy
- Tableau 4 colonnes : Domaine | Code NAF | Effectif | Implantation
- Bouton "Lancer l'analyse" en navy plein
- Disclaimer mono en bas

### Interactions

- Bouton "Lancer l'analyse" → écran 2
- Pas d'animation au chargement (déjà en place quand le RDV commence)

### Données nécessaires

```ts
interface ProspectIdentity {
  ref: string;              // "#2026-X042"
  name: string;             // "RecrutExpert S.A.S."
  initials: string;         // "RE" (généré automatiquement depuis name)
  domain: string;           // "recrutexpert.fr"
  nafCode: string;          // "7810Z"
  nafLabel: string;         // "Recrutement"
  headcount: number;        // 85
  region: string;           // "Auvergne-Rhône-Alpes"
}
```

---

## Écran 2 — Technical Scan

**Objectif commercial :** créer le "wow" technique. Le prospect doit voir une analyse en train de tourner sur son site, en direct.

### Contenu

Layout split 50/50 :

**Gauche (terminal navy plein écran) :**
- Métadonnées du scan (target, timestamp, mode)
- Lignes de log qui apparaissent en cascade :
  - `> INITIATING SEQUENCE...`
  - `> RESOLVING DNS... [OK]`
  - `> ENUMERATING COOKIES... [OK]`
  - Liste indentée des cookies avec statuts `[PASS]` / `[WARNING]` / `[FAIL]`
  - `> SCANNING THIRD-PARTY SCRIPTS...`
  - Liste des scripts détectés
  - `> PARSING PRIVACY POLICY...`
  - `> ANALYZING FORMS...`
  - Curseur clignotant à la fin

**Droite (papier crème) :**
- Titre "Analyse en cours" / "Phase 3/4"
- Radar circulaire animé (sweep qui tourne, blips colorés)
- 3 compteurs : Cookies détectés (42), Scripts tiers (18), Formulaires (03)
- Bouton "Voir le rapport" en bas

### Interactions

- Animation au chargement : les lignes du terminal apparaissent une par une (50-100ms entre chaque)
- Le radar tourne en continu
- L'animation peut être skippée par espace ou clic n'importe où
- Bouton "Voir le rapport" → écran 3

### Données

```ts
interface ScanProgress {
  domain: string;
  timestamp: string;
  cookies: { name: string; type: string; status: "pass" | "warning" | "fail" }[];
  thirdPartyScripts: { url: string; status: "ok" | "warning" | "fail" }[];
  privacyPolicy: { hasArticle13: boolean; hasOptOut: boolean; hasRetention: boolean };
  forms: { path: string; hasConsent: boolean }[];
}
```

---

## Écran 3 — Data Mapping (cartographie des anomalies)

**Objectif commercial :** LE cœur de la démo. Le prospect voit son propre site avec des marqueurs rouges. Plus aucune objection "on est conforme" ne tient.

### Contenu

Layout split : screenshot du site à gauche, panneau de détail à droite.

**Barre supérieure :**
- "Anomalies détectées :"
- 3 critiques (rouge) | 2 modérées (orange) | 4 points de vigilance (jaune-doré)

**Zone screenshot (gauche, fond navy):**
- Capture du site du prospect (pour le mock : on simule un site fictif réaliste)
- Marqueurs circulaires animés (ping qui pulse) positionnés sur les zones problématiques
- 3 niveaux de gravité par couleur : `secondary` (rouge), `secondary-bright` (orange), `tertiary-warm` (doré)
- Au clic sur un marqueur : il devient sélectionné (outline blanc), le panneau droit se met à jour

**Panneau de détail (droite) :**
- Pill de gravité ("Anomalie critique")
- Titre de l'anomalie en Fraunces
- Métadonnées (article RGPD, source légale) en mono
- Texte d'explication en français simple
- Encart "Sanction de référence" (border-left rouge) avec sanction CNIL réelle du même secteur
- Encart "Exposition estimée" avec montant en euros

### Interactions

- Clic sur un marqueur → mise à jour du panneau droit (pas de navigation, reste sur l'écran)
- Le marqueur sélectionné a une scale de 1.25 + outline blanc
- Animation ping continue sur tous les marqueurs (pulse)

### Données

```ts
interface Anomaly {
  id: string;
  severity: "critical" | "moderate" | "watch";
  title: string;
  legalRef: string;          // "Article 82 · Loi Informatique et Libertés"
  description: string;       // texte explicatif
  position: { x: number; y: number };  // pourcentages 0-100
  sanctionRef: {
    name: string;            // "SHEIN"
    amount: string;          // "150 M€"
    date: string;            // "juillet 2025"
    reason: string;
  };
  exposure: {
    label: string;           // "Procédure simplifiée CNIL"
    range: string;           // "15 000 — 20 000 €"
  };
}
```

---

## Écran 4 — Risk Assessment (score)

**Objectif commercial :** matérialiser visuellement la position du prospect par rapport au marché. Crée la pression sociale.

### Contenu

3 blocs côte à côte :

**Bloc 1 — Indice global :**
- Jauge circulaire SVG animée (de 0 vers le score réel sur 1s)
- Score en Fraunces 64px en rouge
- "/ 100" en mono dessous
- Tag "Risque élevé" en navy plein

**Bloc 2 — Ventilation par domaine :**
- 4 barres horizontales animées :
  - Site web public : 32% (rouge)
  - Documentation interne : 65% (vert)
  - Sécurité organisationnelle : 58% (orange)
  - Sous-traitance & DPA : 28% (rouge)
- Score à droite de chaque barre, code couleur selon valeur

**Bloc 3 — Benchmark sectoriel :**
- Visualisation scatter horizontale 0-100
- 4 points :
  - "Vous" (47/100) en rouge, plus gros
  - "Secteur RH" (54/100) en orange
  - "National" (61/100) en gris
  - "Cible" (85/100) en vert
- Légende 0 / 50 / 100 en bas

**Callout en dessous :**
- Encadré avec icône info
- "Votre score vous place dans le tiers inférieur des entreprises de votre secteur. Les manquements détectés sur le site public — la zone la plus exposée à un signalement externe ou à un contrôle CNIL — sont les premiers à corriger."

### Interactions

- Animations au chargement de l'écran : jauge qui monte (1s), barres qui se remplissent (cascade 100ms entre chaque), points scatter qui apparaissent en fade-in

### Données

```ts
interface ScoreData {
  global: number;            // 47
  breakdown: {
    label: string;
    value: number;
    severity: "low" | "mid" | "high";
  }[];
  benchmarks: {
    you: number;
    sector: number;
    sectorLabel: string;     // "Secteur RH"
    national: number;
    target: number;
  };
}
```

---

## Écran 5 — Risk Projection (projection chiffrée)

**Objectif commercial :** la bascule émotionnelle. Le prospect doit voir l'écart entre l'exposition (€€€) et le coût de l'audit (990€).

### Contenu

**3 cartes côte à côte (haut) :**

1. **Risque CNIL** — icône `gavel`
   - Valeur : `15k — 75k €` en Fraunces 56px rouge
   - Texte : "Pénalité moyenne estimée en cas de contrôle..."
   - Réf : "Délibération SAN-2025-014"

2. **Surcoût assurance cyber** — icône `shield`
   - Valeur : `+35% /an` en rouge
   - Texte : "Majoration de prime estimée..."
   - Réf : "Source : Questionnaires assureurs 2025-2026"

3. **Risque contractuel B2B** — icône `handshake`
   - Valeur : `25%` en rouge
   - Texte : "Volume d'appels d'offres inaccessibles..."
   - Réf : "Impact CA direct"

**Bloc balance (bas) :**

Layout grid 2fr / auto / 1fr :

- **Gauche (navy plein) :**
  - "Exposition annuelle estimée"
  - `> 125 000 €` en Fraunces 72px rose pâle (#ffd2c9)
  - Encadré warning : "Avertissement : ce calcul agrège les risques..."

- **Centre (navy profond, étroit) :**
  - Icône balance massive en demi-opacité

- **Droite (gris clair) :**
  - "Audit MSDN Consulting"
  - `990 €` en Fraunces 56px navy
  - "Investissement initial"
  - Bouton "Démarrer la remédiation" → écran 6

### Interactions

- Au chargement : les 3 chiffres principaux s'animent (count-up de 0 vers la valeur)
- Bouton "Démarrer la remédiation" → écran 6

### Données

```ts
interface RiskProjection {
  cnil: { range: string; description: string; reference: string };
  insurance: { value: string; description: string; reference: string };
  b2b: { value: string; description: string; reference: string };
  totalExposure: string;     // "> 125 000 €"
  auditPrice: string;        // "990 €"
}
```

---

## Écran 6 — Final Quote (closing)

**Objectif commercial :** transformer l'intention en signature. Le prospect voit "son" devis se construire.

### Contenu

**Cartes pricing (haut) :**

3 cartes côte à côte :
- **Audit RGPD Express** — 990 € HT (sélectionnable, par défaut non sélectionné)
- **Bundle RGPD + Sécurité** — 1 790 € HT (sélectionné par défaut, badge "Le plus choisi")
- **Conformité Continue** — +190 € / mois (option dashed, ajoutable en complément)

Chaque carte : nom, prix, liste de 4-5 features avec check vert, bouton "Sélectionner".

**Document devis (milieu) :**

Mise en forme "vraie facture papier" :
- Header : "PROPOSITION COMMERCIALE" / "RecrutExpert S.A.S." (à droite, infos client)
- Méta : Réf, Date, Validité
- Tableau : Description | Qté | Prix U. HT | Total HT
- Totaux : HT, TVA 20%, TTC
- Le tableau se met à jour dynamiquement selon les cartes sélectionnées

**Actions (bas) :**
- "Recevoir le devis par email" (secondary)
- "Signer maintenant" (primary, navy)

### Interactions

- Clic sur une carte pricing : sélectionne le pack (déselectionne les autres pour Express/Bundle, toggle pour Continue)
- Le devis se reconstruit automatiquement
- "Signer maintenant" : pour le MVP, ouvre une modale "Devis envoyé pour signature" (pas de vraie signature électronique en phase 1)

### Données

```ts
interface PricingPackage {
  id: "express" | "bundle" | "continue";
  name: string;
  accent?: string;           // "+ Sécurité"
  price: number;
  priceLabel: string;        // "HT · forfait" ou "/ mois"
  features: string[];
  isAddon?: boolean;         // pour "Conformité Continue"
  badge?: string;            // "Le plus choisi"
}

interface QuoteState {
  selectedMain: "express" | "bundle";
  hasContinue: boolean;
  client: {
    name: string;
    address: string;
    contact: string;
  };
}
```

---

## Navigation globale

### Sidebar (gauche)

Présente sur tous les écrans (sauf en mode présentation `F`).

- Logo MSDN + "MSDN Consulting" / "Cabinet conformité"
- Label "Audit Engine" / "v.24.1 · Compliance"
- 6 items de navigation numérotés (01 à 06)
- Footer : Export Findings, Shortcuts, Mode présentation

### Top bar

- "Audit Engine" à gauche (Fraunces)
- "Live audit status" (point pulsant rouge) + bell + avatar à droite

### Raccourcis clavier (toujours actifs)

| Touche | Action |
|---|---|
| `←` `→` | Écran précédent / suivant |
| `1` à `6` | Saut direct vers l'écran |
| `F` | Mode présentation (sidebar masquée) |
| `?` | Toggle l'overlay raccourcis |
| `Esc` | Ferme l'overlay |
| `Espace` | Rejoue l'animation de l'écran courant (uniquement écran 2) |

---

## Responsive

L'outil est **prioritairement desktop** (utilisé en partage d'écran depuis un Mac/PC). Le responsive mobile existe mais n'est pas une priorité pour le MVP.

Breakpoint principal : `< 1100px` → la sidebar disparaît, les colonnes passent en pile verticale.
