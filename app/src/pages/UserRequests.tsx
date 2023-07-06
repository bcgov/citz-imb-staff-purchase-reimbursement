import { useCallback, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RequestsTable from '../components/custom/tables/RequestsTable';
import { headerFont } from '../constants/fonts';
import { useAuthService } from '../keycloak';
import BackButton from '../components/bcgov/BackButton';
import { marginBlock } from '../constants/styles';
import Constants from '../constants/Constants';
import { ReimbursementRequest } from '../interfaces/ReimbursementRequest';
import { ErrorContext, errorStyles } from '../components/custom/notifications/ErrorWrapper';

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const { BACKEND_URL } = Constants;
  const { state: authState } = useAuthService();
  const isAdmin = authState.userInfo.client_roles?.includes('admin');
  const { idir } = useParams();

  // Error notification
  const { setErrorState } = useContext(ErrorContext);

  // Fires on page load.
  useEffect(() => {
    if (isAdmin) {
      getRequests();
    } else {
      console.warn('User is not permitted to view these records.');
      setErrorState({
        text: 'User is not permitted to view these records.',
        open: true,
        style: errorStyles.error,
      });
    }
  }, []);

  // Retrieves a list of all reimbursement requests and updates state.
  const getRequests = useCallback(async () => {
    const targetURL = `${BACKEND_URL}/api/requests/idir?minimal=true&idir=${idir}`;
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
            setErrorState({
              text: 'User is unauthenticated. Redirecting to login.',
              open: true,
            });
            window.location.reload();
            break;
          case 404:
            // User has no records.
            setErrorState({
              text: 'User has no available records.',
              open: true,
            });
            setRequests([]);
            break;
          default:
            console.warn(e);
            setErrorState({
              text: 'Could not retrieve records.',
              open: true,
              style: errorStyles.error,
            });
            break;
        }
      } else {
        console.warn(e);
      }
    }
  }, []);

  if (!isAdmin) {
    return (
      <>
        <h1>You do not have permission to view this page.</h1>
        <p style={marginBlock}>
          If you think you are seeing this by mistake, contact your administrator.
        </p>
        <BackButton />
      </>
    );
  } else
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <h2 style={headerFont}>{`${
            (requests.at(0) as unknown as ReimbursementRequest)?.firstName
          }'s Reimbursement Requests`}</h2>
        </div>
        <RequestsTable data={requests} />
      </>
    );
};

export default UserRequests;
