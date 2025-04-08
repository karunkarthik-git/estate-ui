import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import './components/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isAuthenticated } from './utils';
import Properties from './components/Properties';
import Bookings from './components/Bookings';
import UserSettings from './components/UserSettings';

function App() {

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/settings" element={<UserSettings />} />
      </Routes>
    </Router>
  );
}

export default App;