import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showAlert } from './alerts';
import Button from './ui/button/button';
import '../styles/VerInstructores.css';
import Swal from 'sweetalert2';

const VerInstructores = () => {
  const [instructores, setInstructores] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [filteredInstructores, setFilteredInstructores] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const fetchInstructores = async (estado = selectedEstado, empresaId = selectedEmpresa) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/instructores/', {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Error al obtener los instructores.');
      const data = await response.json();
      setInstructores(data);
  
      // Aplica el filtro actual automáticamente
      let filtered = data;
      if (estado !== '') {
        filtered = filtered.filter(
          (instructor) => instructor.is_active.toString() === estado
        );
      }
      if (empresaId !== '') {
        filtered = filtered.filter(
          (instructor) => instructor.empresa.toString() === empresaId
        );
      }
  
      setFilteredInstructores(filtered);
    } catch (error) {
      showAlert('Error', 'No se pudieron cargar los instructores.', 'error');
    }
  };

  const fetchEmpresas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/empresas/', {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Error al obtener las empresas.');
      const data = await response.json();
      setEmpresas(data);
    } catch (error) {
      showAlert('Error', 'No se pudieron cargar las empresas.', 'error');
    }
  };

  useEffect(() => {
    fetchInstructores();
    fetchEmpresas();
  }, []);

  const handleEstadoFilter = (estado) => {
    setSelectedEstado(estado);
    const filtered = instructores.filter(
      (instructor) =>
        (estado === '' || instructor.is_active.toString() === estado) &&
        (selectedEmpresa === '' || instructor.empresa.toString() === selectedEmpresa)
    );
    setFilteredInstructores(filtered);
  };

  const handleEmpresaFilter = (empresaId) => {
    setSelectedEmpresa(empresaId);
    const filtered = instructores.filter(
      (instructor) =>
        (selectedEstado === '' || instructor.is_active.toString() === selectedEstado) &&
        (empresaId === '' || instructor.empresa.toString() === empresaId)
    );
    setFilteredInstructores(filtered);
  };

  const toggleEstado = async (instructor) => {
    const nuevoEstado = !instructor.is_active;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/instructores/${instructor.id}/`,
        {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ is_active: nuevoEstado }),
        }
      );
      if (!response.ok) throw new Error('Error al cambiar el estado.');
      showAlert(
        'Éxito',
        `El instructor ${instructor.first_name} ${instructor.last_name} fue ${
          nuevoEstado ? 'activado' : 'desactivado'
        }.`,
        'success'
      );
      // Recargar instructores con los filtros actuales
      fetchInstructores(selectedEstado, selectedEmpresa);
    } catch (error) {
      showAlert('Error', 'No se pudo cambiar el estado del instructor.', 'error');
    }
  };

  const handleEdit = async (id) => {
    try {
      const responseInstructor = await fetch(
        `http://127.0.0.1:8000/api/instructores/${id}/`,
        {
          headers: getHeaders(),
        }
      );
  
      if (!responseInstructor.ok) throw new Error('Error al cargar el instructor.');
      const instructorData = await responseInstructor.json();
  
      const responseCursos = await fetch(
        `http://127.0.0.1:8000/api/instructor-curso/?instructor=${id}`,
        {
          headers: getHeaders(),
        }
      );
  
      if (!responseCursos.ok) throw new Error('Error al cargar los cursos asociados.');
      const cursosData = await responseCursos.json();
  
      const cursosSeleccionados = cursosData.map((curso) => curso.curso);
  
      navigate(`/instructor/edit/${id}`, {
        state: {
          instructor: { ...instructorData, cursosSeleccionados },
        },
      });
    } catch (error) {
      showAlert('Error', error.message || 'No se pudo cargar el instructor.', 'error');
    }
  };
  
  
  const handleCambiar = (instructor) => {
    Swal.fire({
      title: 'Reemplazar Instructor',
      html: `
        <div>
          <input type="text" id="nombre" placeholder="Nombre del nuevo instructor" class="swal2-input">
          <input type="text" id="apellido" placeholder="Apellido del nuevo instructor" class="swal2-input">
          <input type="email" id="email" placeholder="Correo del nuevo instructor" class="swal2-input">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Reemplazar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'large-popup', // Clase personalizada para aumentar el tamaño
      },
      preConfirm: () => {
        const nombre = Swal.getPopup().querySelector('#nombre').value;
        const apellido = Swal.getPopup().querySelector('#apellido').value;
        const email = Swal.getPopup().querySelector('#email').value;
  
        if (!nombre || !apellido || !email) {
          Swal.showValidationMessage('Por favor complete todos los campos.');
          return false;
        }
  
        return { nombre, apellido, email };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { nombre, apellido, email } = result.value;
  
        try {
          const response = await fetch('http://127.0.0.1:8000/api/modificacionInstructor/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              instructor_anterior_id: instructor.id,
              nombre,
              apellido,
              email,
            }),
          });
  
          if (!response.ok) {
            throw new Error('Error al reemplazar el instructor.');
          }
  
          showAlert('Éxito', 'El instructor fue reemplazado exitosamente.', 'success');
          fetchInstructores(); // Actualizar la lista de instructores
        } catch (error) {
          showAlert('Error', error.message || 'No se pudo completar la operación.', 'error');
        }
      }
    });
  };

  return (
    <div className="ver-instructores-container">
      <h2>Lista de Instructores</h2>

      <div className="filters">
        <div className="filter">
          <label htmlFor="estado-filter">Filtrar por Estado:</label>
          <select
            id="estado-filter"
            value={selectedEstado}
            onChange={(e) => handleEstadoFilter(e.target.value)}
            className="large-select"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        <div className="filter">
          <label htmlFor="empresa-filter">Filtrar por Empresa:</label>
          <select
            id="empresa-filter"
            value={selectedEmpresa}
            onChange={(e) => handleEmpresaFilter(e.target.value)}
            className="large-select searchable"
          >
            <option value="">Todas</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="instructores-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Código Organización</th>
            <th>Estado</th>
            <th>Área</th>
            <th>Empresa</th>
            <th>Fecha Inicio Capacitación</th>
            <th>Fecha Fin Capacitación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredInstructores.length > 0 ? (
            filteredInstructores.map((instructor) => (
              <tr key={instructor.id}>
                <td>
                  {instructor.first_name} {instructor.last_name}
                </td>
                <td>{instructor.email}</td>
                <td>{instructor.codigoOrganizacion}</td>
                <td>{instructor.is_active ? 'Activo' : 'Inactivo'}</td>
                <td>{instructor.area}</td>
                <td>{instructor.empresa_nombre}</td>
                <td>{instructor.fechaInicioCapacitacion || 'N/A'}</td>
                <td>{instructor.fechaFinCapacitacion || 'N/A'}</td>
                <td>
                {instructor.is_active && (
                    <>
                    <Button onClick={() => handleEdit(instructor.id)}>Editar</Button>
                    <Button
                        onClick={() => toggleEstado(instructor)}
                        className={instructor.is_active ? 'danger' : 'success'}
                    >
                        {instructor.is_active ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button onClick={() => handleCambiar(instructor)} className="primary">
                        Cambiar
                    </Button>
                    </>
                )}
                {!instructor.is_active && (
                    <Button
                    onClick={() => toggleEstado(instructor)}
                    className="success"
                    >
                    Activar
                    </Button>
                )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No se encontraron instructores.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerInstructores;