# Activation des réservations

Le code utilise Supabase pour l’agenda et Gmail pour les e-mails automatiques.

## 1. Base de données

Appliquer dans l’ordre au projet Supabase :

1. `supabase/migrations/20260728010000_create_workshop_reservations.sql`
2. `supabase/migrations/20260817010000_add_workshop_admin.sql`
3. `supabase/migrations/20260817020000_add_admin_roles.sql`

La seconde migration ajoute les blocages manuels. La troisième ajoute les comptes et rôles administrateur sécurisés.

## 2. Gmail gratuit via Google Apps Script

Le site étant hébergé sur Cloudflare, les e-mails passent par un petit Web App Google Apps Script en HTTPS plutôt que par SMTP.

1. Ouvrir [script.google.com](https://script.google.com) avec l’adresse Gmail dédiée au garage.
2. Créer un projet et copier le contenu de `GMAIL_APPS_SCRIPT.gs` dans `Code.gs`.
3. Dans **Paramètres du projet > Propriétés du script**, ajouter `API_SECRET` avec une longue valeur aléatoire.
4. Cliquer sur **Déployer > Nouveau déploiement > Application Web** :
   - Exécuter en tant que : **Moi** ;
   - Qui a accès : **Tout le monde**.
5. Copier l’URL `/exec` du déploiement.
6. Ajouter les secrets serveur suivants dans l’hébergement Lovable :
   - `GMAIL_WEBHOOK_URL` : URL `/exec` du déploiement ;
   - `GMAIL_WEBHOOK_SECRET` : même valeur que `API_SECRET` ;
   - `RESERVATION_ADMIN_EMAIL` : destinataire de secours des nouvelles demandes (facultatif une fois un administrateur activé).

Ne jamais placer le secret dans GitHub ou dans une variable `VITE_*`.

Sans les deux variables Gmail, les réservations sont enregistrées normalement mais aucun e-mail n’est envoyé.

## 3. Administration

La page sécurisée est `/admin/atelier`. Le compte du site et la boîte Gmail utilisée pour envoyer les notifications sont indépendants : le garage ne communique jamais le mot de passe de sa messagerie.

1. Le garage ouvre `/admin/atelier`, clique sur **Créer un compte** et choisit son propre mot de passe.
2. Après confirmation de l’adresse e-mail, récupérer son identifiant dans Supabase avec :

```sql
select id, email, created_at
from auth.users
order by created_at desc;
```

3. Attribuer le rôle administrateur en remplaçant l’adresse dans la requête suivante :

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where lower(email) = lower('adresse-du-garage@exemple.fr')
on conflict (user_id, role) do nothing;
```

Le rôle ne peut pas être ajouté ou modifié depuis le navigateur. Une fois activé, l’administrateur peut :

- confirmer ou refuser une demande ;
- consulter les demandes récentes ;
- bloquer plusieurs créneaux avec un motif ;
- supprimer un blocage ;
- suivre automatiquement les changements de l’agenda.

L’URL de redirection `https://votre-domaine/admin/atelier` doit être autorisée dans la configuration Auth de Supabase.

Pour retirer les droits d’un compte :

```sql
delete from public.user_roles
where user_id = (
  select id from auth.users where lower(email) = lower('adresse-du-garage@exemple.fr')
)
and role = 'admin';
```

## Demandes de devis

1. Appliquer également la migration `supabase/migrations/20260804010000_create_quote_requests.sql`.
2. Les devis utilisent les mêmes variables Gmail.
3. L’e-mail du garage peut être remplacé avec `QUOTE_ADMIN_EMAIL`.

Tant que le numéro `06 20 43 11 91` utilise WhatsApp classique, le client obtient un bouton avec le message prérempli. Pour activer l’envoi serveur automatique après le passage à l’API WhatsApp Business, ajouter :

- `WHATSAPP_CLOUD_API_URL`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_ADMIN_PHONE` (format international, par exemple `33620431191`)
