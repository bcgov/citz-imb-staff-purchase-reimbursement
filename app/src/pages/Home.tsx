import { useCallback, useEffect, useState } from 'react';
import Constants from '../constants/Constants';
import axios from 'axios';
import RequestsTable from '../components/custom/tables/RequestsTable';
import { headerFont } from '../constants/fonts';
import { useAuthService } from '../keycloak';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@mui/material';
import LinkButton from '../components/bcgov/LinkButton';
import { buttonStyles } from '../components/bcgov/ButtonStyles';

/**
 * @description The Home page, showing a list of reimbursement requests.
 * @returns A React element
 */
const Home = () => {
  const [requests, setRequests] = useState([]);
  const { BACKEND_URL, FRONTEND_URL } = Constants;
  const { state: authState } = useAuthService();
  const isAdmin = authState.userInfo.client_roles?.includes('admin');
  const [adminView, setAdminView] = useState<boolean>(
    isAdmin && sessionStorage.getItem('adminView') === 'true',
  );
  const navigate = useNavigate();

  // Fires on page load.
  useEffect(() => {
    const targetPage = sessionStorage.getItem('target-page');
    sessionStorage.removeItem('target-page');
    if (targetPage && targetPage !== FRONTEND_URL) {
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
          Authorization: `Bearer ${authState.accessToken}`,
        },
      });
      setRequests(data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const { status } = e.response!;
        switch (status) {
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
  }, [adminView]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '1em',
        }}
      >
        <h2 style={headerFont}>Reimbursement Requests</h2>
        <div>
          {isAdmin ? (
            <div
              style={{
                margin: '1em 0 1em 1em',
                display: 'inline',
              }}
            >
              <span style={headerFont}>Admin View</span>
              <Switch
                checked={adminView}
                aria-label='Admin View Switch'
                aria-description='Switches the view from admin to user perspectives.'
                onChange={() => {
                  sessionStorage.setItem('adminView', `${!adminView}`);
                  setAdminView(!adminView);
                }}
              />
            </div>
          ) : (
            <></>
          )}
          <LinkButton
            link='https://submit.digital.gov.bc.ca/app/form/submit?f=52e61f0b-ebbd-462a-8e72-972c62c29877'
            style={buttonStyles.primary}
            newTab
          >
            +New Request
          </LinkButton>
        </div>
      </div>
      <RequestsTable data={requests} />
    </>
  );
};

export default Home;
