// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Sidebar.css';

// const Sidebar = ({ setSelectedOption, selectedOption, onLogout }) => {
//   const navigate = useNavigate();
  
//   const [openClients, setOpenClients] = useState(false);
//   const [openCourses, setOpenCourses] = useState(false);
//   const [openMetrics,setOpenMetrics] = useState(false);

//   const handleLogout = () => {
//     onLogout(); // Llama a la función para desautenticar
//     navigate('/login'); // Redirige a la página de login
//   };

//   return (
//     <aside className="sidebar">
//       <h2>Menú</h2>
//       <ul>
//         {/* Administrar Clientes */}
//         <li>
//           <button onClick={() => setOpenClients(!openClients)} className="menu-button">
//             Administrar Clientes
//           </button>
//           {openClients && (
//             <ul className="submenu">
//               <li
               
             
//                 onClick={() => setSelectedOption('Registrar Cliente')}
//                 className={selectedOption === 'Registrar Cliente' ? 'selected' : ''}
//               >
//                 Registrar Cliente
               
//               </li>
//               <li
//                 onClick={() => setSelectedOption('Clientes')}
//                 className={selectedOption === 'Clientes' ? 'selected' : ''}
//               >
//                 Clientes
//               </li>
//             </ul>
//           )}
//         </li>

//         {/* Administrar Cursos */}
//         <li>
//           <button onClick={() => setOpenCourses(!openCourses)} className="menu-button">
//             Administrar Cursos
//           </button>
//           {openCourses && (
//             <ul className="submenu">
//               <li
//                 onClick={() => setSelectedOption('Crear Curso')}
//                 className={selectedOption === 'Crear Curso' ? 'selected' : ''}
//               >
//                 Crear Curso
//               </li>
//               <li
//                 onClick={() => setSelectedOption('Administrar Subcursos')}
//                 className={selectedOption === 'Administrar Subcursos' ? 'selected' : ''}
//               >
//                 Administrar Subcursos
//               </li>
//               <li
//                 onClick={() => setSelectedOption('Administrar Módulos')}
//                 className={selectedOption === 'Administrar Módulos' ? 'selected' : ''}
//               >
//                 Administrar Módulos
//               </li>
//               <li
//                 onClick={() => setSelectedOption('Administrar Prueba')}
//                 className={selectedOption === 'Administrar Prueba' ? 'selected' : ''}
//               >
//                 Administrar Prueba
//               </li>
//             </ul>
//           )}
//         </li>

//         {/* Métricas como opción independiente */}
//         <li>
//           <button 
//              onClick={() => setOpenMetrics(!openMetrics)} className="menu-button"
          
//           >
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

  const [openClients, setOpenClients] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openMetrics, setOpenMetrics] = useState(false);

  const handleLogout = () => {
    onLogout(); // Llama a la función para desautenticar
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <aside className="sidebar">
      <h2>Menú</h2>
      <ul>
        {/* Administrar Clientes */}
        <li>
          <button onClick={() => setOpenClients(!openClients)} className="menu-button">
            Administrar Clientes
          </button>
          {openClients && (
            <ul className="submenu">
              <li
                onClick={() => {
                  navigate('/clients/register');
                }}
              >
                Registrar Cliente
              </li>
              <li
                onClick={() => {
                  navigate('/clients');
                }}
              >
                Clientes
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
