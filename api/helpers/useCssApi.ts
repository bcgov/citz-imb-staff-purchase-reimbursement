import axios from 'axios';
import oauth from 'axios-oauth-client';

const { CSS_API_TOKEN_URL, CSS_API_CLIENT_ID, CSS_API_CLIENT_SECRET, CSS_API_BASE_URL } =
  process.env;

const getClientCredentials = oauth.clientCredentials(
  axios.create(),
  CSS_API_TOKEN_URL as string,
  CSS_API_CLIENT_ID as string,
  CSS_API_CLIENT_SECRET as string,
);

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
    return response.data;
  } catch (e) {
    console.log(e);
    return [];
  }
};
