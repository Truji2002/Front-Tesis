// src/components/VerInstructores.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showAlert } from './alerts';
import Button from './ui/button/Button';
import '../styles/VerInstructores.css';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VerInstructores = () => {
  const [instructores, setInstructores] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [filteredInstructores, setFilteredInstructores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const fetchInstructores = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/instructores/`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Error al obtener los instructores.');
      const data = await response.json();
      setInstructores(data);
      setFilteredInstructores(data);
    } catch (error) {
      showAlert('Error', 'No se pudieron cargar los instructores.', 'error');
    }
  };

  const fetchEmpresas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/empresas/`, {
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = instructores.filter(
      (instructor) =>
        (instructor.first_name + ' ' + instructor.last_name)
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        instructor.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredInstructores(
      selectedEmpresa
        ? filtered.filter((instructor) => instructor.empresa.toString() === selectedEmpresa)
        : filtered
    );
  };

  const handleEmpresaFilter = (empresaId) => {
    setSelectedEmpresa(empresaId);
    const filtered = instructores.filter(
      (instructor) =>
        (!searchTerm ||
          (instructor.first_name + ' ' + instructor.last_name)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          instructor.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (empresaId === '' || instructor.empresa.toString() === empresaId)
    );
    setFilteredInstructores(filtered);
  };

  const handleGestionarContrato = (instructorId) => {
    navigate(`/instructor/${instructorId}/contracts`);
  };

  const handleEdit = (instructorId) => {
    navigate(`/instructor/edit/${instructorId}`);
  };

  const handleEliminar = async (instructorId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al instructor permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // Rojo para eliminar
      cancelButtonColor: '#6c757d', // Gris para cancelar
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/instructores/${instructorId}/`, {
            method: 'DELETE',
            headers: getHeaders(),
          });
          if (!response.ok) throw new Error('Error al eliminar el instructor.');
          showAlert('Éxito', 'Instructor eliminado con éxito.', 'success');
          fetchInstructores();
        } catch (error) {
          showAlert('Error', 'No se pudo eliminar el instructor.', 'error');
        }
      }
    });
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
          const response = await fetch(`${API_BASE_URL}/api/modificacionInstructor/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              instructor_anterior_id: instructor.id,
              nombre,
              apellido,
              email,
            }),
          });

          if (!response.ok) throw new Error('Error al reemplazar el instructor.');
          showAlert('Éxito', 'El instructor fue reemplazado exitosamente.', 'success');
          fetchInstructores();
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
          <label htmlFor="search-filter">Buscar por Nombre o Correo:</label>
          <input
            id="search-filter"
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar..."
          />
        </div>

        <div className="filter">
          <label htmlFor="empresa-filter">Filtrar por Empresa:</label>
          <select
            id="empresa-filter"
            value={selectedEmpresa}
            onChange={(e) => handleEmpresaFilter(e.target.value)}
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
            <th>Empresa</th>
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
                <td>{instructor.empresa_nombre}</td>
                <td>
                <Button
  onClick={() => handleEdit(instructor.id)}
  className="btn-edit"
>
  Editar
</Button>
<Button
  onClick={() => handleEliminar(instructor.id)}
  className="btn-delete"
>
  Eliminar
</Button>
<Button
  onClick={() => handleCambiar(instructor)}
  className="btn-change"
>
  Cambiar
</Button>
<Button
  onClick={() => handleGestionarContrato(instructor.id)}
  className="btn-manage"
>
  Gestionar Contratos
</Button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No se encontraron instructores.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerInstructores;
