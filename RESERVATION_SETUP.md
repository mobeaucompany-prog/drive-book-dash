# Activation des réservations

Le code utilise Supabase pour l’agenda et Resend pour les e-mails.

1. Appliquer la migration `supabase/migrations/20260728010000_create_workshop_reservations.sql` au projet Supabase.
2. Lorsque les e-mails devront être activés, ajouter les secrets serveur suivants dans l’hébergement Lovable :
   - `RESEND_API_KEY`
   - `RESERVATION_FROM_EMAIL`
   - `RESERVATION_ADMIN_EMAIL`
3. Vérifier le domaine d’envoi dans Resend pour pouvoir envoyer les confirmations aux clients.

Sans ces variables, les réservations sont enregistrées normalement mais aucun e-mail n’est envoyé.

## Demandes de devis

1. Appliquer également la migration `supabase/migrations/20260804010000_create_quote_requests.sql`.
2. Les devis utilisent la même clé `RESEND_API_KEY` et la même adresse d’envoi `RESERVATION_FROM_EMAIL`.
3. L’e-mail du garage est `jeremypreiss9@gmail.com`. Il peut être remplacé avec `QUOTE_ADMIN_EMAIL`.

Tant que le numéro `06 20 43 11 91` utilise WhatsApp classique, le client obtient un bouton avec le message prérempli. Pour activer l’envoi serveur automatique après le passage à l’API WhatsApp Business, ajouter :

- `WHATSAPP_CLOUD_API_URL`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_ADMIN_PHONE` (format international, par exemple `33620431191`)

Ne jamais placer la clé Resend dans GitHub ni dans une variable `VITE_*`.
