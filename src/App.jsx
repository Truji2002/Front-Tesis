import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import WelcomeScreen from './components/WelcomeAdmin.jsx';
import Registro from './components/Registro.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica si el token está en localStorage para mantener la autenticación
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('nombre');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/welcome" />
              ) : (
                <Login onSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/welcome"
            element={
              isAuthenticated ? (
                <WelcomeScreen onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/welcome" />
              ) : (
                <Registro />
              )
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
