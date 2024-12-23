import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { showAlert } from './alerts';
import Button from './ui/button/button';
import '../styles/VerEstudiantes.css';

const VerEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [asignadoFiltro, setAsignadoFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const token = localStorage.getItem('accessToken');
  const codigoOrganizacion = localStorage.getItem('codigoOrganizacion');

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/estudiante-codigoOrganizacion/?codigoOrganizacion=${codigoOrganizacion}`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) throw new Error('Error al obtener los estudiantes.');

      const data = await response.json();
      setEstudiantes(data);
      setFilteredEstudiantes(data);
    } catch (error) {
      showAlert('Error', 'No se pudieron cargar los estudiantes.', 'error');
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const handleFiltroAsignado = (value) => {
    setAsignadoFiltro(value);
    filtrarEstudiantes(value, busqueda);
  };

  const handleBusqueda = (value) => {
    setBusqueda(value);
    filtrarEstudiantes(asignadoFiltro, value);
  };

  const filtrarEstudiantes = (asignado, busqueda) => {
    let filtered = estudiantes;

    if (asignado !== '') {
      filtered = filtered.filter(
        (estudiante) => estudiante.asignadoSimulacion.toString() === asignado
      );
    }

    if (busqueda) {
      filtered = filtered.filter(
        (estudiante) =>
          estudiante.first_name.toLowerCase().includes(busqueda.toLowerCase()) ||
          estudiante.email.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setFilteredEstudiantes(filtered);
  };

  const toggleAsignacion = async (id, asignadoSimulacion) => {
    const accion = asignadoSimulacion ? 'quitar' : 'asignar';
    const confirmButtonText = asignadoSimulacion ? 'Sí, quitar' : 'Sí, asignar';

    // Mostrar alerta de confirmación
    Swal.fire({
      title: `¿Estás seguro de ${accion} esta simulación?`,
      text: `Esta acción ${asignadoSimulacion ? 'eliminará' : 'asignará'} la simulación al estudiante.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/estudiantes/${id}/`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ asignadoSimulacion: !asignadoSimulacion }),
          });

          if (!response.ok) throw new Error('Error al actualizar la asignación.');

          showAlert('Éxito', 'La asignación fue actualizada exitosamente.', 'success');
          fetchEstudiantes(); // Actualizar la lista de estudiantes
        } catch (error) {
          showAlert('Error', 'No se pudo actualizar la asignación.', 'error');
        }
      }
    });
  };

  return (
    <div className="ver-estudiantes-container">
      <h2>Lista de Estudiantes</h2>

      <div className="filters">
        <div className="filter">
          <label htmlFor="asignado-filter">Filtrar por Asignación:</label>
          <select
            id="asignado-filter"
            value={asignadoFiltro}
            onChange={(e) => handleFiltroAsignado(e.target.value)}
            className="large-select"
          >
            <option value="">Todos</option>
            <option value="true">Asignados</option>
            <option value="false">No asignados</option>
          </select>
        </div>

        <div className="filter">
          <label htmlFor="busqueda">Buscar por Nombre o Correo:</label>
          <input
            id="busqueda"
            type="text"
            value={busqueda}
            onChange={(e) => handleBusqueda(e.target.value)}
            placeholder="Buscar..."
            className="search-input"
          />
        </div>
      </div>

      <table className="estudiantes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado de Simulación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEstudiantes.length > 0 ? (
            filteredEstudiantes.map((estudiante) => (
              <tr key={estudiante.id}>
                <td>
                  {estudiante.first_name} {estudiante.last_name}
                </td>
                <td>{estudiante.email}</td>
                <td>{estudiante.asignadoSimulacion ? 'Asignado' : 'No asignado'}</td>
                <td>
                  <Button
                    onClick={() => toggleAsignacion(estudiante.id, estudiante.asignadoSimulacion)}
                    className={estudiante.asignadoSimulacion ? 'danger' : 'success'}
                  >
                    {estudiante.asignadoSimulacion ? 'Quitar Simulación' : 'Asignar Simulación'}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No se encontraron estudiantes.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerEstudiantes;
