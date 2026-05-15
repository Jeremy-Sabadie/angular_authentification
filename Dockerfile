# ============================================================
# ÉTAPE 1 — BUILD
# Utilise Node.js 18 pour compiler l'application Angular.
# Cette étape produit les fichiers statiques dans dist/.
# ============================================================
FROM node:18 AS build

WORKDIR /app

# Copie uniquement les manifestes de dépendances en premier pour
# tirer parti du cache Docker : si package.json n'a pas changé,
# npm ci ne sera pas réexécuté lors du prochain build.
COPY package*.json ./
RUN npm ci

# Copie le reste des sources puis lance la build de production.
COPY . .
RUN npm run build

# ============================================================
# ÉTAPE 2 — SERVE
# Image légère nginx:alpine (quelques Mo) pour servir les
# fichiers statiques produits par l'étape précédente.
# Node.js n'est pas embarqué dans l'image finale.
# ============================================================
FROM nginx:alpine

# Copie uniquement le dossier browser/ généré par Angular 17+
# (le builder SSR crée un sous-dossier browser/ pour les assets CSR).
COPY --from=build /app/dist/authentification-tp/browser /usr/share/nginx/html

# Remplace la configuration nginx par défaut par la nôtre,
# qui gère le routing SPA et le proxy vers l'API mock.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Lance nginx en mode foreground (requis par Docker pour que le
# conteneur reste vivant tant que nginx tourne).
CMD ["nginx", "-g", "daemon off;"]
