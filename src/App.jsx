
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import MainLayout from './components/MainLayout.jsx';
import WelcomeScreen from './components/WelcomeAdmin.jsx';
import EditarCliente from './components/EditarCliente.jsx';
import RegistrarCliente from './components/RegistrarCliente.jsx';
import ListaClientes from './components/ListaClientes.jsx';
import CrearCurso from './components/CrearCurso.jsx';
import AdministrarModulos from './components/AdministrarModulos.jsx';
import AdministrarSubcursos from './components/AdministrarSubcursos.jsx';
import Registro from './components/Registro.jsx';
import Empresas from './components/Empresas.jsx';
import CrearInstructor from './components/CrearInstructor';
import EditarInstructor from './components/EditarInstructor';
import VerInstructores from './components/VerInstructores.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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
    setIsAuthenticated(false);
  };

  return (
    <Router>
  <Routes>
    {/* Ruta de Login */}
    <Route
      path="/login"
      element={isAuthenticated ? <Navigate to="/welcome" /> : <Login onSuccess={handleLoginSuccess} />}
    />

    {/* Ruta de Registro */}
    <Route path="/register" element={<Registro />} />

    {/* Rutas protegidas con Sidebar */}
    <Route
      path="/"
      element={isAuthenticated ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" />}
    >
      <Route path="welcome" element={<WelcomeScreen />} />
      <Route path="clients/register" element={<RegistrarCliente />} />
      <Route path="clients" element={<ListaClientes />} />
      <Route path="clients/edit" element={<EditarCliente />} />
      <Route path="courses/create" element={<CrearCurso />} />
      <Route path="courses/subcourses" element={<AdministrarSubcursos />} />
      <Route path="courses/modules" element={<AdministrarModulos />} />
      <Route path="empresas" element={<Empresas />} />
      <Route path="instructors/create" element={<CrearInstructor />} />
      <Route path="instructor/edit/:id" element={<EditarInstructor/>} />
      <Route path="instructors" element={<VerInstructores />} />
      
    </Route>

    {/* Ruta por defecto */}
    <Route path="*" element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} />} />
  </Routes>
</Router>
  );
}

export default App;

