/**
 * @constant
 * @description Constants used throughout APP.
 */
const Constants = {
  BACKEND_URL:
    import.meta.env.VITE_TARGET === 'dev'
      ? 'http://localhost:3004'
      : 'https://spr-api-ec1236-dev.apps.silver.devops.gov.bc.ca',
  FRONTEND_URL:
    import.meta.env.VITE_TARGET === 'dev'
      ? 'http://localhost:8080'
      : 'https://spr-app-ec1236-dev.apps.silver.devops.gov.bc.ca',
};

export default Constants;
