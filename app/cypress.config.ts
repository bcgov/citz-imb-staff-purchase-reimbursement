import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

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
    env: {
      auth_base_url: 'https://dev.loginproxy.gov.bc.ca/auth',
      auth_logon_url: 'https://logontest7.gov.bc.ca/',
      auth_client_id: process.env.SSO_CLIENT_ID,
      test_username: process.env.TEST_USERNAME,
      test_password: process.env.TEST_PASSWORD,
    },
  },
});
