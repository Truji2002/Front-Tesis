import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Button from './ui/button/Button';
import Input from './ui/input/Input';
import Label from './ui/label/Label';
import '../styles/ContractsManagement.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContractsManagement = () => {
  const [contracts, setContracts] = useState({});
  const [courses, setCourses] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cursos: [],
    fechaInicioCapacitacion: '',
    fechaFinCapacitacion: '',
  });
  const { id } = useParams(); // Obtener el ID del instructor desde la URL
  const token = localStorage.getItem('accessToken');

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });



  // Fetch instructor details
  const fetchInstructor = async (id) => {
    try {
      
      const response = await fetch(`${API_BASE_URL}/api/instructores/${id}/`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error('Error al obtener los detalles del instructor.');
      const data = await response.json();
      
      setInstructor(data);
    } catch (error) {
      console.error('Error fetching instructor details:', error);
      Swal.fire('Error', 'No se pudieron cargar los detalles del instructor.', 'error');
    }
  };

  // Fetch contracts by instructor
  const fetchContracts = async (id) => {
    try {
      
      const response = await fetch(
        `${API_BASE_URL}/api/obtener-contrato-por-instructor/?instructor_id=${id}`,
        { headers: getHeaders() }
      );
      
      if (!response.ok) throw new Error('Error al obtener los contratos.');
      const data = await response.json();
      
      setContracts(data); // Data ya está agrupada por código de organización
    } catch (error) {
      console.error('Error fetching contracts:', error);
      Swal.fire('Error', 'No se pudieron cargar los contratos.', 'error');
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      
      const response = await fetch(`${API_BASE_URL}/api/cursos/`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error('Error al obtener los cursos.');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Swal.fire('Error', 'No se pudieron cargar los cursos.', 'error');
    }
  };

  useEffect(() => {
    if (id) {
      fetchInstructor(id).then(() => {
      }).catch(err => console.error('Error loading instructor:', err));
      fetchContracts(id).then(() => {
      }).catch(err => console.error('Error loading contracts:', err));
      fetchCourses().then(() => {

      }).catch(err => console.error('Error loading courses:', err));
    }
  }, [id]);

  const handleAddContract = () => {
    
    setFormData({
      cursos: [],
      fechaInicioCapacitacion: '',
      fechaFinCapacitacion: '',
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Construir el arreglo de contratos
    const contratos = formData.cursos.map((cursoId) => ({
        instructor: id,
        curso: cursoId,
        fechaInicioCapacitacion: formData.fechaInicioCapacitacion,
        fechaFinCapacitacion: formData.fechaFinCapacitacion,
    }));

    try {
        console.log('Sending contract data:', { contratos });

        const response = await fetch(`${API_BASE_URL}/api/crear-contrato/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ contratos }),
        });

        if (!response.ok) throw new Error('Error al crear los contratos.');
        const result = await response.json();

        console.log('Contracts created successfully:', result);
        Swal.fire('Éxito', 'Contratos creados con éxito.', 'success');
        fetchContracts(id);
        setShowForm(false);
    } catch (error) {
        console.error('Error creating contracts:', error);
        Swal.fire('Error', 'No se pudieron crear los contratos.', 'error');
    }
};

const handleDeactivateContract = async (codigoOrganizacion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/actualizar-contrato/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          codigoOrganizacion,
          activo: false,
        }),
      });

      if (!response.ok) throw new Error('Error al desactivar el contrato.');
      Swal.fire('Éxito', 'Contrato desactivado con éxito.', 'success');
      fetchContracts(id); // Recargar los contratos después de la desactivación
    } catch (error) {
      Swal.fire('Error', 'No se pudo desactivar el contrato.', 'error');
    }
  };

  return (
    <div className="contracts-management-container">
      <h2>Gestión de Contratos</h2>

      {instructor ? (
        <div className="instructor-details">
          <p><strong>Instructor:</strong> {instructor.first_name} {instructor.last_name}</p>
          <p><strong>Empresa:</strong> {instructor.empresa_nombre}</p>
        </div>
      ) : (
        <p>Cargando datos del instructor...</p>
      )}

      <div className="actions">
        <Button onClick={handleAddContract}>Crear Contrato</Button>
      </div>

      {!showForm ? (
        <table className="contracts-table">
          <thead>
            <tr>
              <th>Código Organización</th>
              <th>Cursos</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(contracts).length > 0 ? (
              Object.entries(contracts).map(([codigoOrganizacion, courses]) => (
                
                <tr key={codigoOrganizacion}>
                  <td>{codigoOrganizacion}</td>
                  <td>
                    <ul>
                      {courses.map((course) => (
                        <li key={course.curso_id}>
                          {course.curso_titulo} 
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{courses[0]?.fechaInicioCapacitacion || 'N/A'}</td>
                  <td>{courses[0]?.fechaFinCapacitacion || 'N/A'}</td>
                  <td>{courses.some((course) => course.activo) ? 'Activo' : 'Inactivo'}</td>

                  <td>
                    {courses.some((course) => course.activo) && (
                      <Button
                        onClick={() => handleDeactivateContract(codigoOrganizacion)}
                        className="danger"
                      >
                        Desactivar Contrato
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3">No hay contratos disponibles.</td></tr>
            )}
          </tbody>
        </table>
      ) : (
        <form className="contract-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <Label htmlFor="cursos">Cursos</Label>
            <select
              id="cursos"
              name="cursos"
              multiple
              value={formData.cursos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cursos: Array.from(e.target.selectedOptions, (opt) => opt.value),
                })
              }
            >
              {courses.length > 0 ? (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.titulo}
                  </option>
                ))
              ) : (
                <option disabled>Cargando cursos...</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <Label htmlFor="fechaInicioCapacitacion">Fecha Inicio</Label>
            <Input
              id="fechaInicioCapacitacion"
              name="fechaInicioCapacitacion"
              type="date"
              value={formData.fechaInicioCapacitacion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fechaInicioCapacitacion: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <Label htmlFor="fechaFinCapacitacion">Fecha Fin</Label>
            <Input
              id="fechaFinCapacitacion"
              name="fechaFinCapacitacion"
              type="date"
              value={formData.fechaFinCapacitacion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fechaFinCapacitacion: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-actions">
            <Button type="submit">Guardar</Button>
            <Button onClick={() => setShowForm(false)} className="secondary">
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContractsManagement;