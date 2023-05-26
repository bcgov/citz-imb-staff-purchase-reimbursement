import './App.css'
import NavigationBar from './components/bcgov/NavigationBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@bcgov/bc-sans/css/BCSans.css';
import { normalFont } from './constants/fonts';
import Home from './pages/Home';
import IndividualRequest from './pages/IndividualRequest'; 
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { KeycloakWrapper } from './keycloak';
import { useAuthService } from './keycloak';
import Login from './pages/Login';

const App = () => {
  const { state: authState } = useAuthService();
  const user = authState.userInfo;

  const container = {
    maxWidth: '90%',
    minWidth: '70%',
    width: 'fit-content',
    margin: '2em auto',
    paddingTop: '60px'
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <div style={{...normalFont}} className='App'>
          <NavigationBar />
          <KeycloakWrapper>
            <div style={container}>
              { user
              ? <Routes>
                  <Route index element={<Home/>} />
                  <Route path={'request/:id'} element={<IndividualRequest />}/>
                </Routes>
              : <Login/> }
            </div>
          </KeycloakWrapper>
        </div>
      </BrowserRouter>
    </LocalizationProvider>
  )
}

export default App
