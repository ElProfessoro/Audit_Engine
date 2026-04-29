# CLAUDE.md — Audit Engine

> Ce fichier est lu automatiquement par Claude Code à chaque session. Il contient le contexte produit, technique et les règles de travail. **À garder à jour quand des décisions structurantes sont prises.**

## Contexte produit

**Audit Engine** est un outil de démonstration commerciale interactif utilisé par MSDN Consulting (cabinet d'audit RGPD) pendant des rendez-vous visio de 20 minutes avec des dirigeants de PME françaises (30-150 salariés).

L'objectif de l'outil n'est PAS d'être un dashboard SaaS. C'est un **support de démonstration vivant** qui rejoue l'analyse RGPD du site du prospect en direct, révèle ses non-conformités, chiffre son risque, et propose une signature à la fin. Il est piloté en partage d'écran par Youssef (l'expert) pendant le RDV. Le prospect ne touche à rien, il regarde et réagit.

**KPI cible :** 25-30% de closing sur RDV tenu, contre 10% sans cet outil.

**Marché :** PME françaises, secteurs prioritaires e-commerce / recrutement / santé / associations. Voir `docs/strategy.md` pour les détails marché.

## Stack technique

- **Framework** : Next.js 15 (App Router, Server Components par défaut)
- **Langage** : TypeScript strict
- **Styling** : Tailwind CSS 4 + design tokens custom (voir `src/styles/tokens.css`)
- **Animations** : Framer Motion (réservé aux moments-clés de la démo)
- **Scanner** : Playwright (Chromium headless) — module `src/lib/scanner/`
- **State** : Zustand pour l'état global de la démo (écran actif, données prospect)
- **Validation** : Zod pour les schémas de données scanner et prospect
- **Tests** : Vitest pour les tests unitaires, Playwright Test pour le scanner

**Pas de base de données pour le MVP.** Les données prospect sont des fichiers JSON dans `data/mocks/`. La persistance (Postgres) viendra en v2 quand l'outil sera relié au CRM.

## Architecture

```
src/
├── app/
│   ├── (audit)/[ref]/        # Une route par audit, ex: /audit/2026-X042
│   │   ├── layout.tsx        # Sidebar + topbar + clavier global
│   │   ├── page.tsx          # Orchestrateur des 6 écrans
│   │   └── loading.tsx
│   ├── api/scan/route.ts     # POST /api/scan { url } → scan results
│   └── globals.css
├── components/
│   ├── layout/               # Sidebar, Topbar, ShortcutsOverlay
│   ├── screens/              # Un fichier par écran : Screen1Identification.tsx, etc.
│   └── ui/                   # Atomes réutilisables (Button, Card, Pill, Gauge, etc.)
├── lib/
│   ├── scanner/              # Module Playwright autonome
│   │   ├── index.ts
│   │   ├── cookies.ts
│   │   ├── trackers.ts
│   │   ├── privacy-policy.ts
│   │   └── score.ts
│   ├── data/                 # Helpers pour charger / valider les données prospect
│   └── utils.ts
├── types/                    # Types TS partagés (Prospect, ScanResult, Anomaly, etc.)
└── styles/
    └── tokens.css            # Design tokens (couleurs, typos, espacement)
```

## Conventions de code

### Général

- **TypeScript strict.** Pas de `any` sauf dans les coins moches du DOM (commenter pourquoi).
- **Pas de `console.log` en prod.** Utiliser le logger `src/lib/logger.ts` (à créer si besoin).
- **Imports relatifs courts** via les alias `@/` (configurés dans `tsconfig.json`).
- **Commentaires en français** pour la logique métier (le métier est en français : RGPD, CNIL, articles de loi). Commentaires techniques en anglais OK.

### Composants React

- **Server Components par défaut.** Ne passer en `"use client"` que quand on a besoin d'interactivité réelle (clavier, animations Framer Motion, état local).
- **Un fichier par composant** (sauf atomes ultra-simples regroupés dans `ui/atoms.tsx`).
- **Props typées explicitement** via une interface en haut du fichier (jamais en inline).
- **Pas de styled-components ni d'emotion.** Tailwind + classes utilitaires. Pour les designs complexes, on extrait des classes via `@apply` dans `tokens.css`.

### Naming

- Composants : `PascalCase.tsx` (ex: `Screen1Identification.tsx`)
- Hooks : `useCamelCase.ts` (ex: `useKeyboardNavigation.ts`)
- Utilitaires : `kebab-case.ts` (ex: `format-currency.ts`)
- Types : `PascalCase` exportés (ex: `interface Prospect`)
- Constantes : `SCREAMING_SNAKE_CASE`

