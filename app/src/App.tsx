import './App.css'
import NavigationBar from './components/bcgov/NavigationBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@bcgov/bc-sans/css/BCSans.css';
import { normalFont } from './constants/fonts';
import Home from './pages/Home';
import IndividualRequest from './pages/IndividualRequest'; 
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const App = () => {

  const container = {
    maxWidth: '90%',
    minWidth: '50%',
    width: 'fit-content',
    margin: '2em auto'
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <div style={{...normalFont}} className='App'>
          <NavigationBar />
          <div style={container}>
            <Routes>
              <Route index element={<Home/>} />
              <Route path={'request/:id'} element={<IndividualRequest />}/>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </LocalizationProvider>
  )
}

export default App
