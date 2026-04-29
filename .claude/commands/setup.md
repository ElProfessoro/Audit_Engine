---
description: Installation initiale du projet (dépendances + Playwright)
---

Installer toutes les dépendances et préparer l'environnement de développement.

Étapes à exécuter dans l'ordre :

1. `npm install` pour installer les dépendances Node
2. `npx playwright install chromium` pour installer le navigateur du scanner
3. Copier `.env.example` vers `.env.local` si ce dernier n'existe pas
4. Lancer `npm run typecheck` pour vérifier que tout compile
5. Lancer `npm run dev` et ouvrir http://localhost:3000

Si une étape échoue, expliquer l'erreur et proposer une solution avant de continuer.
