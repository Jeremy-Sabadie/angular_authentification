import { defineConfig, devices } from '@playwright/test';

const CI = (globalThis as any).process?.env?.CI === 'true';

export default defineConfig({
  testDir: './tests',

  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,

  use: {
    baseURL: (globalThis as any).process?.env?.['BASE_URL'] || 'http://localhost:4200',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
