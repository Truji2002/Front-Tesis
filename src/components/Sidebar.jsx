import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const [openEmpresas, setOpenEmpresas] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openMetrics, setOpenMetrics] = useState(false);
  const [openInstructors, setOpenInstructors] = useState(false);

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

        {/* Administrar Cursos */}
        {role === 'admin' && (
          <li>
            <button onClick={() => setOpenCourses(!openCourses)} className="menu-button">
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
        {/* Administrar Empresas */}
        {role === 'admin' && (
          <li>
            <button onClick={() => setOpenEmpresas(!openEmpresas)} className="menu-button">
              Administrar Empresas
            </button>
            {openEmpresas && (
              <ul className="submenu">
                <li onClick={() => navigate('/empresas')}>Empresas</li>
              </ul>
            )}
          </li>
        )}

        

        {/* Administrar Instructores */}
        {role === 'admin' && (
          <li>
            <button onClick={() => setOpenInstructors(!openInstructors)} className="menu-button">
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

        

        {/* Opción de Estudiantes para el rol instructor */}
        {role === 'instructor' && (
          <li>
            <button className="menu-button" onClick={() => navigate('/students')}>
            Progreso Estudiantes
            </button>
          </li>
          
        )}
        

        {/* Métricas (común a todos los roles) */}
        <li>
          <button onClick={() => setOpenMetrics(!openMetrics)} className="menu-button">
            Métricas
          </button>
        </li>
      </ul>

      {/* Botón de cerrar sesión */}
      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;
