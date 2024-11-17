
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login.jsx';
// import WelcomeScreen from './components/WelcomeAdmin.jsx';
// import Registro from './components/Registro.jsx';
// import EditarCliente from './components/EditarCliente.jsx';
// import ListaClientes from './components/ListaClientes.jsx';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Verifica si el token está en localStorage para mantener la autenticación
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const handleLoginSuccess = () => {
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('nombre');
//     setIsAuthenticated(false);
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Ruta de Login */}
//           <Route
//             path="/login"
//             element={
//               isAuthenticated ? (
//                 <Navigate to="/welcome" />
//               ) : (
//                 <Login onSuccess={handleLoginSuccess} />
//               )
//             }
//           />

//           {/* Ruta del Dashboard principal */}
//           <Route
//             path="/welcome"
//             element={
//               isAuthenticated ? (
//                 <WelcomeScreen onLogout={handleLogout} />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />

//           {/* Ruta de Registro */}
//           <Route
//             path="/register"
//             element={
//               isAuthenticated ? (
//                 <Navigate to="/welcome" />
//               ) : (
//                 <Registro />
//               )
//             }
//           />

//           {/* Nueva Ruta para Editar Cliente */}
//           <Route
//             path="/clients/edit"
//             element={
//               isAuthenticated ? (
//                 <EditarCliente />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />


//           {/* Ruta para redirigir cualquier otra URL */}
//           <Route path="*" element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import MainLayout from './components/MainLayout.jsx';
import WelcomeScreen from './components/WelcomeAdmin.jsx';
import EditarCliente from './components/EditarCliente.jsx';
import RegistrarCliente from './components/RegistrarCliente.jsx';
import ListaClientes from './components/ListaClientes.jsx';

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

        {/* Rutas protegidas con Sidebar */}
        <Route
          path="/"
          element={isAuthenticated ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" />}
        >
          <Route path="welcome" element={<WelcomeScreen />} />
          <Route path="clients/register" element={<RegistrarCliente />} />
          <Route path="clients" element={<ListaClientes />} />
          <Route path="clients/edit" element={<EditarCliente />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;

