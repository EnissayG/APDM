# APDM · Site de contact

Page de contact pour APDM (machines distributrices d’essentiels pharmaceutiques, Montréal).

## Prérequis

- Node.js 22+
- npm

## Installation

`ash
npm install
`

## Développement local

`ash
npm run dev
`

Puis ouvrir l’URL affichée (par défaut http://localhost:5173).

`ash
npm run build    # build de production
npm run preview  # prévisualiser le build
`

> En local, la soumission du formulaire échoue (pas de Netlify Forms). Le reste de l’UI fonctionne normalement.

## Variables d’environnement

Copier .env.example et renseigner les valeurs **dans Netlify** (Site settings → Environment variables), pas dans le dépôt :

| Variable | Rôle |
|----------|------|
| RESEND_API_KEY | Clé API Resend |
| CONTACT_TO_EMAIL | Courriel qui reçoit les notifications |
| CONTACT_FROM_EMAIL | Expéditeur vérifié chez Resend (Nom <courriel@domaine.com>) |
| SITE_URL | URL publique du site (logo dans les courriels) |
| VITE_FORM_ENDPOINT | Optionnel. Endpoint Forms si le front est hébergé ailleurs |

## Déploiement Netlify (production recommandée)

Netlify héberge le site **et** active Forms + la fonction d’envoi de courriels.

1. Créer un site Netlify lié à ce dépôt (ou 
etlify deploy).
2. Build : 
pm run build · Publish : dist · Functions : 
etlify/functions (déjà dans 
etlify.toml).
3. Ajouter les variables d’environnement listées ci-dessus.
4. Vérifier que le formulaire contact apparaît sous **Forms**.
5. Authentifier le domaine d’envoi dans Resend, puis tester une soumission.

À chaque soumission validée, la fonction ormSubmitted (fichier 
etlify/functions/submission-created.mts) envoie :

1. une notification à APDM (reply-to = courriel du visiteur) ;
2. une confirmation au visiteur.

## Déploiement GitHub Pages (aperçu statique)

Un workflow Actions (.github/workflows/deploy-pages.yml) publie le build sur GitHub Pages à chaque push sur main / master.

1. Dans le dépôt GitHub : **Settings → Pages → Source : GitHub Actions**.
2. Pousser sur main (ou lancer le workflow manuellement).
3. Le site sera servi sous https://<user>.github.io/<repo>/.
4. Domaine custom ou site à la racine : créer la variable de dépôt BASE_PATH avec la valeur /.

**Limite :** GitHub Pages est statique. Les Netlify Forms et les courriels Resend ne fonctionnent **pas** dessus, sauf si vous pointez VITE_FORM_ENDPOINT vers votre site Netlify.

## Structure

`
src/
  App.tsx
  components/   Header, Footer, ContactForm
  assets/       logo et illustration
netlify/
  functions/    courriels Resend (événement formSubmitted)
public/         favicon / logo statique
`
