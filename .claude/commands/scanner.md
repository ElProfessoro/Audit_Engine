---
description: Travailler sur le scanner Playwright
---

Travailler sur le module scanner dans `src/lib/scanner/`.

Avant de commencer :
1. Lire `docs/scanner.md` pour la spec complète
2. Vérifier les TODO Claude Code dans les fichiers du module scanner
3. Lire le contrat d'interface `src/types/scan.ts`

Règles importantes :
- Le scanner ne fait JAMAIS de scan intrusif (pas de pentest, pas de fuzzing, pas de tentative de connexion)
- Comportement = visiteur lambda. Aucune autorisation requise.
- Refuser les URLs en HTTP, exiger HTTPS
- Timeout par défaut : 30 secondes
- Le scanner doit gérer gracieusement les erreurs JS du site scanné
- Toutes les détections produisent des `Anomaly` typées

Tester le scanner :
- En CLI : `npm run scan -- https://exemple.fr`
- Via tests : `npm run test`
- Sur fixtures locales : créer des HTML statiques dans `tests/scanner/fixtures/`

Après modification :
- `npm run typecheck`
- Tester sur 2-3 sites réels variés (un conforme, un mid, un non-conforme)
- Commit : `feat(scanner): description`
