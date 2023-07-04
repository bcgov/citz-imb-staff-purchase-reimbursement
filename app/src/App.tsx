import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import '@bcgov/bc-sans/css/BCSans.css';
import Home from './pages/Home';
import IndividualRequest from './pages/IndividualRequest';
import NavigationBar from './components/bcgov/NavigationBar';
import { KeycloakWrapper, useAuthService } from './keycloak';
import { normalFont } from './constants/fonts';
import Login from './pages/Login';
import UserRequests from './pages/UserRequests';
import './App.css';
import ErrorWrapper from './components/custom/notifications/ErrorWrapper';

/**
 * @returns Main element containing various providers and routes.
 */
const App = () => {
  const { state: authState } = useAuthService();
  const user = authState.userInfo;

  const container = {
    minWidth: '1200px',
    maxWidth: '1600px',
    width: '90%',
    margin: '2em auto',
    paddingTop: '60px',
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <div style={{ ...normalFont }} className='App'>
          <ErrorWrapper>
            <NavigationBar />
            <KeycloakWrapper>
              <div style={container}>
                {user ? (
                  <Routes>
                    <Route index element={<Home />} />
                    <Route path='request/:id' element={<IndividualRequest />} />
                    <Route path='user/:idir' element={<UserRequests />} />
                  </Routes>
                ) : (
                  <Login />
                )}
              </div>
            </KeycloakWrapper>
          </ErrorWrapper>
        </div>
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;
