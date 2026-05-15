/**
 * auth.guard.ts — Garde fonctionnelle de protection des routes privées.
 *
 * Vérifie la présence de la clé 'user' dans le localStorage avant
 * d'autoriser l'accès à une route protégée (ici : /dashboard).
 *
 * Format attendu dans localStorage :
 *   clé   : 'user'
 *   valeur : JSON stringifié de { id: number, email: string }
 *
 * ⚠️  Limite de sécurité : le localStorage est lisible et modifiable
 *     par tout script JavaScript de la page. Pour une application en
 *     production, préférer une validation de token JWT côté serveur
 *     à chaque requête API.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Garde fonctionnelle (pattern Angular 14+) — plus léger qu'une classe
// @Injectable car il n'est instancié qu'au moment de l'évaluation de la route.
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Absence de la clé 'user' = utilisateur non authentifié.
  // createUrlTree() est préférable à router.navigate() dans un guard :
  // il retourne un UrlTree qu'Angular intègre proprement dans le cycle
  // de navigation sans créer d'entrée parasite dans l'historique.
  if (!localStorage.getItem('user')) {
    return router.createUrlTree(['/login']);
  }

  // Retourne true pour autoriser l'accès à la route demandée.
  return true;
};
