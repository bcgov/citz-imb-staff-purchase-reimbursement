/* eslint-disable camelcase */
import axios from 'axios';
import qs from 'qs';
import configuration from './configuration';

const {
  SSO_CLIENT_ID,
  SSO_CLIENT_SECRET,
  OIDC_AUTHORIZATION_URL,
  OIDC_TOKEN_URL,
  OIDC_LOGOUT_URL,
  OIDC_GRANT_TYPE,
  OIDC_REDIRECT_URL,
  OIDC_RESPONSE_TYPE,
  OIDC_SCOPE,
  OIDC_LOGOUT_REDIRECT_URL,
  OIDC_INTROSPECT_URL,
  BACKEND_URL,
} = configuration;

// Encodes a string to a Base64-encoded string.
const encodeToBase64 = (string: string) => Buffer.from(string).toString('base64');

// Decodes a Base64-encoded string to a JSON object.
const decodeBase64ToJSON = (base64String: string) => {
  try {
    return JSON.parse(Buffer.from(base64String, 'base64').toString('ascii'));
  } catch {
    throw new Error('Invalid input in decodeBase64ToJSON()');
  }
};

// Parses a JWT and returns an object with decoded header and payload.
const parseJWT = (token: string) => {
  if (!token) return null;
  const [header, payload] = token.split('.');

  return {
    header: decodeBase64ToJSON(header),
    payload: decodeBase64ToJSON(payload),
  };
};

// Gets decoded tokens and user information from the OIDC server using a code.
// See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
export const getTokens = async (code: unknown) => {
  const params = {
    grant_type: OIDC_GRANT_TYPE,
    client_id: SSO_CLIENT_ID,
    redirect_uri: BACKEND_URL + OIDC_REDIRECT_URL,
    code,
  };
  const headers = SSO_CLIENT_ID
    ? { Authorization: `Basic ${encodeToBase64(`${SSO_CLIENT_ID}:${SSO_CLIENT_SECRET}`)}` }
    : {};

  const { data } = await axios.post(OIDC_TOKEN_URL, qs.stringify(params), { headers });

  const { id_token, access_token, refresh_token } = data;
  const id_token_decoded = parseJWT(id_token);
  const access_token_decoded = parseJWT(access_token);
  const refresh_token_decoded = parseJWT(refresh_token);

  return { ...data, id_token_decoded, access_token_decoded, refresh_token_decoded };
};

// Use refresh token to get a new access token.
export const getNewAccessToken = async (refresh_token: string) => {
  const params = {
    grant_type: 'refresh_token',
    client_id: SSO_CLIENT_ID,
    client_secret: SSO_CLIENT_SECRET,
    refresh_token,
  };

  const {
    data: { access_token },
  } = await axios.post(OIDC_TOKEN_URL, qs.stringify(params));
  return access_token;
};

// Gets the authorization URL to redirect the user to the OIDC server for authentication.
// See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
export const getAuthorizationUrl = (): string => {
  const params = {
    client_id: SSO_CLIENT_ID,
    response_type: OIDC_RESPONSE_TYPE,
    scope: OIDC_SCOPE,
    redirect_uri: BACKEND_URL + OIDC_REDIRECT_URL,
  };

  return `${OIDC_AUTHORIZATION_URL}?${qs.stringify(params, { encode: false })}`;
};

// Gets the logout URL to redirect the user to the OIDC server for logout.
export const getLogoutUrl = (): string => {
  const params = {
    client_id: SSO_CLIENT_ID,
    redirect_uri: BACKEND_URL + OIDC_LOGOUT_REDIRECT_URL,
  };

  return `${OIDC_LOGOUT_URL}?${qs.stringify(params, { encode: false })}`;
};

// Checks if a JWT is valid.
export const isJWTValid = async (jwt: string): Promise<boolean> => {
  const params = {
    client_id: SSO_CLIENT_ID,
    client_secret: SSO_CLIENT_SECRET,
    token: jwt,
  };
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const {
    data: { active },
  } = await axios.post(OIDC_INTROSPECT_URL, qs.stringify(params), { headers });

  return active;
};

// Gets user information from parsing an access token JWT.
export const getUserInfo = (access_token: string) => {
  const data = parseJWT(access_token);
  if (!data) return null;
  return data.payload;
};

// Describes the user info contained in the request
export interface User {
  idir_user_guid: string;
  identity_provider: string;
  idir_username: string;
  name: string;
  preferred_username: string;
  given_name: string;
  display_name: string;
  family_name: string;
  email: string;
  client_roles?: string[];
}
