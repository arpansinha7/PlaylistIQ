import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Playlist from './pages/Playlist';

import './App.css';
function App() {
  
    return (

      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/app' element={<Playlist />} />
        </Routes>
      </BrowserRouter>
    );
}

export default App;
