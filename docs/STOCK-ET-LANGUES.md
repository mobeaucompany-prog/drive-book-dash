# Stock et langues — mise en service

Aucun crédit Lovable AI nécessaire. Le code peut être intégré via GitHub.

## Base partagée

Exécuter une seule fois `supabase/migrations/20261026010000_tyre_inventory.sql` dans l’éditeur SQL de la base Supabase/Lovable Cloud du projet, ou via le déploiement habituel des migrations. Le fichier crée les tables du stock et ses fonctions, sans toucher aux réservations existantes. Il faut un accès administrateur à la base ; le simple import du code GitHub ne garantit pas l’exécution de cette migration.

Se connecter avec un compte possédant déjà le rôle `admin` dans `public.user_roles`, puis ouvrir `/admin/stock`. Aucun rôle administrateur n’est attribué automatiquement. Vérifier sur téléphone et ordinateur que les deux affichent le même stock après actualisation. L’actualisation automatique intervient toutes les 15 secondes quand la page est visible, ainsi qu’au retour sur la fenêtre et à la reconnexion réseau. Les opérations exigent une connexion ; aucune écriture hors ligne n’est simulée.

## Utilisation

Ajouter une référence : saison (été, hiver, 4 saisons), largeur, hauteur, diamètre de 13 à 23 pouces, marque, modèle, année et nombre de paires. Une paire vaut deux pneus. Une référence identique rejoint le stock existant. Ajouter/retirer des paires depuis sa fiche ; modifier les caractéristiques séparément. Une référence vide peut être archivée, avec conservation de son historique. Les filtres permettent de retrouver un diamètre, une saison, une marque ou une dimension. Le stock et son historique sont réservés aux administrateurs existants.

## Langues

Le choix manuel FR/DE est mémorisé dans le navigateur. Sans choix, les en-têtes pays `cf-ipcountry` ou `x-vercel-ip-country` sélectionnent FR/DE si l’hébergement les fournit. Sinon, la langue du navigateur sert de repli. Aucune géolocalisation GPS ni API payante. Une détection géographique exacte sur tout hébergement nécessite un en-tête pays fourni par celui-ci. Accueil, devis, compte et stock disposent des traductions allemandes ; les visuels promotionnels français restent signalés FR.

## Vérification réalisée

Compilation TypeScript, production Vite, contrôles PostgreSQL isolés (rôles, quantités, doublons, répétition après coupure, historique et archivage), et aperçu visuel ordinateur/mobile. Les données de démonstration utilisées pour les captures ne sont pas livrées dans le site. La synchronisation réelle entre appareils reste à vérifier après installation de la migration.

Test base : installer `@electric-sql/pglite` dans un répertoire temporaire, puis lancer `PGLITE_MODULE=/chemin/vers/pglite/dist/index.js node tests/stock-database.mjs`.
