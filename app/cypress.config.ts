import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: '**/component/**/*.cy.tsx',
    video: false,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: '**/e2e/**/*.cy.tsx',
    video: false,
  },
});
