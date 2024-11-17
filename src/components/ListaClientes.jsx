
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ListaClientes.css';

const ListaClientes = ({ setMessage }) => {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [filter, setFilter] = useState('activos'); // Estado para el filtro (activos o inactivos)
  const navigate = useNavigate();

  const fetchClients = async () => {
    setLoadingClients(true);
    setMessage('');
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
      } else {
        setMessage({ text: 'Error al cargar los clientes.', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Hubo un problema al conectar con el servidor.', type: 'error' });
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [filter, setMessage]);

  const handleEdit = (client) => {
    navigate('/clients/edit', { state: { editingClient: client } }); // Asegúrate de que 'client' contiene el 'id'
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
                        style={{ cursor: 'pointer' }}
                      >
                        ✏️
                      </span>
                      <span className="icon delete-icon" title="Desactivar Cuenta">
                        🚫👤
                      </span>
                    </>
                  ) : (
                    <span className="icon activate-icon" title="Activar Cuenta">
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
  );
};

export default ListaClientes;
