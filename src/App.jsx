import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import './components/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Properties from './components/Properties';
import Bookings from './components/Bookings';
import UserSettings from './components/UserSettings';

function App() {
  const [userInfo, setUserInfo] = React.useState({});

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home  userInfo={userInfo}/>}/>
        <Route path="/login" element={<Login handleLogin={(value) => {
          setUserInfo(value);
          localStorage.setItem('userInfo', JSON.stringify(value));
        }}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties" element={<Properties userInfo={userInfo}/>} />
        <Route path="/bookings" element={<Bookings  userInfo={userInfo}/>} />
        <Route path="/settings" element={<UserSettings  userInfo={userInfo}/>} />
      </Routes>
    </Router>
  );
}

export default App;