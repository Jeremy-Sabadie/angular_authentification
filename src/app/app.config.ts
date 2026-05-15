/**
 * app.config.ts — Configuration racine de l'application Angular (mode standalone).
 *
 * Remplace le NgModule racine depuis Angular 17. Ce fichier est passé
 * à bootstrapApplication() dans main.ts pour initialiser l'application.
 *
 * Pour ajouter un provider global (HTTP, animations, i18n…), l'ajouter
 * dans le tableau `providers` ci-dessous.
 */
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // eventCoalescing: true regroupe plusieurs événements DOM successifs
    // en un seul cycle de détection de changement — réduit le nombre
    // de re-rendus inutiles sur les interactions rapides.
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Enregistre le routeur Angular avec la table de routes définie
    // dans app.routes.ts. Requis pour que <router-outlet> fonctionne.
    provideRouter(routes),

    // Active le client HTTP Angular pour tous les services de l'application.
    // Sans ce provider, les injections de HttpClient lèveraient une erreur.
    provideHttpClient(),
  ],
};
