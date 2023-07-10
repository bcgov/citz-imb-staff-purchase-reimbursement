import Constants from '../constants/Constants';
import axios from 'axios';

/**
 * @description Gets all files from a specific request record and downloads them as a .zip file.
 * @param {string} id     - The ID of the request record.
 * @param {string} token  - The authentication token from the user's auth state.
 */
export const getAllFiles = async (id: string, token: string) => {
  const { BACKEND_URL } = Constants;
  const axiosReqConfig = {
    url: `${BACKEND_URL}/api/requests/${id}/files`,
    method: `get`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const file: string = await axios(axiosReqConfig).then((response) => response.data.zip);
  const tempLink = document.createElement('a');
  tempLink.href = file;
  tempLink.download = `allFiles${id}.zip`;
  tempLink.click();
};
