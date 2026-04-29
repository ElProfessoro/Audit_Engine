# Design System — Audit Engine

> Le design system est volontairement strict. Il s'inspire des magazines économiques haut de gamme (Le Monde Diplomatique, Financial Times Weekend, Monocle), pas des dashboards SaaS. **Avant d'introduire un nouveau composant ou une nouvelle couleur, vérifier qu'on ne peut pas faire avec l'existant.**

## Philosophie

L'outil est un **support de démo commerciale**, pas une application logicielle. Le prospect doit avoir l'impression de consulter un rapport éditorial, pas une interface SaaS. Cela se traduit par :

- Densité contrôlée : beaucoup d'espace blanc, hiérarchie typographique forte
- Pas d'effets gratuits (pas de gradients, pas de glassmorphism, pas d'ombres portées)
- Architecture rigoureuse : grille 12 colonnes, alignements stricts, lignes 0.5px

## Palette

### Surfaces (papier crème)

| Token | Hex | Usage |
|---|---|---|
| `surface` | `#fbf9fc` | Fond principal de l'application |
| `surface-low` | `#f5f3f6` | Zones secondaires, fonds de sections |
| `surface-container` | `#efedf0` | Cartes, conteneurs neutres |
| `surface-high` | `#e9e7eb` | Éléments sélectionnés, états actifs |

### Texte

| Token | Hex | Usage |
|---|---|---|
| `on-surface` | `#1b1b1e` | Corps de texte principal |
| `on-surface-variant` | `#44474e` | Texte secondaire, métadonnées |
| `outline` | `#75777f` | Texte tertiaire, hints |
| `outline-variant` | `#c5c6cf` | Bordures décoratives |

### Marque

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#0f2444` | Navy principal — boutons, titres, sidebar active |
| `primary-deep` | `#000e27` | Navy profond — hover sur primary, terminaux |
| `primary-light` | `#b4c7ef` | Navy clair — texte sur fond navy |
| `on-primary` | `#ffffff` | Texte sur fond primary |

### Accent (rouge brique CNIL)

| Token | Hex | Usage |
|---|---|---|
| `secondary` | `#b02d1d` | Alertes critiques, scores faibles, sanctions |
| `secondary-bright` | `#fd644e` | Alertes modérées, accents secondaires |

### Statuts

| Token | Hex | Usage |
|---|---|---|
| `success` | `#2e7d32` | Conforme, validé, score élevé |
| `warning` | `#c97a18` | Attention, score moyen |
| `tertiary-warm` | `#b08259` | Points de vigilance, accents éditoriaux |

### Lignes

| Token | Valeur | Usage |
|---|---|---|
| `line` | `rgba(15, 36, 68, 0.18)` | Séparateurs standards |
| `line-strong` | `rgba(15, 36, 68, 0.4)` | Bordures de cartes, séparateurs forts |

### Règle d'usage

- **80% surface + 15% navy + 5% accent.** L'écran ne doit jamais ressembler à un sapin de Noël.
- **Le rouge brique (`secondary`) est réservé aux alertes RGPD et aux chiffres de risque.** Pas pour décorer.
- **Le navy (`primary`) porte la voix institutionnelle.** Sidebars, boutons d'action, titres principaux.

## Typographie

3 typos seulement, chacune avec un rôle précis. **Ne pas en ajouter.**

### Fraunces (serif éditorial)

Voix éditoriale, autorité, gravité. Utilisée pour :
- Titres d'écrans (`text-display-xl`, 64px)
- Chiffres-clés (scores, montants, KPI)
- Noms de produits ou de packs

```tsx
<h1 className="font-serif text-display-xl text-primary">
  Projection de risque chiffrée
</h1>
```

### Manrope (sans-serif neutre)

Voix UI, lisibilité, modernité. Utilisée pour :
- Corps de texte (`text-body-md`, 16px)
- Labels d'interface (boutons, navigation)
- Badges et tags

```tsx
<p className="font-sans text-body-md text-on-surface">
  Le scan détecte 4 cookies publicitaires...
</p>
```

### IBM Plex Mono (monospace technique)

Voix data, technique, audit. Utilisée pour :
- Métadonnées (références, dates, IDs)
- Logs et terminaux
- Articles de loi (Article 82, RGPD Article 13)
- Domaines, codes NAF, références CNIL

```tsx
<div className="font-mono text-tech-md text-on-surface-variant">
  Réf. #2026-X042 · 14 octobre 2026
</div>
```

## Espacement

Système basé sur des multiples de 8px (Tailwind par défaut).

