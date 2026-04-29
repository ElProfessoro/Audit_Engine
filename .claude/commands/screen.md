---
description: Travailler sur un écran spécifique (1 à 6)
argument-hint: [numéro d'écran 1-6]
---

Travailler sur l'écran $ARGUMENTS de Audit Engine.

Avant de commencer :
1. Lire `docs/screens.md` à la section correspondante (chercher "## Écran $ARGUMENTS")
2. Lire `src/components/screens/Screen$ARGUMENTSXxxxx.tsx`
3. Vérifier les TODO Claude Code dans le fichier
4. Si le design est en cause, relire `docs/design-system.md`

Règles :
- Pas de modification de la palette ni des typos sans accord
- Utiliser uniquement les classes Tailwind avec les tokens du design system
- Respecter la règle des 0.5px pour les bordures
- Pas d'arrondis sauf cercles purs (jauges, marqueurs, status dots)
- Animations sobres, durées 200-600ms

Après modification :
- Lancer `npm run typecheck` pour vérifier les types
- Tester visuellement sur localhost:3000
- Commit avec message clair : `feat(screen-$ARGUMENTS): description courte`
