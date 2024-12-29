import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaBuilding,
  FaUserTie,
  FaClipboardList,
  FaChartLine,
  FaSignOutAlt,
} from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const [openCourses, setOpenCourses] = useState(false);
  const [openEmpresas, setOpenEmpresas] = useState(false);
  const [openInstructors, setOpenInstructors] = useState(false);
  const [openPruebas, setOpenPruebas] = useState(false);

  const role = localStorage.getItem('rol'); // Obtener el rol desde localStorage

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('rol'); // Limpiar el rol al cerrar sesión
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h2>Menú</h2>
      <ul>
        {role === 'admin' && (
          <li>
            <button onClick={() => setOpenCourses(!openCourses)} className="menu-button">
              <FaBook className="icon" />
              Administrar Cursos
            </button>
            {openCourses && (
              <ul className="submenu">
                <li onClick={() => navigate('/courses/list')}>Panel de Cursos</li>
                <li onClick={() => navigate('/courses/tests')}>Administrar Prueba</li>
              </ul>
            )}
          </li>
        )}
        {role === 'admin' && (
          <li>
            <button onClick={() => setOpenEmpresas(!openEmpresas)} className="menu-button">
              <FaBuilding className="icon" />
              Administrar Empresas
            </button>
            {openEmpresas && (
              <ul className="submenu">
                <li onClick={() => navigate('/empresas')}>Empresas</li>
              </ul>
            )}
          </li>
        )}
        {role === 'admin' && (
          <li>
            <button onClick={() => setOpenInstructors(!openInstructors)} className="menu-button">
              <FaUserTie className="icon" />
              Administrar Instructores
            </button>
            {openInstructors && (
              <ul className="submenu">
                <li onClick={() => navigate('/instructors/create')}>Crear Instructor</li>
                <li onClick={() => navigate('/instructors')}>Ver Instructores</li>
              </ul>
            )}
          </li>
        )}
        {role === 'admin' && (
          <li>
            <button onClick={() => setOpenPruebas(!openPruebas)} className="menu-button">
              <FaClipboardList className="icon" />
              Administrar Pruebas
            </button>
            {openPruebas && (
              <ul className="submenu">
                <li onClick={() => navigate('/pruebas/list')}>Lista de Pruebas</li>
                <li onClick={() => navigate('/pruebas/create')}>Crear Prueba</li>
              </ul>
            )}
          </li>
        )}
        <li>
          <button className="menu-button" onClick={() => navigate('/metrics')}>
            <FaChartLine className="icon" />
            Métricas
          </button>
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="icon" />
        Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;
