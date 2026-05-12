FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

# 🔥 sécurité CI : fallback si "browser" n'existe pas
COPY --from=build /app/dist/authentification-tp /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
