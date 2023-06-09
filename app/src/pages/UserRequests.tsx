import { useCallback, useEffect, useState } from 'react';
import Constants from '../constants/Constants';
import axios from 'axios';
import RequestsTable from '../components/custom/tables/RequestsTable';
import { headerFont } from '../constants/fonts';
import { useAuthService } from '../keycloak';
import { useParams } from 'react-router-dom';

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const { BACKEND_URL, FRONTEND_URL } = Constants;
  const { state: authState } = useAuthService();
  const isAdmin = authState.userInfo.client_roles?.includes('admin');
  const { idir } = useParams();

  // Fires on page load.
  useEffect(() => {
    if (isAdmin){
      getRequests();
    } else {
      console.warn('User is not permitted to view these records.')
    }
  }, []);

  // Retrieves a list of all reimbursement requests and updates state.
  const getRequests = useCallback(async () => {
    const targetURL = `${BACKEND_URL}/api/requests/idir?minimal=true&idir=${idir}`;
    try {
      const { data } = await axios.get(targetURL, {
        headers: {
          Authorization : `Bearer ${authState.accessToken}`
        }
      })
      setRequests(data);
    } catch (e) {
      console.warn('Server could not be reached.');
    }
  }, []);

  if (!isAdmin){
    return (<>
      <h1>You do not have permission to view this page.</h1>
      <p>If you think you are seeing this by mistake, contact your administrator.</p>
    </>);
  } else

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <h2 style={headerFont}>Reimbursement Requests</h2>
      </div>  
      <RequestsTable data={requests} />
    </>
  );
}

export default UserRequests;
