# CI Pipeline — Documentation

## Comment fonctionne la pipeline

La pipeline est définie dans `.github/workflows/ci.yml` et se déclenche sur chaque `push` et `pull_request`.

### Étapes

1. **Checkout** — récupère le code source

2. **Build and start services** — lance `docker compose -f docker-compose.ci.yml up --build -d`
   - Construit l'image `frontend` (Angular → nginx)
   - Démarre `json-server` (API mock sur le port 3000)
   - Démarre `frontend` (nginx sur le port 80, mappé 4200 sur le runner)
   - Le service `frontend` attend que `json-server` soit healthy avant de démarrer

3. **Wait for frontend** — boucle curl sur `http://localhost:4200` jusqu'à réponse

4. **Wait for API** — boucle curl sur `http://localhost:3000` jusqu'à réponse

5. **Run Playwright tests** — `docker compose run tests`
   - Le conteneur `tests` lance `run-e2e.sh`
   - `npm ci` installe les dépendances dans un volume isolé
   - `npx playwright install --with-deps chromium` installe le navigateur
   - Attend que `http://frontend:80` réponde (via wget)
   - Lance `npx playwright test` (6 tests E2E sur Chromium)

6. **Stop containers** — `docker compose down` (toujours exécuté, même en cas d'échec)

---

## Architecture Docker

```
┌─────────────────────────────────────────────────────┐
│              Réseau Docker (bridge)                  │
│                                                      │
│  ┌─────────────┐    /api/  ┌──────────────────┐     │
│  │  json-server│◄──────────│    frontend       │     │
│  │  node:20    │           │    nginx:alpine   │     │
│  │  port 3000  │           │    port 80→4200   │     │
│  └─────────────┘           └──────────────────┘     │
│                                      ▲               │
│                               http://frontend:80     │
│  ┌─────────────┐                     │               │
│  │    tests    │─────────────────────┘               │
│  │  playwright │  BASE_URL=http://frontend:80         │
│  │  v1.54.1    │                                     │
│  └─────────────┘                                     │
└─────────────────────────────────────────────────────┘
```

---

## Problèmes rencontrés et corrections

### 1. Deux workflows identiques déclenchaient deux CI en parallèle
- **Problème** : `.github/workflows/playwright.yml` était une copie exacte de `ci.yml`
- **Correction** : suppression de `playwright.yml`

### 2. `playwright.config.ts` — baseURL incorrecte dans Docker
- **Problème** : `baseURL: 'http://localhost:4200'` — depuis le conteneur `tests`, `localhost` pointe sur lui-même, pas sur le service `frontend`
- **Correction** : `baseURL: process.env['BASE_URL'] || 'http://localhost:4200'` + `BASE_URL=http://frontend:80` dans `docker-compose.ci.yml`

### 3. Boucle shell cassée dans `docker-compose.ci.yml`
- **Problème** : la variable `$i` du `for` loop était interprétée par Docker Compose comme une variable Compose (avertissement `"i" variable is not set`), rendant la boucle d'attente inopérante
- **Correction** : extraction dans un script `run-e2e.sh` — les variables shell `$i` ne sont plus exposées au parser YAML de Compose

### 4. `json-server` unhealthy — `wget` absent de l'image `node:20`
- **Problème** : le healthcheck utilisait `wget -qO- http://localhost:3000/` mais `wget` n'est pas installé dans l'image `node:20`
- **Correction** : healthcheck remplacé par `node -e "require('http').get(...)"` — Node.js est toujours disponible. `start_period: 20s` ajouté pour laisser le temps à `npx` de télécharger json-server

### 5. `npm ci` dans le conteneur `tests` — erreur `ENOTEMPTY`
- **Problème** : le volume `.:/app` montait le `node_modules` de Windows dans Linux. `npm ci` tentait de supprimer des dossiers non vides à cause des conflits filesystem cross-OS
- **Correction** : ajout de `- /app/node_modules` dans les volumes du service `tests` — volume anonyme Docker qui masque le `node_modules` de l'hôte

### 6. nginx sans configuration SPA — routes Angular retournaient 404
- **Problème** : nginx par défaut ne sert que des fichiers existants. Naviguer directement vers `/dashboard` retournait 404 car aucun fichier de ce nom n'existe. Angular ne se chargeait pas, le guard ne s'exécutait jamais
- **Correction** : création de `nginx.conf` avec `try_files $uri $uri/ /index.html` pour que toute route non trouvée renvoie `index.html` (comportement SPA standard)

### 7. `apiUrl` hardcodé à `http://localhost:3000` — inaccessible depuis le conteneur `tests`
- **Problème** : l'app Angular (compilée en prod) appelait `http://localhost:3000/users`. Depuis Chromium tournant dans le conteneur `tests`, `localhost:3000` pointait sur le conteneur lui-même — pas sur json-server. Tous les appels API échouaient silencieusement
- **Correction** :
  - `environment.prod.ts` : `apiUrl: '/api'` (URL relative)
  - `nginx.conf` : `location /api/ { proxy_pass http://json-server:3000/; }` — nginx proxifie les appels API vers json-server via le réseau Docker

### 8. Dockerfile copiait le mauvais dossier — Angular ne se chargeait jamais
- **Problème** : Angular 17 avec le builder `application` génère les fichiers dans `dist/authentification-tp/browser/`, pas dans `dist/authentification-tp/` directement. Le Dockerfile copiait le dossier parent : nginx se retrouvait sans `index.html` à la racine. curl passait quand même (il ne vérifie pas le code HTTP), mais Angular ne se chargeait jamais et tous les tests Playwright échouaient
- **Correction** : `COPY --from=build /app/dist/authentification-tp/browser /usr/share/nginx/html`
