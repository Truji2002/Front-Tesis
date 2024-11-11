import React, { useState, useEffect } from 'react';
import '../styles/ListaClientes.css';

const ListaClientes = ({ setMessage }) => {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      setMessage('');
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await fetch('http://127.0.0.1:8000/api/instructores/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClients(data);
          setMessage({ text: 'Clientes cargados con éxito.', type: 'success' });
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

    fetchClients();
  }, [setMessage]);

  return (
    <div className="lista-clientes">
      <h2>Lista de Clientes</h2>
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
