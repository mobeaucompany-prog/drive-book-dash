# Activation des réservations

Le code utilise Supabase pour l’agenda et Resend pour les e-mails.

1. Appliquer la migration `supabase/migrations/20260728010000_create_workshop_reservations.sql` au projet Supabase.
2. Lorsque les e-mails devront être activés, ajouter les secrets serveur suivants dans l’hébergement Lovable :
   - `RESEND_API_KEY`
   - `RESERVATION_FROM_EMAIL`
   - `RESERVATION_ADMIN_EMAIL`
3. Vérifier le domaine d’envoi dans Resend pour pouvoir envoyer les confirmations aux clients.

Sans ces variables, les réservations sont enregistrées normalement mais aucun e-mail n’est envoyé.

Ne jamais placer la clé Resend dans GitHub ni dans une variable `VITE_*`.
