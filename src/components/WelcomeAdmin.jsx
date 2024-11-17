// import React, { useState, useEffect } from 'react';
// import Sidebar from './Sidebar';
// import RegistrarCliente from './RegistrarCliente';
// import ListaClientes from './ListaClientes';
// import CrearCurso from './CrearCurso';
// import AdministrarSubcursos from './AdministrarSubcursos';
// import AdministrarModulos from './AdministrarModulos';
// import '../styles/WelcomeAdmin.css';

// const WelcomeScreen = ({ onLogout }) => {
//   const [nombre, setNombre] = useState('');
//   const [selectedOption, setSelectedOption] = useState('');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const storedNombre = localStorage.getItem('nombre');
//     if (storedNombre) {
//       setNombre(storedNombre);
//     }
//   }, []);

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         setMessage('');
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const handleOptionChange = (option) => {
//     setSelectedOption(option);
//     setMessage('');
//   };

//   const renderContent = () => {
//     switch (selectedOption) {
//       case 'Registrar Cliente':
//         return <RegistrarCliente setMessage={setMessage} />;
//       case 'Clientes':
//         return <ListaClientes setMessage={setMessage} />;
//       case 'Crear Curso':
//         return <CrearCurso setMessage={setMessage} />;
//       case 'Administrar Subcursos':
//         return <AdministrarSubcursos setMessage={setMessage} />;
//       case 'Administrar Módulos':
//         return <AdministrarModulos setMessage={setMessage} />;
//       default:
//         return <p>Bienvenido, selecciona una opción del menú para ver su contenido.</p>;
//     }
//   };

//   return (
//     <div className="welcome-screen">
//       <Sidebar setSelectedOption={handleOptionChange} selectedOption={selectedOption} onLogout={onLogout} />
//       <main className="content">
//         <h1>Bienvenido, {nombre}</h1>
//         {message && <p className={`message ${message.type}`}>{message.text}</p>}
//         {renderContent()}
//       </main>
//     </div>
//   );
// };

// export default WelcomeScreen;
import React, { useState, useEffect } from 'react';
import '../styles/WelcomeAdmin.css';

const WelcomeScreen = () => {
  const [nombre, setNombre] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedNombre = localStorage.getItem('nombre');
    if (storedNombre) {
      setNombre(storedNombre);
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="welcome-screen">
      <div className="welcome-header">
        <h1>Bienvenido, {nombre}</h1>
        {message && <p className={`message ${message.type}`}>{message.text}</p>}
      </div>
      <div className="welcome-content">
        <p className="welcome-message">Selecciona una opción del menú para ver su contenido.</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
