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
import EditarSubcurso from './components/EditarSubcurso.jsx';
import CambiarContraseña from './components/CambiarContraseña.jsx';
import VerEstudiantes from './components/VerEstudiantes.jsx';
import ListaPruebas from './components/ListaPruebas.jsx';
import CrearPrueba from './components/CrearPrueba.jsx';
import PreguntasPrueba from './components/PreguntasPrueba.jsx';
import EditarPregunta from './components/EditarPregunta';
import AdministrarPreguntas from "./components/AdministrarPreguntas";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    window.location.href = "/welcome"; // Redirección directa después de iniciar sesión
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    window.location.href = "/login"; // Redirección directa después de cerrar sesión
  };

  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/welcome" replace /> : <Login onSuccess={handleLoginSuccess} />}
        />
        {/* Ruta de Registro */}
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/welcome" replace /> : <Registro />}
        />
        <Route path="/change-password" element={<CambiarContraseña />} />

        {/* Rutas protegidas con Sidebar */}
        <Route
          path="/"
          element={isAuthenticated ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        >
          <Route path="welcome" element={<WelcomeScreen />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="instructors/create" element={<CrearInstructor />} />
          <Route path="instructor/edit/:id" element={<EditarInstructor />} />
          <Route path="instructors" element={<VerInstructores />} />
          <Route path="courses/create" element={<CrearCurso />} />
          <Route path="courses/list" element={<ListaCursos />} />
          <Route path="course/edit/:id" element={<EditarCurso />} />
          <Route path="/courses/:cursoId/subcourses" element={<ListaSubcursos />} />
          <Route path="/subcourses/create/:cursoId" element={<CrearSubcurso />} />
          <Route path="/subcourses/edit/:subcursoId" element={<EditarSubcurso />} />
          <Route path="students" element={<VerEstudiantes />} />
          <Route path="pruebas/list" element={<ListaPruebas />} />
          <Route path="pruebas/create" element={<CrearPrueba />} />
          <Route path="/preguntas/:pruebaId" element={<AdministrarPreguntas/>} />
          <Route path="/preguntas/edit/:id" element={<EditarPregunta />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