| Usage | Valeur |
|---|---|
| Padding interne d'une carte | `p-8` (32px) ou `p-10` (40px) |
| Gap entre sections | `space-y-12` (48px) ou `space-y-16` (64px) |
| Padding de page | `p-12` (48px) → `p-16` (64px) sur desktop |
| Margin gros bloc | `my-20` (80px) entre sections majeures |

## Composants

### Boutons

**Strictement rectangulaires** (border-radius: 0). Trois variantes :

```tsx
// Primary — action principale
<button className="bg-primary text-on-primary px-12 py-5 font-sans font-bold text-label-md uppercase tracking-[0.18em] hover:bg-primary-deep transition-colors">
  Lancer l'analyse
</button>

// Secondary — action alternative
<button className="border-hairline border-primary text-primary px-12 py-5 font-sans font-bold text-label-md uppercase tracking-[0.18em] hover:bg-primary hover:text-on-primary transition-colors">
  Recevoir le devis
</button>

// Tertiary — action discrète
<button className="text-primary border-b-hairline border-primary font-sans font-bold text-label-sm uppercase tracking-wider">
  Voir le détail
</button>
```

### Cartes

Lignes 0.5px, pas d'ombres, pas d'arrondis.

```tsx
<div className="bg-surface border-hairline border-line-strong p-10">
  {/* Contenu */}
</div>
```

### Pills / Tags

```tsx
<span className="inline-flex items-center gap-2 bg-secondary text-white px-3 py-1.5 font-sans font-bold text-label-sm uppercase">
  Anomalie critique
</span>
```

### Tables

Bordures 0.5px, header en navy, monospace dans les cellules de données.

```tsx
<table className="w-full border-collapse">
  <thead>
    <tr className="border-b-thin border-line-strong">
      <th className="text-left py-3 font-sans text-label-sm uppercase text-on-surface-variant">
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b-hairline border-line">
      <td className="py-4 font-mono text-tech-md">
        Bundle RGPD + Sécurité
      </td>
    </tr>
  </tbody>
</table>
```

### Jauge circulaire

Le SEUL endroit où on a un cercle complet (à part les marqueurs). SVG natif, pas de librairie.

```tsx
<svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
  <circle cx="100" cy="100" r="86" fill="none" stroke="#e9e7eb" strokeWidth="14" />
  <circle
    cx="100" cy="100" r="86"
    fill="none"
    stroke="#b02d1d"
    strokeWidth="14"
    strokeDasharray="540"
    strokeDashoffset={540 - (score / 100) * 540}
  />
</svg>
```

## Animations

**Sobres, fonctionnelles, jamais décoratives.**

### Quand animer

- Transition entre écrans (fade-in 400ms ease-out)
- Apparition d'une jauge (animation du `stroke-dashoffset` 1s ease)
- Pulse des marqueurs d'anomalies (ping infini)
- Curseur de terminal qui clignote

### Quand NE PAS animer

- Au scroll (pas de "scroll-reveal" gratuit)
- Au hover sur des cartes (juste un changement de border ou de background)
- Sur les boutons (transition de couleur uniquement, pas de scale ni de bounce)

### Framer Motion

À utiliser avec parcimonie. Les transitions natives CSS suffisent dans 80% des cas. Réserver Framer Motion à :
- L'orchestration de l'écran 2 (scan en cours, lignes qui apparaissent en cascade)
- Les transitions entre marqueurs sélectionnés sur l'écran 3
- L'animation de la balance sur l'écran 5

## Iconographie

**Lucide React** uniquement. Stroke 1.5, jamais 2.

```tsx
import { ArrowRight, ShieldCheck, Gavel } from "lucide-react";

<ArrowRight className="size-4 stroke-[1.5]" />
```

Pas de Material Icons (ils sont trop "Google"), pas d'emojis dans l'UI.

## Accessibilité

- Contraste minimum AA sur tous les textes (les tokens sont calibrés)
- `aria-label` obligatoire sur les boutons icon-only
- Navigation clavier complète (déjà implémentée dans `useKeyboardNavigation`)
- `prefers-reduced-motion` respecté (les animations longues sont désactivées)

## Erreurs fréquentes à éviter

❌ Utiliser `rounded-md` ou `rounded-lg` quelque part
❌ Ajouter `shadow-md` ou `shadow-lg`
❌ Utiliser des couleurs non listées dans la palette
❌ Mélanger plusieurs typos dans un même bloc (sauf rôles différents bien distincts)
❌ Animer au scroll
❌ Utiliser Material Icons ou des emojis dans l'UI

✅ Lignes 0.5px partout
✅ Espace blanc généreux
✅ Hiérarchie par la typo, pas par les couleurs
✅ Animations courtes (200-600ms) et naturelles
