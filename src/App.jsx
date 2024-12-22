import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import MainLayout from './components/MainLayout.jsx';
import WelcomeScreen from './components/WelcomeAdmin.jsx';
import CrearCurso from './components/CrearCurso.jsx';

import Registro from './components/Registro.jsx';
import Empresas from './components/Empresas.jsx';
import CrearInstructor from './components/CrearInstructor';
import EditarInstructor from './components/EditarInstructor';
import VerInstructores from './components/VerInstructores.jsx'; 
import ListaCursos from './components/ListaCursos.jsx';
import EditarCurso from './components/EditarCurso.jsx';
import ListaSubcursos from './components/ListaSubcursos.jsx';
import CrearSubcurso from './components/CrearSubcurso.jsx';
<<<<<<< HEAD
import CrearPrueba from './components/CrearPrueba.jsx';
import ListaPruebas from './components/ListaPruebas.jsx'; // Asegúrate de importar esto
import CrearPregunta from './components/CrearPregunta.jsx';
import ListaPreguntas from './components/ListaPreguntas.jsx';

import EditarPrueba from './components/EditarPrueba.jsx'; // Ajusta la ruta según tu estructura de archivos
import EditarPregunta from './components/EditarPregunta.jsx';
import EstudianteDashboard from './components/EstudianteDashboard';
=======
import EditarSubcurso from './components/EditarSubcurso.jsx';
import CambiarContraseña from './components/CambiarContraseña.jsx';
>>>>>>> developDavid-local


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

<<<<<<< HEAD
        {/* Rutas protegidas con Sidebar */}
        <Route
          path="/"
          element={isAuthenticated ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" />}
        >
          <Route path="welcome" element={<WelcomeScreen />} />
          <Route path="courses/subcourses" element={<AdministrarSubcursos />} />
          <Route path="courses/modules" element={<AdministrarModulos />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="instructors/create" element={<CrearInstructor />} />
          <Route path="instructor/edit/:id" element={<EditarInstructor/>} />
          <Route path="instructors" element={<VerInstructores />} />
          <Route path="courses/create" element={<CrearCurso />} />
          <Route path="courses/list" element={<ListaCursos />} />
          <Route path="course/edit/:id" element={<EditarCurso />} />
          <Route path="courses/:cursoId/subcourses" element={<ListaSubcursos />} />
          <Route path="subcourses/create/:cursoId" element={<CrearSubcurso />} />
          <Route path="pruebas" element={<ListaPruebas />} />
          <Route path="pruebas/create" element={<CrearPrueba />} />
          <Route path="pruebas/:pruebaId/preguntas" element={<ListaPreguntas />} />
=======
    {/* Ruta de Registro */}

    <Route path="/change-password" element={<CambiarContraseña />} />

    {/* Rutas protegidas con Sidebar */}
    <Route
      path="/"
      element={isAuthenticated ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" />}
    >
      <Route path="welcome" element={<WelcomeScreen />} />
      <Route path="empresas" element={<Empresas />} />
      <Route path="instructors/create" element={<CrearInstructor />} />
      <Route path="instructor/edit/:id" element={<EditarInstructor/>} />
      <Route path="instructors" element={<VerInstructores />} />
      <Route path="courses/create" element={<CrearCurso />} />
      <Route path="courses/list" element={<ListaCursos />} />
      <Route path="course/edit/:id" element={<EditarCurso />} />
      <Route path="/courses/:cursoId/subcourses" element={<ListaSubcursos />} />
      <Route path="/subcourses/create/:cursoId" element={<CrearSubcurso />} />
      <Route path="/subcourses/edit/:subcursoId" element={<EditarSubcurso />} />
      
    </Route>
>>>>>>> developDavid-local

<Route path="pruebas/:pruebaId/preguntas/create" element={<CrearPregunta />} />
<Route path="pruebas/:id/edit" element={<EditarPrueba />} />
<Route path="pruebas/:id/edit" element={<EditarPrueba />} />
<Route path="pruebas/:pruebaId/preguntas/:preguntaId/edit" element={<EditarPregunta />} />

        </Route>
        <Route path="/estudiante/dashboard" element={<EstudianteDashboard />} />


        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
