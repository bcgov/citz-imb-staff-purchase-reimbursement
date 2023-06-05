const {
  ENVIRONMENT,
  FRONTEND_URL,
  BACKEND_URL,
  TESTING,
  API_PORT,
  FRONTEND_PORT
} = process.env;

// Use production urls unless ENVIRONMENT === "local".
let frontendUrl = FRONTEND_URL;
let backendUrl = BACKEND_URL;

if (ENVIRONMENT && ENVIRONMENT === 'local') {
  frontendUrl = `http://localhost:${FRONTEND_PORT}`;
  backendUrl = `http://localhost:${API_PORT}`;
}

const Constants = {
  API_PORT: API_PORT || 3004,
  TESTING: `${TESTING}`.toLowerCase() !== 'true',
  BACKEND_URL: backendUrl,
  FRONTEND_URL: frontendUrl
};

export default Constants;
