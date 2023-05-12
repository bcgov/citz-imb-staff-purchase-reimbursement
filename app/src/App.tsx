import './App.css'
import NavigationBar from './components/bcgov/NavigationBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@bcgov/bc-sans/css/BCSans.css';
import { normalFont } from './constants/fonts';
import Home from './pages/Home';

const App = () => {
  
  return (
    <BrowserRouter>
      <div style={{...normalFont}} className='App'>
        <NavigationBar />
        <Routes>
          <Route index element={<Home/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
