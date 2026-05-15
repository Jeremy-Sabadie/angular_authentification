import { defineConfig, devices } from '@playwright/test';

// Détecte si on s'exécute en environnement CI.
// La variable CI=true est injectée par docker-compose.ci.yml
// (service "tests") et par GitHub Actions nativement.
const CI = (globalThis as any).process?.env?.CI === 'true';

export default defineConfig({
  // Répertoire contenant les fichiers de tests (*.spec.ts).
  testDir: './tests',

  // Interdit les tests marqués .only() en CI pour éviter
  // qu'un oubli de développeur ne lance qu'un seul test.
  forbidOnly: CI,

  // En CI, rejoue les tests échoués jusqu'à 2 fois pour
  // absorber les flakiness réseau ou de rendu.
  retries: CI ? 2 : 0,

  // En CI, limite à 1 worker pour éviter les race conditions
  // liées à l'état partagé du json-server (base de données unique).
  workers: CI ? 1 : undefined,

  use: {
    // URL de base injectée par le conteneur Docker (http://frontend:80)
    // ou localhost:4200 pour le développement local.
    baseURL: (globalThis as any).process?.env?.['BASE_URL'] || 'http://localhost:4200',

    // Headless obligatoire en CI : pas d'écran disponible.
    headless: true,
  },

  projects: [
    {
      // Seul Chromium est testé en CI pour limiter la durée du pipeline.
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
