# Ton Media Kit

> Plateforme qui vend et livre l'outil de media kit créé par **Lys Sama** (Mélyssa K. COSSOU), prolongement de sa série de vidéos **« Du Lab à la Collab »**.

## Le but

Une marque écrit à une créatrice débutante, elle est intéressée, et elle demande : « tu peux nous envoyer ton media kit et tes tarifs ? ».
Trois jours passent, le document n'existe toujours pas, et la marque part avec quelqu'un d'autre. Ce n'est pas un problème de talent, c'est un problème de document.

Ton Media Kit règle ça : en une dizaine de minutes, la créatrice construit un media kit A4 professionnel sans partir d'une page blanche.
Elle choisit dans des listes, l'outil rédige les phrases (positionnement, comparaisons de chiffres, arguments) et met tout en page.
Elle repart avec un PDF prêt à envoyer, liens cliquables inclus, tarifs en FCFA.

## Le parcours

1. **Le site** (`/`) raconte l'histoire en chapitres : la marque qui écrit, les trois jours qui passent, le vrai problème, ce qu'une marque lit dans un media kit, la méthode, le style, le prix.
2. **La commande** (`/commencer`) : prénom, email, numéro Mobile Money (facultatif), puis paiement **KKiaPay** (Mobile Money ou carte).
3. **La vérification** : le serveur revérifie la transaction auprès de KKiaPay (statut et montant) avant d'ouvrir l'accès. Un webhook rattrape les paiements dont la page a été fermée trop tôt.
4. **L'accès** : un email avec un lien personnel (lien magique) est envoyé. Il permet de revenir sur n'importe quel appareil. `/acces` renvoie ce lien si on l'a perdu.
5. **Le studio** (`/studio`) : l'outil de Lys Sama, repris fidèlement. Le brouillon est enregistré sur l'appareil **et** dans le compte.
6. **La fin** : « Recevoir par email » génère le PDF et l'envoie en pièce jointe (Resend). Téléchargement PDF et JPG toujours possibles.

## Ce qui a changé par rapport à l'outil d'origine

- L'activation par clé (Supabase, désactivée et contournable) est remplacée par un vrai compte : paiement vérifié côté serveur, accès par cookie et lien magique. Le studio n'est servi qu'aux personnes qui ont payé.
- Le mode auteur (`#auteur`, Ctrl+Alt+E) est retiré : les textes se modifient dans le code (`server/studio/studio.html`, objet `TEXTES`).
- Le travail suit la personne d'un appareil à l'autre (brouillon enregistré dans le compte).
- Le PDF part par email, en plus du téléchargement.
- Les bibliothèques d'export et les images sont servies par le site (plus d'images en base64 dans la page, plus de CDN pour l'export).

Le reste (les 4 écrans, les listes, l'aperçu A4, les 5 dispositions, les styles, les versions sauvegardées) est inchangé.

## Technique

- **Nuxt 4** (Vue 3), **Tailwind CSS 4**, **GSAP** (ScrollTrigger) pour les animations, icônes **Lucide**.
- Polices hébergées par le site (Playfair Display, Inter, et celles proposées dans le studio).
- Couleurs reprises à l'identique de l'outil : bordeaux `#6D071A`, bordeaux profond `#2E0209`, rose `#F7EBEE`, orange `#E8631A` et bleu canard `#305861` du logo, etc. (`app/assets/css/main.css`).
- Animations désactivées automatiquement si l'appareil demande moins d'animations.
- Stockage : fichiers locaux (`.data/`) en développement, **Upstash Redis** en production.

```
app/
  pages/            index (récit), commencer (paiement), acces (retrouver son lien)
  components/       sections du récit (landing/) et réplique du media kit (kit/KitMini.vue)
server/
  api/orders/       création de commande, confirmation du paiement
  api/kkiapay/      webhook KKiaPay
  api/access/       renvoi du lien d'accès
  api/studio/       brouillon, envoi du PDF par email
  routes/           /studio (servi seulement avec accès), /acces/:token (lien magique)
  studio/           l'outil de Lys Sama adapté à la plateforme
  utils/            stockage, session, KKiaPay, emails
```

## Démarrer

```bash
npm install
cp .env.example .env
npm run dev
```

Pour tester tout le parcours sans KKiaPay ni Resend, mets `NUXT_PUBLIC_FAKE_PAYMENT=true` dans `.env` : le paiement est simulé (en développement uniquement, jamais en production) et les emails sont déposés dans `.data/outbox/` avec le PDF.

## Mise en production

1. **KKiaPay** : récupère les clés (publique, privée, secrète) dans le tableau de bord. Commence avec `NUXT_PUBLIC_KKIAPAY_SANDBOX=true`, puis passe à `false`.
   Déclare le webhook `https://ton-domaine/api/kkiapay/webhook` avec un secret, et mets ce secret dans `NUXT_KKIAPAY_WEBHOOK_SECRET`.
2. **Resend** : crée une clé API et vérifie ton domaine d'envoi, puis renseigne `NUXT_RESEND_API_KEY` et `NUXT_MAIL_FROM`.
3. **Upstash Redis** : dans Vercel > Storage, crée une base Upstash et connecte-la au projet (les variables `KV_REST_API_URL` / `KV_REST_API_TOKEN` sont ajoutées toutes seules). Depuis upstash.com, renseigne plutôt `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`. Sans ça, les commandes ne sont pas conservées sur Vercel.
4. Renseigne `NUXT_PUBLIC_SITE_URL` (sert aux liens des emails) et `NUXT_PUBLIC_PRICE_FCFA`.
5. Déploie (Vercel détecte Nuxt tout seul).

## Pistes

- Réécrire le studio en composants Vue (il reste aujourd'hui une page autonome, fidèle à l'original).
- PDF vectoriel (texte sélectionnable, fichier plus léger) au lieu d'images.
- Stocker les photos du brouillon à part (Vercel Blob) si les brouillons deviennent lourds.
- Petit tableau de bord pour Lys : ventes, renvoi d'un lien, remboursement.
