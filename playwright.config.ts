import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
 testDir: './tests/e2e', fullyParallel: false, workers: 1, use: { baseURL: 'http://127.0.0.1:5173' },
 projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } }],
 webServer: [
  { command: 'npm run dev:api', url: 'http://127.0.0.1:3001/health', reuseExistingServer: !process.env.CI },
  { command: 'npm run dev -- --host 127.0.0.1', url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI, env: { VITE_LOCAL_DEMO: 'true', VITE_API_URL: 'http://127.0.0.1:3001' } }
 ]
});
