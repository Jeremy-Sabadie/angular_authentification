# Étape 1 : build Angular
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : nginx
FROM nginx:alpine

# ⚠️ IMPORTANT : adapter le nom du dossier Angular
COPY --from=build /app/dist/authentification-tp/browser /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
