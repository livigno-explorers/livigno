// End-to-end tests. Run: npm install, npx playwright install chromium, npm test
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  reporter: [["list"]],
  use: { baseURL: "http://localhost:4173/" },
  // A tiny static server written in Node (tests/server.mjs) – no extra package needed.
  webServer: { command: "node tests/server.mjs", url: "http://localhost:4173/", reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
