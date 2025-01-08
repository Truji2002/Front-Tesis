// src/App.jsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import MainLayout from "./components/MainLayout.jsx";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import CrearCurso from "./components/CrearCurso.jsx";
import StudentLayout from "./components/StudentLayout.jsx";
import Registro from "./components/Registro.jsx";
import Empresas from "./components/Empresas.jsx";
import CrearInstructor from "./components/CrearInstructor";
import EditarInstructor from "./components/EditarInstructor";
import VerInstructores from "./components/VerInstructores.jsx";
import ListaCursos from "./components/ListaCursos.jsx";
import EditarCurso from "./components/EditarCurso.jsx";
import ListaSubcursos from "./components/ListaSubcursos.jsx";
import CrearSubcurso from "./components/CrearSubcurso.jsx";
import EditarSubcurso from "./components/EditarSubcurso.jsx";
import CambiarContraseña from "./components/CambiarContraseña.jsx";
import VerEstudiantes from "./components/VerEstudiantes.jsx";
import StudentCourses from "./components/StudentCourses.jsx";
import Subcourses from "./components/Subcourses.jsx";
import ListaPruebas from "./components/ListaPruebas.jsx";
import CrearPrueba from "./components/CrearPrueba.jsx"; // Asegúrate de importar CrearPrueba
import AdministrarPrueba from "./components/AdministrarPrueba.jsx";
import PreguntasPrueba from "./components/PreguntasPrueba.jsx";
import EditarPregunta from "./components/EditarPregunta.jsx";
import CrearPregunta from "./components/CrearPregunta.jsx";
import AdministrarPreguntas from "./components/AdministrarPreguntas.jsx";
import TakeTest from './components/TakeTest';

import ContractsManagement from './components/ContractsManagment.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedRole = localStorage.getItem("rol");

    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setRole(localStorage.getItem("rol"));
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("rol");
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={role === "estudiante" ? "/student/courses" : "/"} />
            ) : (
              <Login onSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route path="/register" element={<Registro />} />
        <Route path="/change-password" element={<CambiarContraseña />} />

        {/* Rutas para Estudiantes */}
        <Route
          path="/student"
          element={
            isAuthenticated && role === "estudiante" ? (
              <StudentLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="courses" element={<StudentCourses />} />
          <Route path="course/:cursoId" element={<Subcourses />} />
          <Route path="/student/test/:pruebaId" element={<TakeTest />} />

        </Route>

        {/* Ruta Principal para Administradores/Instructores */}
        <Route
          path="/"
          element={
            isAuthenticated && role !== "estudiante" ? (
              <MainLayout onLogout={handleLogout} />
            ) : (
              <Navigate to={role === "estudiante" ? "/student/courses" : "/login"} />
            )
          }
        >
          <Route index element={<WelcomeScreen />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="instructors/create" element={<CrearInstructor />} />
          <Route path="instructor/edit/:id" element={<EditarInstructor />} />
          <Route path="instructors" element={<VerInstructores />} />
          <Route path="students" element={<VerEstudiantes />} />
          <Route path="courses/create" element={<CrearCurso />} />
          <Route path="courses/list" element={<ListaCursos />} />
          <Route path="course/edit/:id" element={<EditarCurso />} />
          <Route path="courses/:cursoId/subcourses" element={<ListaSubcursos />} />
          <Route path="subcourses/create/:cursoId" element={<CrearSubcurso />} />
          <Route path="subcourses/edit/:subcursoId" element={<EditarSubcurso />} />
          <Route path="pruebas/list" element={<ListaPruebas />} />
          <Route path="pruebas/create" element={<CrearPrueba />} /> {/* Asegúrate de que apunte a CrearPrueba */}
          <Route path="pruebas/admin/:pruebaId" element={<AdministrarPrueba />} />
          <Route path="preguntas/crear" element={<CrearPregunta />} />
          <Route path="preguntas/edit/:id" element={<EditarPregunta />} />
          <Route path="administrar-preguntas/:id" element={<AdministrarPreguntas />} />

          <Route path="/instructor/:id/contracts" element={<ContractsManagement />} />
        </Route>

        {/* Ruta por Defecto */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? (role === "estudiante" ? "/student/courses" : "/") : "/login"}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
