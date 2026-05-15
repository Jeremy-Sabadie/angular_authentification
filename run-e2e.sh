#!/bin/sh
# ============================================================
# run-e2e.sh
# Script exécuté dans le conteneur Playwright pour :
#   1. Installer les dépendances npm
#   2. Installer Chromium et ses dépendances système
#   3. Attendre que le frontend soit accessible
#   4. Lancer la suite de tests Playwright
#
# Ce script est le point d'entrée du service "tests" défini
# dans docker-compose.ci.yml.
# ============================================================

# Arrête le script immédiatement si une commande échoue.
# Évite de lancer les tests si l'installation a échoué.
set -e

# Installe les dépendances déclarées dans package.json
# (équivalent de npm install mais déterministe via package-lock.json).
npm ci

# Installe Chromium + toutes ses dépendances système Linux
# (libc, libatk, libgdk, etc.) requises pour le mode headless.
npx playwright install --with-deps chromium

# ----------------------------------------------------------
# Boucle d'attente : le frontend peut prendre plusieurs
# secondes à démarrer après que son conteneur soit "prêt"
# au sens de Docker. On interroge l'URL toutes les 3 s,
# jusqu'à 30 tentatives (= 90 s max).
# ----------------------------------------------------------
echo "Waiting for frontend at http://frontend:80..."
i=0
while [ $i -lt 30 ]; do
  if wget -qO- http://frontend:80 > /dev/null 2>&1; then
    echo "Frontend ready after $i attempts"
    break
  fi
  i=$((i + 1))
  echo "Attempt $i/30..."
  sleep 3
done

# Lance tous les tests Playwright définis dans ./tests/.
# La configuration est lue depuis playwright.config.ts.
npx playwright test