### Style — règles design

Le design est volontairement **éditorial / magazine économique**, pas SaaS. Les règles non négociables :

- **Pas d'arrondis.** `border-radius: 0` partout sauf cercles purs (jauges, marqueurs, status dots).
- **Lignes 0.5px** pour les séparateurs (pas 1px).
- **3 typos seulement** : Fraunces (serif, titres + chiffres), Manrope (sans, corps + UI), IBM Plex Mono (technique + références).
- **Palette stricte** : voir `src/styles/tokens.css`. Ne pas ajouter de couleurs sans justification.
- **Animations sobres.** Pas de bounce, pas de spring exagéré. Easing naturel, durées 200-600ms.

## Le scanner Playwright

Le scanner est un **module autonome** dans `src/lib/scanner/` qui peut tourner :
- En mode standalone via `npm run scan -- https://example.com` (script CLI dans `scripts/scan-cli.ts`)
- En mode API via `POST /api/scan { url }`
- En mode batch pour pré-scanner les listes de prospection (voir `scripts/scan-batch.ts`)

**Sortie standardisée** : un objet `ScanResult` typé (`src/types/scan.ts`) qui alimente directement les 6 écrans. C'est le contrat d'interface entre le scanner et l'UI.

Le scanner ne fait PAS de pentest ni de scan intrusif. Il analyse uniquement :
1. Cookies posés avant interaction (timing critique)
2. Scripts tiers chargés (Google Analytics, Meta Pixel, Hotjar, etc.)
3. Bannière de consentement (présence, structure, bouton "Tout refuser")
4. Politique de confidentialité (parsing texte, recherche d'éléments obligatoires RGPD)
5. Formulaires (présence de case consentement)

Chaque détection produit une `Anomaly` typée avec : sévérité (critical/moderate/watch), article RGPD violé, sanction de référence, exposition estimée en €.

## Ne pas faire

- **Ne pas créer de tableaux de bord génériques** (`<Card>`, `<DashboardLayout>`, etc.). On ne fait pas un SaaS d'admin RGPD, on fait un outil de démo. Si tu hésites, c'est probablement non.
- **Ne pas réintroduire le naming "Lex Consulere".** La marque est MSDN Consulting, le produit est Audit Engine. Point.
- **Ne pas ajouter de logos clients ou de témoignages.** Le cabinet n'en a pas encore.
- **Ne pas ajouter de dépendance** sans la justifier. Stack volontairement minimal.
- **Ne pas modifier les tokens design** (couleurs, typos) sans en parler. Le design system est validé.

## Fichiers à toujours lire avant de commencer

1. Ce fichier (`CLAUDE.md`)
2. `docs/design-system.md` — le détail du design system, palettes, typos, composants
3. `docs/screens.md` — la spec UX des 6 écrans (contenu, interactions, transitions)
4. `docs/strategy.md` — contexte marché et commercial (utile pour les copies, les chiffres de référence)

## Commandes utiles

```bash
npm run dev              # Lance Next.js sur localhost:3000
npm run scan -- <url>    # Lance le scanner CLI sur une URL
npm run scan:batch       # Scanner batch sur data/mocks/prospects.json
npm run test             # Tests Vitest
npm run test:scanner     # Tests Playwright du scanner
npm run lint             # ESLint
npm run typecheck        # TypeScript
npm run build            # Build production
```

## État actuel du projet

**Phase 1 — En cours :** UI des 6 écrans avec données mockées. Tous les écrans sont codés et fonctionnels avec le mock `data/mocks/recrutexpert.json`.

**Phase 2 — À venir :** brancher le scanner Playwright sur l'API `/api/scan`, remplacer le mock par des données réelles.

**Phase 3 — Plus tard :** persistance (Postgres + Drizzle), gestion multi-prospects, intégration CRM (Pipedrive ou HubSpot via webhook).

## Quand demander à Youssef avant d'agir

- Changement de la palette ou des typos
- Ajout d'un nouvel écran ou suppression d'un existant
- Modification du flow commercial (l'ordre des écrans est calé sur le pitch de RDV)
- Ajout d'une dépendance lourde (>500 ko)
- Choix d'un service tiers (CRM, signature électronique, paiement)

Pour le reste — refactor, fix, optimisation, tests, ajout de features sur des écrans existants — Claude Code peut décider et avancer en autonomie. Toujours commiter par petits pas avec des messages clairs.
