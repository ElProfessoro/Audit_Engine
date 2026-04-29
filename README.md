# Audit Engine

Outil de démonstration commerciale interactif pour les rendez-vous d'audit RGPD de **MSDN Consulting**.

> **Pour Claude Code :** lis d'abord `CLAUDE.md` à la racine, puis `docs/design-system.md` et `docs/screens.md`.

## Démarrage rapide

```bash
npm install
npx playwright install chromium
cp .env.example .env.local
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) — tu seras redirigé vers l'audit du prospect mock `RecrutExpert`.

## Stack

- **Next.js 15** App Router + Server Components
- **TypeScript strict**
- **Tailwind CSS 4** + design tokens custom
- **Framer Motion** pour les animations narratives
- **Zustand** pour l'état UI
- **Playwright** pour le scanner

## Structure

```
audit-engine/
├── CLAUDE.md                # Contexte projet pour Claude Code (à lire en premier)
├── .claude/                 # Configuration Claude Code (commandes slash, permissions)
├── docs/                    # Documentation projet
│   ├── design-system.md     # Tokens, composants, règles UI
│   ├── screens.md           # Spec UX des 6 écrans
│   ├── scanner.md           # Spec du scanner Playwright
│   └── strategy.md          # Contexte marché et commercial
├── src/
│   ├── app/                 # Routes Next.js (App Router)
│   ├── components/          # Composants React
│   │   ├── layout/          # Sidebar, Topbar, Shell
│   │   ├── screens/         # Les 6 écrans
│   │   └── ui/              # Atomes réutilisables
│   ├── lib/
│   │   ├── scanner/         # Module Playwright autonome
│   │   ├── data/            # Loaders de données
│   │   ├── store.ts         # Zustand store
│   │   └── utils.ts
│   ├── types/               # Types TS partagés
│   └── styles/              # CSS global et tokens
├── data/
│   ├── mocks/               # Prospects mockés pour le développement
│   └── scans/               # Résultats de scan persistés (gitignored)
├── scripts/                 # CLI : scan-cli.ts, scan-batch.ts
└── tests/                   # Tests Vitest + Playwright Test
```

## Commandes

| Commande | Description |
|---|---|
| `npm run dev` | Lance Next.js sur localhost:3000 |
| `npm run build` | Build production |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint |
| `npm run test` | Tests Vitest en mode watch |
| `npm run test:run` | Tests Vitest one-shot |
| `npm run scan -- <url>` | Lance le scanner CLI sur une URL |
| `npm run scan:batch` | Scanner batch sur `data/prospects.json` |
| `npm run format` | Prettier |

## Commandes Claude Code (slash)

- `/setup` — installation initiale du projet
- `/screen <num>` — travailler sur l'écran 1 à 6
- `/scanner` — travailler sur le module scanner
- `/check` — suite complète de vérifications avant commit

## Phase actuelle

**Phase 1 — En cours :** UI des 6 écrans avec données mockées. Tous les écrans sont fonctionnels avec le mock `data/mocks/recrutexpert.json`.

**Phase 2 :** brancher le scanner Playwright sur l'API `/api/scan`, remplacer le mock par les données réelles.

**Phase 3 :** persistance Postgres + Drizzle, gestion multi-prospects, intégration CRM.

## Comment fonctionne le parcours

L'utilisateur (Youssef, expert MSDN) lance la démo en partage d'écran avec un prospect en visio. Il navigue les 6 écrans dans l'ordre :

1. **Identification** — personnalisation immédiate avec nom + données du prospect
2. **Technical Scan** — animation théâtrale d'un scan en direct
3. **Data Mapping** — screenshot du site avec marqueurs d'anomalies cliquables
4. **Risk Assessment** — score de conformité et benchmark sectoriel
5. **Risk Projection** — chiffrage du risque vs coût de l'audit
6. **Final Quote** — sélection du pack et génération du devis

Navigation libre via sidebar, raccourcis clavier (← →, 1-6, F pour mode plein écran).

## Marque & identité

- **Cabinet :** MSDN Consulting
- **Produit :** Audit Engine
- **Tagline :** "Votre conformité RGPD validée en 48 heures"

⚠️ Ne jamais utiliser le naming "Lex Consulere" (ancien, abandonné).

---

© 2026 MSDN Consulting · Confidentiel
