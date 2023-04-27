import dotenv from 'dotenv';
dotenv.config();

const {
  ENVIRONMENT,
  FRONTEND_URL,
  FRONTEND_PORT,
  BACKEND_URL,
  API_PORT,
  SSO_AUTH_SERVER_URL,
  SSO_CLIENT_ID,
  SSO_CLIENT_SECRET,
} = process.env;

// Use production urls unless ENVIRONMENT === "local".
let frontendUrl = FRONTEND_URL;
let backendUrl = BACKEND_URL;

if (ENVIRONMENT && ENVIRONMENT === 'local') {
  frontendUrl = `http://localhost:${FRONTEND_PORT}`;
  backendUrl = `http://localhost:${API_PORT}`;
}

// Exported configuration values.
export default {
  SSO_CLIENT_ID: SSO_CLIENT_ID ?? '',
  SSO_CLIENT_SECRET: SSO_CLIENT_SECRET ?? '',
  OIDC_AUTHORIZATION_URL: `${SSO_AUTH_SERVER_URL}/auth`,
  OIDC_TOKEN_URL: `${SSO_AUTH_SERVER_URL}/token`,
  OIDC_INTROSPECT_URL: `${SSO_AUTH_SERVER_URL}/token/introspect`,
  OIDC_LOGOUT_URL: `${SSO_AUTH_SERVER_URL}/logout`,
  OIDC_GRANT_TYPE: 'authorization_code',
  OIDC_REDIRECT_URL: '/oauth/login/callback',
  OIDC_RESPONSE_TYPE: 'code',
  OIDC_SCOPE: 'email+openid',
  OIDC_LOGOUT_REDIRECT_URL: '/oauth/logout/callback',
  FRONTEND_URL: frontendUrl,
  BACKEND_URL: backendUrl,
};
