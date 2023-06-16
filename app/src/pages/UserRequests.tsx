import { useCallback, useEffect, useState } from 'react';
import Constants from '../constants/Constants';
import axios from 'axios';
import RequestsTable from '../components/custom/tables/RequestsTable';
import { headerFont } from '../constants/fonts';
import { useAuthService } from '../keycloak';
import { useNavigate, useParams } from 'react-router-dom';
import { buttonStyles } from '../components/bcgov/ButtonStyles';
import ActionButton from '../components/bcgov/ActionButton';

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const { BACKEND_URL } = Constants;
  const { state: authState } = useAuthService();
  const isAdmin = authState.userInfo.client_roles?.includes('admin');
  const { idir } = useParams();
  const navigate = useNavigate();

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
    } catch (e: unknown) {
      if (axios.isAxiosError(e)){
        const status = e.response!.status;
        switch(status){
          case 401:
            console.warn('User is unauthenticated. Redirecting to login.');
            window.location.reload();
            break;
          case 404:
            // User has no records.
            setRequests([]);
            break;
          default:
            console.warn(e);
            break;
        }
      } else {
        console.warn(e);
      }      
    }
  }, []);

  if (!isAdmin){
    return (<>
      <h1>You do not have permission to view this page.</h1>
      <p style={{ margin: '1em 0'}}>If you think you are seeing this by mistake, contact your administrator.</p>
      <ActionButton handler={() => {
        sessionStorage.removeItem('target-page'); // Otherwise navigating to / causes redirect if target is stored.
        navigate('/');
      }} style={buttonStyles.secondary}>Back</ActionButton>
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
