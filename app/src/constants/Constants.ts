/**
 * @constant
 * @description Constants used throughout APP.
 */
const Constants = {
  BACKEND_URL: import.meta.env.VITE_TARGET === 'dev' ? 'http://localhost:3004' : 'https://spr-api-ec1236-dev.apps.silver.devops.gov.bc.ca'
}

export default Constants;
