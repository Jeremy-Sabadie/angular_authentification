/**
 * environment.prod.ts — Configuration pour l'environnement de production.
 *
 * Ce fichier remplace environment.ts au moment du build de production.
 * L'URL relative '/api' est proxifiée par nginx vers le backend réel
 * (voir nginx.conf, section `location /api/`).
 *
 * ⚠️  Ne jamais mettre d'URL absolue (http://mon-serveur/…) ici :
 *     une URL relative garde la configuration indépendante du domaine
 *     de déploiement.
 */
export const environment = {
  production: true,
  // URL relative interceptée par nginx qui la transmet au service backend.
  apiUrl: '/api',
};
