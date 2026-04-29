---
description: Vérifications complètes avant commit
---

Lancer la suite complète de vérifications du code avant de commit.

Étapes :
1. `npm run typecheck` — vérifier les types TypeScript
2. `npm run lint` — vérifier les règles ESLint
3. `npm run test:run` — lancer tous les tests unitaires
4. `npm run build` — vérifier que la build production passe

Si une étape échoue, ne pas continuer aux suivantes. Réparer puis relancer.

Une fois tout vert, faire un commit avec un message respectant la convention :
- `feat(<scope>): description` pour une nouvelle fonctionnalité
- `fix(<scope>): description` pour un bug fix
- `refactor(<scope>): description` pour un refactor sans changement fonctionnel
- `docs: description` pour de la documentation
- `chore: description` pour de la maintenance

Scopes valides : `screen-1` à `screen-6`, `scanner`, `layout`, `store`, `types`, `api`, `tests`.
