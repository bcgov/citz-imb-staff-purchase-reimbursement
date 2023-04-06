import { defineConfig } from "cypress";

export default defineConfig({
  baseURL: 'http://localhost:3004/api',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/integration/**/*.cy.js',
    baseUrl: 'http://localhost:3004/api'
  },
  video: false,
  watchForFileChanges: false,
  screenshotOnRunFailure: false
});
