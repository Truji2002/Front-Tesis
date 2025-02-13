import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaBuilding,
  FaUserTie,
  FaChartLine,
  FaGraduationCap ,
} from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [openCourses, setOpenCourses] = useState(false);
  const [openEmpresas, setOpenEmpresas] = useState(false);
  const [openInstructors, setOpenInstructors] = useState(false);

  const role = localStorage.getItem('rol'); // Obtener el rol desde localStorage

  return (
    <aside className="sidebar">
      <h2>Menú</h2>
      <ul>
        {role === 'admin' && (
          <li>
            <button
              onClick={() => setOpenCourses(!openCourses)}
              className="menu-button"
            >
              <FaBook className="icon" />
              Administrar Cursos
            </button>
            {openCourses && (
              <ul className="submenu">
                <li onClick={() => navigate('/courses/list')}>Panel de Cursos</li>
                
              </ul>
            )}
          </li>
        )}
        {role === 'admin' && (
          <li>
            <button
              onClick={() => setOpenEmpresas(!openEmpresas)}
              className="menu-button"
            >
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
            <button
              onClick={() => setOpenInstructors(!openInstructors)}
              className="menu-button"
            >
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

        {/* Opción de Estudiantes para el rol instructor */}
        {role === 'instructor' && (
          <li>
            <button className="menu-button" onClick={() => navigate('/students')}>
            <FaGraduationCap className="icon" />
            Progreso Estudiantes

            </button>
          </li>
         
        )}
        
        {/* Métricas (común a todos los roles) */}
        <li>
          <button
            className="menu-button"
            onClick={() => {
              if (role === 'admin') {
                navigate('/dashboard'); // Ruta para el administrador
              } else if (role === 'instructor') {
                navigate('/metrics'); // Ruta para el instructor
              }
            }}
          >
            <FaChartLine className="icon" />
            Métricas
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
