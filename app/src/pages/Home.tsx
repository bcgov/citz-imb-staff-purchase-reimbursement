import { useCallback, useEffect, useState } from 'react';
import Constants from '../constants/Constants';
import axios from 'axios';
import RequestsTable from '../components/custom/tables/RequestsTable';
import { headerFont } from '../constants/fonts';
import { useAuthService } from '../keycloak';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@mui/material';

/**
 * @description The Home page, showing a list of reimbursement requests. 
 * @returns A React element
 */
const Home = () => {
  const [requests, setRequests] = useState([]);
  const { BACKEND_URL, FRONTEND_URL } = Constants;
  const { state: authState } = useAuthService();
  const isAdmin = authState.userInfo.client_roles?.includes('admin');
  const [adminView, setAdminView] = useState<boolean>(isAdmin);
  const navigate = useNavigate();

  // Fires on page load.
  useEffect(() => {
    const targetPage = sessionStorage.getItem('target-page');
    if (targetPage && targetPage !== FRONTEND_URL){
      sessionStorage.clear()
      navigate(targetPage);
    } else {
      getRequests();
    }
  }, [adminView]);

  // Retrieves a list of all reimbursement requests and updates state.
  const getRequests = useCallback(async () => {
    const targetURL = adminView
                      ? `${BACKEND_URL}/api/requests?minimal=true`
                      : `${BACKEND_URL}/api/requests/idir?minimal=true&idir=${authState.userInfo.idir_user_guid}`;
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
  }, [adminView]);

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <h2 style={headerFont}>Reimbursement Requests</h2>
        {
          isAdmin
          ? <div style={{
                margin: '1em 0 1em 1em'
              }}>
              <span style={headerFont}>Admin View</span>
              <Switch 
                value={adminView} 
                onChange={(e) => {
                  setAdminView(!adminView);
                }}
              />
            </div>   
          : <></>
        }
      </div>  
      <RequestsTable data={requests} />
    </>
  );
}

export default Home;
