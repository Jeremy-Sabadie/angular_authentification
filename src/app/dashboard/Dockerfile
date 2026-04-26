# =========================
# Étape 1 : Build Angular
# =========================
FROM node:18 AS build

WORKDIR /app

# Copier dépendances
COPY package*.json ./
RUN npm install

# Copier le projet
COPY . .

# Build Angular (production)
RUN npm run build


# =========================
# Étape 2 : Serveur Nginx
# =========================
FROM nginx:alpine

# ⚠️ IMPORTANT : chemin Angular corrigé
COPY --from=build /app/dist/authentification-tp /usr/share/nginx/html

# Exposer le port nginx
EXPOSE 80

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]
