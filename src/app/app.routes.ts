import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  // redirection par défaut
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // login lazy
  {
    path: 'login',
    loadComponent: () =>
      import('./login-form/login-form.component').then(
        (m) => m.LoginFormComponent,
      ),
  },

  // dashboard lazy + protégé
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [authGuard], // protection ici
  },

  // fallback
  {
    path: '**',
    redirectTo: 'login',
  },
];
