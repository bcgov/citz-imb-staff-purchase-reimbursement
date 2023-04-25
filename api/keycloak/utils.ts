import axios from 'axios';
import qs from 'qs';

import configuration from './configuration';
const {
  SSO_CLIENT_ID,
  SSO_CLIENT_SECRET,
  OIDC_AUTHORIZATION_URL,
  OIDC_TOKEN_URL,
  OIDC_USER_INFO_URL,
  OIDC_LOGOUT_URL,
  OIDC_GRANT_TYPE,
  OIDC_REDIRECT_URL,
  OIDC_RESPONSE_TYPE,
  OIDC_SCOPE,
  OIDC_LOGOUT_REDIRECT_URL,
  OIDC_INTROSPECT_URL,
  BACKEND_URL,
} = configuration;

const btoa = (originalString: string) => Buffer.from(originalString).toString('base64');

const decodeValue = (base64String: string) => {
  try {
    return JSON.parse(Buffer.from(base64String, 'base64').toString('ascii'));
  } catch {
    return '';
  }
};

const decodingJWT = (token: string) => {
  if (!token) return null;

  const [header, payload] = token.split('.');

  return {
    header: decodeValue(header),
    payload: decodeValue(payload),
  };
};

// See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
export const getAuthorizationUrl = async () => {
  const params = {
    client_id: SSO_CLIENT_ID,
    response_type: OIDC_RESPONSE_TYPE,
    scope: OIDC_SCOPE,
    redirect_uri: BACKEND_URL + OIDC_REDIRECT_URL,
  };

  return `${OIDC_AUTHORIZATION_URL}?${qs.stringify(params, { encode: false })}`;
};

// See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
export const getAccessToken = async (code: unknown) => {
  const url = OIDC_TOKEN_URL;
  const params = {
    grant_type: OIDC_GRANT_TYPE,
    client_id: SSO_CLIENT_ID,
    redirect_uri: BACKEND_URL + OIDC_REDIRECT_URL,
    code,
  };

  const config = {
    url,
    method: 'POST',
    data: qs.stringify(params),
    headers: {},
  };

  if (SSO_CLIENT_SECRET) {
    config.headers = {
      Authorization: `Basic ${btoa(`${SSO_CLIENT_ID}:${SSO_CLIENT_SECRET}`)}`,
    };
  }

  const { data } = await axios(config);

  const { id_token, access_token, refresh_token } = data;

  // Decode tokens to get user information
  data.id_token_decoded = decodingJWT(id_token);

  data.access_token_decoded = decodingJWT(access_token);

  data.refresh_token_decoded = decodingJWT(refresh_token);

  return data;
};

interface IGetUserInfo {
  accessToken: string;
}

export const getUserInfo = async ({ accessToken }: IGetUserInfo) => {
  const { data } = await axios({
    url: OIDC_USER_INFO_URL,
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};

export const getLogoutUrl = () => {
  const params = {
    client_id: SSO_CLIENT_ID,
    redirect_uri: BACKEND_URL + OIDC_LOGOUT_REDIRECT_URL,
  };

  return `${OIDC_LOGOUT_URL}?${qs.stringify(params, { encode: false })}`;
};

export const isJWTValid = async (jwt: string) => {
  const headersList = {
    Accept: '*/*',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const bodyContent = `client_id=${SSO_CLIENT_ID}&client_secret=${SSO_CLIENT_SECRET}&token=${jwt}`;

  const response = await fetch(OIDC_INTROSPECT_URL, {
    method: 'POST',
    body: bodyContent,
    headers: headersList,
  });

  const data = await response.json();
  return data.active;
};

export const getUserData = (accessToken: string) => {
  const data = decodingJWT(accessToken);
  if (data) {
    return data.payload;
  }
  return null;
};
