# Activation des réservations

Le code utilise Supabase pour l’agenda et Resend pour les e-mails.

1. Appliquer la migration `supabase/migrations/20260728010000_create_workshop_reservations.sql` au projet Supabase.
2. Ajouter les secrets serveur suivants dans l’hébergement Lovable :
   - `RESEND_API_KEY`
   - `RESERVATION_FROM_EMAIL` (exemple : `CAO57 <reservations@votre-domaine.fr>`)
3. Vérifier le domaine d’envoi dans Resend pour pouvoir envoyer les confirmations aux clients.

Ne jamais placer la clé Resend dans GitHub ni dans une variable `VITE_*`.
