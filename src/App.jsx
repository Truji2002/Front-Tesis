import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import MainLayout from './components/MainLayout.jsx';
import WelcomeScreen from './components/WelcomeAdmin.jsx';
import CrearCurso from './components/CrearCurso.jsx';
import StudentLayout from './components/StudentLayout.jsx';

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
import StudentCourses from './components/StudentCourses.jsx';
import Subcourses from './components/Subcourses.jsx';
import ListaPruebas from './components/ListaPruebas.jsx';
import CrearPrueba from './components/CrearPrueba.jsx';
import PreguntasPrueba from './components/PreguntasPrueba.jsx';
import EditarPregunta from './components/EditarPregunta.jsx';
import AdministrarPreguntas from "./components/AdministrarPreguntas.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedRole = localStorage.getItem('rol');

    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setRole(localStorage.getItem('rol'));
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('rol');
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <Router>
      <Routes>
        {/* Rutas de acceso */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={role === 'estudiante' ? '/student/courses' : '/welcome'} />
            ) : (
              <Login onSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route path="/register" element={<Registro />} />
        <Route path="/change-password" element={<CambiarContraseña />} />

        {/* Rutas para estudiantes */}
        <Route
          path="/student"
          element={
            isAuthenticated && role === 'estudiante' ? (
              <StudentLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="courses" element={<StudentCourses />} />
          <Route path="course/:cursoId" element={<Subcourses />} />
        </Route>

        {/* Rutas para administradores/instructores */}
        <Route
          path="/"
          element={
            isAuthenticated && role !== 'estudiante' ? (
              <MainLayout onLogout={handleLogout} />
            ) : (
              <Navigate to={role === 'estudiante' ? '/student/courses' : '/login'} />
            )
          }
        >
          {/* General */}
          <Route path="welcome" element={<WelcomeScreen />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="instructors/create" element={<CrearInstructor />} />
          <Route path="instructor/edit/:id" element={<EditarInstructor />} />
          <Route path="instructors" element={<VerInstructores />} />
          <Route path="students" element={<VerEstudiantes />} />

          {/* Rutas de cursos */}
          <Route path="courses/create" element={<CrearCurso />} />
          <Route path="courses/list" element={<ListaCursos />} />
          <Route path="course/edit/:id" element={<EditarCurso />} />
          <Route path="courses/:cursoId/subcourses" element={<ListaSubcursos />} />
          <Route path="subcourses/create/:cursoId" element={<CrearSubcurso />} />
          <Route path="subcourses/edit/:subcursoId" element={<EditarSubcurso />} />

          {/* Rutas de pruebas */}
          <Route path="pruebas/list" element={<ListaPruebas />} />
<Route path="pruebas/create" element={<CrearPrueba />} />
<Route path="/preguntas/:pruebaId" element={<PreguntasPrueba />} />
<Route path="/preguntas/edit/:id" element={<EditarPregunta />} />
<Route path="/administrar-preguntas/:id" element={<AdministrarPreguntas />} />
        </Route>

        {/* Ruta por defecto */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? (role === 'estudiante' ? '/student/courses' : '/welcome') : '/login'}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
