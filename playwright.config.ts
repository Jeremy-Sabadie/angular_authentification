/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';

const CI = (globalThis as any).process?.env?.CI === 'true';

export default defineConfig({
  testDir: './e2e',

  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:4200',
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
