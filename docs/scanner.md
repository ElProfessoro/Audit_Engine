# Scanner Playwright — Spécification

## Principe

Le scanner est un **module autonome** qui analyse un site web public et produit un objet `ScanResult` typé. Il est conçu pour tourner :

1. **À la demande** via API Next.js (`POST /api/scan { url }`)
2. **En batch** via script CLI (`npm run scan:batch`) sur des listes de prospects
3. **En pré-RDV** automatiquement la veille du rendez-vous (workflow n8n)

## Ce que fait le scanner

### 1. Analyse des cookies (timing critique)

Le scanner navigue vers la page d'accueil du prospect et capture **la liste des cookies déposés AVANT toute interaction**. Si des cookies non-essentiels sont posés à ce stade, c'est un manquement direct (Article 82 LIL + recommandation CNIL 2020).

Catégorisation :
- **Essentiel** : session, CSRF, panier, langue → OK
- **Mesure d'audience exemptée** : Matomo en mode opt-out, AT Internet conforme → OK
- **Tracking publicitaire** : Meta Pixel, Google Ads, TikTok Pixel → FAIL si avant consentement
- **Analytics non-exemptés** : Google Analytics 4 par défaut → WARNING

### 2. Détection des scripts tiers

Liste tous les scripts chargés depuis des domaines tiers et les cross-référence avec une base de "trackers connus" maintenue dans `src/lib/scanner/known-trackers.ts`.

### 3. Bannière de consentement

Détecte la présence d'une bannière de cookies et analyse :
- A-t-elle un bouton "Tout refuser" au même niveau que "Accepter" ?
- Le visiteur peut-il revenir sur son choix après fermeture ?
- Y a-t-il une granularité par finalité ?

Méthode : recherche de patterns CSS/DOM connus (Axeptio, Didomi, OneTrust, Tarteaucitron, etc.) + heuristique sur les boutons visibles.

### 4. Politique de confidentialité

Récupère le contenu textuel de la page de politique (auto-détectée via les liens du footer) et vérifie la présence des éléments obligatoires :
- Identité du responsable de traitement
- Finalités du traitement
- Bases légales
- Durées de conservation
- Droits des personnes (accès, rectification, effacement, opposition)
- Modalités d'exercice de ces droits
- Information sur transferts hors UE
- Mention DPO si applicable

### 5. Formulaires

Énumère les `<form>` du site et vérifie :
- Présence d'une case à cocher de consentement RGPD
- Lien vers la politique de confidentialité à proximité
- Caractère facultatif/obligatoire des champs

## Ce que le scanner NE FAIT PAS

- ❌ Pas de scan intrusif (pas de tentative de connexion, pas de fuzzing, pas d'injection)
- ❌ Pas de scan de ports ouverts
- ❌ Pas d'analyse du code source côté serveur
- ❌ Pas de pentest

**Le scanner se comporte exactement comme un visiteur lambda.** Légalement équivalent à ce que fait Google ou un outil SEO. Aucune autorisation requise.

## Architecture

```
src/lib/scanner/
├── index.ts              # Entrée principale : scan(url) → ScanResult
├── browser.ts            # Setup du browser Playwright (singleton)
├── cookies.ts            # Capture et catégorisation des cookies
├── trackers.ts           # Détection scripts tiers + cross-référence
├── consent-banner.ts     # Détection et analyse bannière
├── privacy-policy.ts     # Parsing politique de confidentialité
├── forms.ts              # Énumération et analyse des formulaires
├── score.ts              # Calcul du score global et par domaine
├── known-trackers.ts     # Base de données des trackers connus
└── known-cmps.ts         # Base de données des Consent Management Platforms
```

## Contrat d'interface

### Entrée

```ts
interface ScanInput {
  url: string;             // URL complète avec https://
  options?: {
    timeout?: number;      // ms, défaut 30000
    waitForLoad?: boolean; // attendre networkidle, défaut true
    userAgent?: string;    // override
  };
}
```

### Sortie

```ts
interface ScanResult {
  domain: string;
  scannedAt: string;       // ISO 8601
  durationMs: number;

  cookies: {
    name: string;
    domain: string;
    type: "essential" | "analytics" | "advertising" | "unknown";
    deposedBeforeConsent: boolean;
    status: "pass" | "warning" | "fail";
  }[];

  thirdPartyScripts: {
    url: string;
    domain: string;
    category: string;
    knownTracker: boolean;
    status: "ok" | "warning" | "fail";
  }[];

  consentBanner: {
    detected: boolean;
    cmp?: string;              // "Axeptio", "Didomi", null...
    hasRefuseButton: boolean;
    refuseEqualToAccept: boolean;
    granularConsent: boolean;
  };

  privacyPolicy: {
    url: string | null;
    elementsFound: {
      controllerIdentity: boolean;
      purposes: boolean;
      legalBasis: boolean;
      retention: boolean;
      rights: boolean;
      transfers: boolean;
      dpoMention: boolean;
    };
    score: number;             // 0-100
  };

  forms: {
    path: string;
    fields: string[];
    hasConsentCheckbox: boolean;
    hasPolicyLink: boolean;
  }[];

  anomalies: Anomaly[];        // Liste générée à partir de tout ce qui précède
  scores: {
    global: number;
    breakdown: { label: string; value: number; severity: "low" | "mid" | "high" }[];
  };
}
```

## Stratégie de test

### Tests unitaires (Vitest)

- `tests/scanner/cookies.test.ts` — catégorisation des cookies à partir d'un objet figé
- `tests/scanner/privacy-policy.test.ts` — parsing texte avec inputs variés
- `tests/scanner/score.test.ts` — calcul du score avec différents scénarios

### Tests d'intégration (Playwright Test)

- `tests/scanner/integration/conformant.test.ts` — site connu conforme → scan doit retourner score >80
- `tests/scanner/integration/non-conformant.test.ts` — site connu non-conforme → scan doit lever les bons flags

Pour les tests d'intégration, on utilise des **pages HTML statiques** dans `tests/scanner/fixtures/` qui simulent différents niveaux de conformité. Pas d'appels réseau dans les tests, c'est trop fragile.

## Performance attendue

- Scan complet : **< 30 secondes par site**
- Mémoire : **< 500 Mo par scan** (Chromium est gourmand)
- Concurrence : 1 scan à la fois en MVP. En batch, paralléliser à 3-4 max.

## Mise en cache

Pour le MVP, pas de cache. En v2, on cachera 24h les résultats par URL pour éviter de re-scanner inutilement.

## Robustesse

Le scanner doit gérer :
- Sites en HTTPS uniquement (refuser HTTP)
- Redirections (suivre jusqu'à 5)
- Timeouts (échec gracieux après 30s)
- Erreurs JS sur le site (ne doivent pas planter le scan)
- Sites en SPA avec contenu chargé en JS (attendre `networkidle`)
- Sites en français ou en anglais (la politique peut être dans l'une ou l'autre langue)

## Mode debug

Variable d'env `SCANNER_DEBUG=1` :
- Conserve une capture d'écran de la page scannée dans `data/scans/<domain>-<timestamp>.png`
- Conserve le HAR (HTTP Archive) dans `data/scans/<domain>-<timestamp>.har`
- Logs verbeux dans la console

Utile pour debugger les faux positifs ou les sites qui résistent au scan.
