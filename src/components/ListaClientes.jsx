// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import '../styles/ListaClientes.css';

// const ListaClientes = () => {
//   const [clients, setClients] = useState([]);
//   const [loadingClients, setLoadingClients] = useState(false);
//   const [filter, setFilter] = useState('activos'); // Estado para el filtro (activos o inactivos)
//   const navigate = useNavigate();

//   const fetchClients = async () => {
//     setLoadingClients(true);
//     const accessToken = localStorage.getItem('accessToken');
//     const endpoint =
//       filter === 'activos'
//         ? 'http://127.0.0.1:8000/api/instructores/activos/'
//         : 'http://127.0.0.1:8000/api/instructores/inactivos/';

//     try {
//       const response = await fetch(endpoint, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setClients(data);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoadingClients(false);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, [filter]);

//   const handleEdit = (client) => {
//     navigate('/clients/edit', { state: { editingClient: client } });
//   };

//   const handleDeactivate = async (clientId) => {
//     // Mostrar el cuadro de confirmación
//     const result = await Swal.fire({
//       title: '¿Estás seguro?',
//       text: 'Esta acción desactivará la cuenta del cliente.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Sí, desactivar',
//       cancelButtonText: 'Cancelar',
//     });

//     if (result.isConfirmed) {
//       // Si el usuario confirma, realizar la llamada PATCH
//       const accessToken = localStorage.getItem('accessToken');
//       try {
//         const response = await fetch(`http://127.0.0.1:8000/api/instructores/${clientId}/`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify({ is_active: false }),
//         });

//         if (response.ok) {
//           Swal.fire(
//             '¡Desactivado!',
//             'La cuenta del cliente ha sido desactivada.',
//             'success'
//           );
//           // Recargar la lista de clientes
//           fetchClients();
//         } else {
//           Swal.fire(
//             'Error',
//             'Hubo un problema al desactivar la cuenta.',
//             'error'
//           );
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         Swal.fire(
//           'Error',
//           'Hubo un problema al conectar con el servidor.',
//           'error'
//         );
//       }
//     }
//   };

//   return (
//     <div className="lista-clientes">
//       <h2>Lista de Clientes</h2>
//       {/* Filtros */}
//       <div className="filters">
//         <button
//           className={filter === 'activos' ? 'active-filter' : ''}
//           onClick={() => setFilter('activos')}
//         >
//           Activos
//         </button>
//         <button
//           className={filter === 'inactivos' ? 'active-filter' : ''}
//           onClick={() => setFilter('inactivos')}
//         >
//           Inactivos
//         </button>
//       </div>
//       <div className="table-container"> {/* Contenedor para centrar */}
//         {loadingClients ? (
//           <p className="message info">Cargando clientes...</p>
//         ) : clients.length > 0 ? (
//           <table className="clients-table">
//             <thead>
//               <tr>
//                 <th>Nombre</th>
//                 <th>Apellido</th>
//                 <th>Email</th>
//                 <th>Área</th>
//                 <th>Fecha Inicio Contrato</th>
//                 <th>Fecha Fin Contrato</th>
//                 <th>Empresa</th>
//                 <th>Acciones</th>
//               </tr>
//             </thead>
//             <tbody>
//               {clients.map((client, index) => (
//                 <tr key={index}>
//                   <td>{client.first_name}</td>
//                   <td>{client.last_name}</td>
//                   <td>{client.email}</td>
//                   <td>{client.area}</td>
//                   <td>{client.fechaInicioContrato}</td>
//                   <td>{client.fechaFinContrato}</td>
//                   <td>{client.empresa}</td>
//                   <td>
//                     {filter === 'activos' ? (
//                       <>
//                         <span
//                           className="icon edit-icon"
//                           title="Editar"
//                           onClick={() => handleEdit(client)}
//                         >
//                           ✏️
//                         </span>
//                         <span
//                           className="icon delete-icon"
//                           title="Desactivar Cuenta"
//                           onClick={() => handleDeactivate(client.id)}
//                         >
//                           🚫👤
//                         </span>
//                       </>
//                     ) : (
//                       <span className="icon activate-icon" title="Activar Cuenta">
//                         ✅👤
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="message info">No hay clientes disponibles.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ListaClientes;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/ListaClientes.css';
const ListaClientes = () => {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [filter, setFilter] = useState('activos'); // Estado para el filtro (activos o inactivos)
  const navigate = useNavigate();

  const fetchClients = async () => {
    setLoadingClients(true);
    const accessToken = localStorage.getItem('accessToken');
    const endpoint =
      filter === 'activos'
        ? 'http://127.0.0.1:8000/api/instructores/activos/'
        : 'http://127.0.0.1:8000/api/instructores/inactivos/';

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [filter]);

  const handleEdit = (client) => {
    navigate('/clients/edit', { state: { editingClient: client } });
  };

  const handleActivateDeactivate = async (clientId, activate = true) => {
    const action = activate ? 'activar' : 'desactivar';
    const status = activate ? true : false;

    // Mostrar el cuadro de confirmación
    const result = await Swal.fire({
      title: `¿Estás seguro de ${action} esta cuenta?`,
      text: `Esta acción ${activate ? 'activará' : 'desactivará'} la cuenta del cliente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: activate ? '#28a745' : '#d33', // Verde para activar, rojo para desactivar
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/instructores/${clientId}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ is_active: status }),
        });

        if (response.ok) {
          Swal.fire(
            `¡${activate ? 'Activado' : 'Desactivado'}!`,
            `La cuenta del cliente ha sido ${activate ? 'activada' : 'desactivada'}.`,
            'success'
          );
          fetchClients(); // Recargar la lista de clientes
        } else {
          Swal.fire(
            'Error',
            `Hubo un problema al ${action} la cuenta.`,
            'error'
          );
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire(
          'Error',
          'Hubo un problema al conectar con el servidor.',
          'error'
        );
      }
    }
  };

  return (
    <div className="lista-clientes">
      <h2>Lista de Clientes</h2>
      {/* Filtros */}
      <div className="filters">
        <button
          className={filter === 'activos' ? 'active-filter' : ''}
          onClick={() => setFilter('activos')}
        >
          Activos
        </button>
        <button
          className={filter === 'inactivos' ? 'active-filter' : ''}
          onClick={() => setFilter('inactivos')}
        >
          Inactivos
        </button>
      </div>
      <div className="table-container"> {/* Contenedor para centrar */}
        {loadingClients ? (
          <p className="message info">Cargando clientes...</p>
        ) : clients.length > 0 ? (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Área</th>
                <th>Fecha Inicio Contrato</th>
                <th>Fecha Fin Contrato</th>
                <th>Empresa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={index}>
                  <td>{client.first_name}</td>
                  <td>{client.last_name}</td>
                  <td>{client.email}</td>
                  <td>{client.area}</td>
                  <td>{client.fechaInicioContrato}</td>
                  <td>{client.fechaFinContrato}</td>
                  <td>{client.empresa}</td>
                  <td>
                    {filter === 'activos' ? (
                      <>
                        <span
                          className="icon edit-icon"
                          title="Editar"
                          onClick={() => handleEdit(client)}
                        >
                          ✏️
                        </span>
                        <span
                          className="icon delete-icon"
                          title="Desactivar Cuenta"
                          onClick={() => handleActivateDeactivate(client.id, false)}
                        >
                          🚫👤
                        </span>
                      </>
                    ) : (
                      <span
                        className="icon activate-icon"
                        title="Activar Cuenta"
                        onClick={() => handleActivateDeactivate(client.id, true)}
                      >
                        ✅👤
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="message info">No hay clientes disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ListaClientes;
