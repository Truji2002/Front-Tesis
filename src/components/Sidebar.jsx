// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Sidebar.css';

// const Sidebar = ({ onLogout }) => {
//   const navigate = useNavigate();

//   const [openEmpresas, setOpenEmpresas] = useState(false); // Nuevo estado para empresas
//   const [openCourses, setOpenCourses] = useState(false);
//   const [openMetrics, setOpenMetrics] = useState(false);

//   const handleLogout = () => {
//     onLogout(); // Llama a la función para desautenticar
//     navigate('/login'); // Redirige a la página de login
//   };

//   return (
//     <aside className="sidebar">
//       <h2>Menú</h2>
//       <ul>
//         {/* Administrar Empresas */}
//         <li>
//       <button onClick={() => setOpenEmpresas(!openEmpresas)} className="menu-button">
//         Administrar Empresas
//       </button>
//       {openEmpresas && (
//         <ul className="submenu">
//           <li
//             onClick={() => {
//               navigate('/empresas');
//             }}
//           >
//             Empresas
//           </li>
//         </ul>
//       )}
//     </li>

//         {/* Administrar Cursos */}
//         <li>
//           <button onClick={() => setOpenCourses(!openCourses)} className="menu-button">
//             Administrar Cursos
//           </button>
//           {openCourses && (
//             <ul className="submenu">
//               <li
//                 onClick={() => {
//                   navigate('/courses/create');
//                 }}
//               >
//                 Crear Curso
//               </li>
//               <li
//                 onClick={() => {
//                   navigate('/courses/subcourses');
//                 }}
//               >
//                 Administrar Subcursos
//               </li>
//               <li
//                 onClick={() => {
//                   navigate('/courses/modules');
//                 }}
//               >
//                 Administrar Módulos
//               </li>
//               <li
//                 onClick={() => {
//                   navigate('/courses/tests');
//                 }}
//               >
//                 Administrar Prueba
//               </li>
//             </ul>
//           )}
//         </li>

//         {/* Métricas */}
//         <li>
//           <button onClick={() => setOpenMetrics(!openMetrics)} className="menu-button">
//             Métricas
//           </button>
//         </li>
//       </ul>
//       <button className="logout-button" onClick={handleLogout}>
//         Cerrar sesión
//       </button>
//     </aside>
//   );
// };

// export default Sidebar;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const [openEmpresas, setOpenEmpresas] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openMetrics, setOpenMetrics] = useState(false);
  const [openInstructors, setOpenInstructors] = useState(false); // Nuevo estado para instructores

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h2>Menú</h2>
      <ul>
        {/* Administrar Empresas */}
        <li>
          <button onClick={() => setOpenEmpresas(!openEmpresas)} className="menu-button">
            Administrar Empresas
          </button>
          {openEmpresas && (
            <ul className="submenu">
              <li
                onClick={() => {
                  navigate('/empresas');
                }}
              >
                Empresas
              </li>
            </ul>
          )}
        </li>
        {/* Administrar Instructores */}
        <li>
          <button onClick={() => setOpenInstructors(!openInstructors)} className="menu-button">
            Administrar Instructores
          </button>
          {openInstructors && (
            <ul className="submenu">
              <li
                onClick={() => {
                  navigate('/instructors/create');
                }}
              >
                Crear Instructor
              </li>
              <li
                onClick={() => {
                  navigate('/instructors');
                }}
              >
                Ver Instructores
              </li>
              <li
                onClick={() => {
                  navigate('/instructors/change');
                }}
              >
                Cambiar Instructor
              </li>
            </ul>
          )}
        </li>
        {/* Administrar Cursos */}
        <li>
          <button onClick={() => setOpenCourses(!openCourses)} className="menu-button">
            Administrar Cursos
          </button>
          {openCourses && (
            <ul className="submenu">
              <li
                onClick={() => {
                  navigate('/courses/create');
                }}
              >
                Crear Curso
              </li>
              <li
                onClick={() => {
                  navigate('/courses/subcourses');
                }}
              >
                Administrar Subcursos
              </li>
              <li
                onClick={() => {
                  navigate('/courses/modules');
                }}
              >
                Administrar Módulos
              </li>
              <li
                onClick={() => {
                  navigate('/courses/tests');
                }}
              >
                Administrar Prueba
              </li>
            </ul>
          )}
        </li>



        {/* Métricas */}
        <li>
          <button onClick={() => setOpenMetrics(!openMetrics)} className="menu-button">
            Métricas
          </button>
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;
