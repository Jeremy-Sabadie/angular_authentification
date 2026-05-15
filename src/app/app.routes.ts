/**
 * app.routes.ts — Table de routage principale de l'application.
 *
 * Stratégie : lazy loading sur chaque route métier pour ne charger
 * le bundle d'un composant qu'à sa première visite, réduisant ainsi
 * le JavaScript initial téléchargé par le navigateur.
 *
 * Arbre des routes :
 *   /          → /login  (redirection par défaut)
 *   /login     → LoginFormComponent  [public]
 *   /dashboard → DashboardComponent  [protégé par authGuard]
 *   /**        → /login              [fallback — URL inconnue]
 */
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  // pathMatch: 'full' est requis sur path: '' pour que la redirection
  // ne s'applique qu'à l'URL exacte "/" et non à toutes les routes enfants.
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Lazy loading : le chunk LoginFormComponent n'est téléchargé
  // qu'à la première navigation vers /login.
  {
    path: 'login',
    loadComponent: () =>
      import('./login-form/login-form.component').then(
        (m) => m.LoginFormComponent,
      ),
  },

  // canActivate déclenche authGuard avant d'afficher le dashboard.
  // Si l'utilisateur n'est pas connecté, il est renvoyé vers /login.
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [authGuard],
  },

  // Toute URL non reconnue redirige vers /login plutôt qu'une page 404,
  // comportement standard pour une SPA sans route d'erreur dédiée.
  {
    path: '**',
    redirectTo: 'login',
  },
];
