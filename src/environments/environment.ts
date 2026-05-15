/**
 * environment.ts — Configuration pour l'environnement de développement local.
 *
 * Angular CLI substitue automatiquement ce fichier par environment.prod.ts
 * lors d'un build de production (`ng build --configuration production`).
 *
 * Pour ajouter un environnement (staging, recette…) :
 *   1. Dupliquer ce fichier sous le nom environment.staging.ts.
 *   2. Déclarer la configuration dans angular.json > configurations > fileReplacements.
 */
export const environment = {
  production: false,
  // Pointe directement sur json-server lancé en local (npm run start:api).
  // En CI, le service est exposé sur le même port via docker-compose.ci.yml.
  apiUrl: 'http://localhost:3000',
};
