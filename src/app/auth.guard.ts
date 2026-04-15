import { CanActivateFn, Router } from '@angular/router';

// je protège les routes sensibles comme dashboard
export const authGuard: CanActivateFn = (route, state) => {
  const router = new Router();

  // je récupère l'utilisateur connecté
  const user = localStorage.getItem('user');

  // si pas connecté → je bloque et redirige login
  if (!user) {
    console.log('accès refusé');

    router.navigate(['/login']);
    return false;
  }

  // sinon accès autorisé
  return true;
};
