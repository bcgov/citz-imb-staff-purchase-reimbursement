// Related Resources:
// Wiki: https://github.com/bcgov/sso-keycloak/wiki/CSS-API-Account
// Swagger: https://api.loginproxy.gov.bc.ca/openapi/swagger

import axios from 'axios';
import oauth from 'axios-oauth-client';

const { CSS_API_TOKEN_URL, CSS_API_CLIENT_ID, CSS_API_CLIENT_SECRET, CSS_API_BASE_URL } =
  process.env;

/**
 * @interface
 * @description The contents of an IDIR User sent back from the CSS API.
 * @property {string} username The user's IDIR shortform. e.g. JSMITH
 * @property {string} firstName The user's first name.
 * @property {string} lastName The user's last name.
 * @property {string} email The user's email.
 * @property {object} attributes A series of string arrays. The values mirror the other fields in this interface.
 */
export interface IDIRUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  attributes: {
    idir_user_guid: [string];
    idir_username: [string];
    display_name: [string];
  };
}

/**
 * @description Gets a bearer token from the CSS API needed to make additional calls for project-related information.
 */
const getClientCredentials = oauth.clientCredentials(
  axios.create(),
  CSS_API_TOKEN_URL as string,
  CSS_API_CLIENT_ID as string,
  CSS_API_CLIENT_SECRET as string,
);

/**
 * @description Retrieves a user's information based on their IDIR.
 * @param idir A user's unique identification string.
 * @returns {IDIRUser[]} An array of IDIR Users.
 */
export const getIDIRUser = async (idir: string) => {
  try {
    const auth = await getClientCredentials('');
    // => { "access_token": "...", "expires_in": 900, ... }

    const response = await axios.get(`${CSS_API_BASE_URL as string}/idir/users?guid=${idir}`, {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data; // First data is from axios, second from CSS API
  } catch (e) {
    console.log(e);
    return [];
  }
};
