import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';
import { 
  FaBuilding, FaUserTie, FaGraduationCap, FaChartLine, FaSignOutAlt, FaChevronRight, FaHome, FaClipboardList
} from 'react-icons/fa';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const [openEmpresas, setOpenEmpresas] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openMetrics, setOpenMetrics] = useState(false);
  const [openInstructors, setOpenInstructors] = useState(false);
<<<<<<< HEAD
  const [openPruebas, setOpenPruebas] = useState(false); // Nuevo estado para Pruebas
=======

  const role = localStorage.getItem('rol'); // Obtener el rol desde localStorage
>>>>>>> developDavid-local

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('rol'); // Limpiar el rol al cerrar sesión
    navigate('/login');
  };

  const toggleSubmenu = (setter, current) => {
    setter(!current);
  };

  return (
    <aside className="sidebar">
<<<<<<< HEAD
      <div className="sidebar-header">
        <img src="https://via.placeholder.com/40x40" alt="Logo" className="brand-logo" />
        <div className="brand-info">
          <h2 className="brand-title">MyApp</h2>
          <p className="brand-subtitle">Your business, elevated</p>
        </div>
      </div>

      <ul className="main-menu">
        <li className="menu-item" onClick={() => navigate('/welcome')}>
          <button className="menu-button">
            <FaHome className="menu-icon" /> Inicio
          </button>
        </li>

        <li className="menu-item">
          <button onClick={() => toggleSubmenu(setOpenEmpresas, openEmpresas)} className="menu-button">
            <FaBuilding className="menu-icon" /> Administrar Empresas
            <FaChevronRight className={`chevron ${openEmpresas ? 'rotated' : ''}`} />
=======
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
            <button className="menu-button" onClick={() => navigate('/estudiantes')}>
              Estudiantes
            </button>
          </li>
        )}

        {/* Métricas (común a todos los roles) */}
        <li>
          <button onClick={() => setOpenMetrics(!openMetrics)} className="menu-button">
            Métricas
>>>>>>> developDavid-local
          </button>
          <ul className={`submenu ${openEmpresas ? 'open' : ''}`}>
            <li onClick={() => navigate('/empresas')}>Empresas</li>
          </ul>
        </li>

        <li className="menu-item">
          <button onClick={() => toggleSubmenu(setOpenInstructors, openInstructors)} className="menu-button">
            <FaUserTie className="menu-icon" /> Administrar Instructores
            <FaChevronRight className={`chevron ${openInstructors ? 'rotated' : ''}`} />
          </button>
          <ul className={`submenu ${openInstructors ? 'open' : ''}`}>
            <li onClick={() => navigate('/instructors/create')}>Crear Instructor</li>
            <li onClick={() => navigate('/instructors')}>Ver Instructores</li>
          </ul>
        </li>

        <li className="menu-item">
          <button onClick={() => toggleSubmenu(setOpenCourses, openCourses)} className="menu-button">
            <FaGraduationCap className="menu-icon" /> Administrar Cursos
            <FaChevronRight className={`chevron ${openCourses ? 'rotated' : ''}`} />
          </button>
          <ul className={`submenu ${openCourses ? 'open' : ''}`}>
            <li onClick={() => navigate('/courses/list')}>Panel de Cursos</li>
            <li onClick={() => navigate('/courses/subcourses')}>Administrar Subcursos</li>
            <li onClick={() => navigate('/courses/subcourses/module')}>Administrar Módulos</li>
          </ul>
        </li>

        {/* Nuevo menú para Administrar Prueba */}
        <li className="menu-item">
          <button onClick={() => toggleSubmenu(setOpenPruebas, openPruebas)} className="menu-button">
            <FaClipboardList className="menu-icon" /> Administrar Prueba
            <FaChevronRight className={`chevron ${openPruebas ? 'rotated' : ''}`} />
          </button>
          <ul className={`submenu ${openPruebas ? 'open' : ''}`}>
            <li onClick={() => navigate('/pruebas')}>Ver Pruebas</li>
            <li onClick={() => navigate('/pruebas/create')}>Crear Prueba</li>
          </ul>
        </li>

        <li className="menu-item">
          <button onClick={() => toggleSubmenu(setOpenMetrics, openMetrics)} className="menu-button">
            <FaChartLine className="menu-icon" /> Métricas
            <FaChevronRight className={`chevron ${openMetrics ? 'rotated' : ''}`} />
          </button>
          <ul className={`submenu ${openMetrics ? 'open' : ''}`}>
            <li>Ver Métricas</li>
          </ul>
        </li>
      </ul>

      {/* Botón de cerrar sesión */}
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="menu-icon" /> Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;
