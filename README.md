# Site vitrine assistant-rp.com + blog

Ce dépôt remplace le workflow "zip glissé sur Netlify" par un vrai dépôt Git. Il contient :

- `static/` — le site existant (app React/Vite compilée + patch cibles/FAQ déjà livré), copié tel quel, jamais retouché.
- `content/blog/` — les articles de blog (fichiers Markdown) + les gabarits qui les transforment en pages HTML (Eleventy).
- `admin/` — l'interface d'administration (Decap CMS) accessible à `/admin` une fois déployée.
- `.eleventy.js`, `package.json`, `netlify.toml` — la config du générateur de site et de Netlify.

## Ce qui a changé par rapport à ce qu'on avait prévu

Netlify documente aujourd'hui lui-même **Git Gateway** (la brique qui devait permettre à ton équipe de se connecter à `/admin` sans compte GitHub) comme **dépréciée** pour toute nouvelle mise en place ("new Git Gateway configurations are not recommended" — [docs Netlify](https://docs.netlify.com/manage/security/secure-access-to-sites/git-gateway/)). Je ne construis pas une interface neuve sur une brique que Netlify lui-même déconseille.

À la place, l'authentification de `/admin` passe par **[DecapBridge](https://decapbridge.com)**, un service tiers maintenu, conçu spécifiquement pour ça : connexion par e-mail/Google/Microsoft, pas besoin de compte GitHub pour toi ou ton équipe, gratuit jusqu'à 10 personnes (vous êtes 4). C'est la seule étape de la procédure ci-dessous qui n'était pas prévue initialement.

## Procédure de mise en place, dans l'ordre

### 1. Créer le dépôt GitHub

1. Sur [github.com](https://github.com/new), crée un nouveau dépôt (ex. `assistant-rp-site-vitrine`), vide, sans README ni `.gitignore` (ils sont déjà dans ce zip).
2. En local, dans le dossier dézippé :
   ```bash
   git init
   git add .
   git commit -m "Site vitrine + blog, migration vers Git"
   git branch -M main
   git remote add origin https://github.com/<ton-compte>/assistant-rp-site-vitrine.git
   git push -u origin main
   ```

### 2. Connecter Netlify à ce dépôt

Deux options :

- **Nouveau site Netlify** : "Add new site" → "Import an existing project" → choisis ce dépôt GitHub. Netlify détecte automatiquement `netlify.toml` (commande `npm run build`, dossier publié `_site`). Une fois que le nouveau site fonctionne et que le DNS/domaine `assistant-rp.com` est basculé dessus, tu peux supprimer l'ancien site (celui alimenté par glisser-déposer).
- **Site existant reconnecté** : dans le site Netlify actuel → Project configuration → Build & deploy → Link repository, et relie ce même dépôt GitHub. Plus simple si tu veux garder l'URL/le domaine déjà configuré tel quel.

Après ça, un `git push` sur `main` déclenche un déploiement automatique — plus besoin de glisser un zip.

### 3. Créer un compte DecapBridge et relier le dépôt

1. Va sur [decapbridge.com](https://decapbridge.com), crée un compte (gratuit).
2. Ajoute ce dépôt GitHub depuis leur dashboard — ils te demanderont d'autoriser l'accès à GitHub (OAuth) et de choisir la branche (`main`).
3. Leur dashboard génère un bloc `backend:` à coller dans `admin/config.yml`, à la place du bloc actuel qui porte un commentaire `PLACEHOLDER`. Il peut aussi te demander d'ajouter un petit script dans `admin/index.html` — un emplacement est réservé avec un commentaire à cet effet.
4. Commit + push ce changement. Netlify redéploie automatiquement.

### 4. Inviter ton équipe

Depuis le dashboard DecapBridge, invite les 3 autres personnes par e-mail. Elles pourront se connecter directement sur `https://assistant-rp.com/admin` sans jamais toucher à GitHub.

### 5. Écrire un article

Une fois connecté à `/admin` :
- "Articles de blog" → "Nouvel article"
- Titre, date, extrait (affiché sur la page de liste), image de couverture (optionnelle), auteur (par défaut "L'équipe Assistant-RP"), contenu en texte riche.
- "Enregistrer" puis "Publier" (le mode `editorial_workflow` activé dans `config.yml` ajoute un statut brouillon/relecture avant publication réelle — supprime cette ligne dans `config.yml` si tu préfères publier en un clic).

Un article de test ("Bienvenue sur le blog Assistant-RP") est déjà en place à `content/blog/2026-10-22-bienvenue-sur-le-blog.md` pour vérifier que tout fonctionne de bout en bout — à modifier ou supprimer depuis l'interface une fois que c'est confirmé.

## Développement local

```bash
npm install
npm run build   # build unique dans _site/
npm run serve   # build + serveur local avec rechargement automatique
```

`/admin` ne fonctionnera pas en local (DecapBridge et Decap CMS ont besoin du site réellement déployé) — c'est normal, teste cette partie uniquement une fois en ligne.

## Ce qui n'a pas changé

Le hero animé (scène 3D/WebGL) et les animations de la page d'accueil n'ont pas été touchés — ce dépôt contient le même bundle compilé que celui déjà en ligne, pas une reconstruction. Si un jour tu veux un vrai code source pour cette partie-là aussi, c'est un chantier séparé (il faudra recréer le hero from scratch, le bundle actuel ne contient pas son code source lisible).

## Limites connues

- Les 3 boutons "Mentions légales / Confidentialité / CGU" du pied de page ouvraient une fenêtre modale sur le site existant (comportement géré par le bundle React). Sur les pages du blog (statiques), ils ont été remplacés par un pied de page simplifié (logo, copyright, contact) — recréer ces modales sur les pages blog n'était pas dans le périmètre demandé.
- Les URLs d'articles incluent la date (`/blog/2026-10-22-bienvenue-sur-le-blog/`) — standard pour ce type de générateur, mais dis-le-moi si tu préfères des URLs sans date.
