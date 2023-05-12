import './App.css'
import NavigationBar from './components/bcgov/NavigationBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@bcgov/bc-sans/css/BCSans.css';

const App = () => {

  return (
    <BrowserRouter>
      <div className="App">
        <NavigationBar />
        <Routes>
          
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
