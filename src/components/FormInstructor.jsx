import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { showAlert } from './alerts';
import Button from './ui/button/button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import '../styles/FormInstructor.css';

const FormInstructor = ({ isEdit, instructor, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    area: '',
    fechaInicioCapacitacion: '',
    fechaFinCapacitacion: '',
    empresa: '',
    cursosSeleccionados: [],
  });

  const [empresas, setEmpresas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (isEdit && instructor) {
      setFormData({
        first_name: instructor.first_name || '',
        last_name: instructor.last_name || '',
        email: instructor.email || '',
        area: instructor.area || '',
        fechaInicioCapacitacion: instructor.fechaInicioCapacitacion || '',
        fechaFinCapacitacion: instructor.fechaFinCapacitacion || '',
        empresa: instructor.empresa || '',
        cursosSeleccionados: instructor.cursosSeleccionados || [],
      });
    }

    const fetchEmpresas = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/empresas/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al obtener las empresas.');
        const data = await response.json();
        setEmpresas(data);
      } catch (error) {
        showAlert('Error', 'No se pudieron cargar las empresas.', 'error');
      }
    };

    const fetchCursos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/cursos/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al obtener los cursos.');
        const data = await response.json();
        setCursos(data);
      } catch (error) {
        showAlert('Error', 'No se pudieron cargar los cursos.', 'error');
      }
    };

    const fetchCursosAsociados = async () => {
      if (isEdit && instructor) {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/instructor-curso/?instructor=${instructor.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) throw new Error('Error al obtener cursos asociados.');
          const data = await response.json();
          
          // Extraer el campo curso (ID real del curso) de cada registro
          const cursosSeleccionados = data.map((registro) => registro.curso_id);
          
    
          setFormData((prev) => ({
            ...prev,
            cursosSeleccionados,
          }));
        } catch (error) {
          showAlert('Error', 'No se pudieron cargar los cursos asociados.', 'error');
        }
      }
    };
    

    fetchEmpresas();
    fetchCursos();
    fetchCursosAsociados();
  }, [isEdit, instructor, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCursoChange = (cursoId) => {
    setFormData((prev) => {
      const { cursosSeleccionados } = prev;
      if (cursosSeleccionados.includes(cursoId)) {
        return {
          ...prev,
          cursosSeleccionados: cursosSeleccionados.filter((id) => id !== cursoId),
        };
      } else {
        return {
          ...prev,
          cursosSeleccionados: [...cursosSeleccionados, cursoId],
        };
      }
    });
  };

  const validateForm = () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      showAlert('Error', 'El nombre y apellido son obligatorios.', 'error');
      return false;
    }
    if (!formData.email.includes('@')) {
      showAlert('Error', 'Correo electrónico no válido.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      area: formData.area || '',
      fechaInicioCapacitacion: formData.fechaInicioCapacitacion || null,
      fechaFinCapacitacion: formData.fechaFinCapacitacion || null,
      empresa: parseInt(formData.empresa, 10),
    };
    
    try {
      // Crear o actualizar el instructor
      const method = isEdit ? 'PATCH' : 'POST';
      const url = isEdit
        ? `http://127.0.0.1:8000/api/instructores/${instructor.id}/`
        : 'http://127.0.0.1:8000/api/registrarInstructor/';

     
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al guardar los datos.');
      }
  
      const createdInstructor = isEdit ? instructor : await response.json();


      // Obtener los cursos actuales asociados al instructor
      const cursosActualesResponse = await fetch(
        `http://127.0.0.1:8000/api/instructor-curso/?instructor=${createdInstructor.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

  
      const cursosActuales = (await cursosActualesResponse.json()).map((c) => c.curso_id);

  
  
      // Calcular los cursos a agregar y eliminar
      const cursosAAgregar = formData.cursosSeleccionados.filter(
        (cursoId) => !cursosActuales.includes(cursoId)
      );
      const cursosAEliminar = cursosActuales.filter(
        (cursoId) => !formData.cursosSeleccionados.includes(cursoId)
      );
  
      // Asociar nuevos cursos
      for (const cursoId of cursosAAgregar) {
        const cursoPayload = {
          instructor: createdInstructor.id,
          curso: cursoId,
        };

        
  
        const cursoResponse = await fetch('http://127.0.0.1:8000/api/instructor-curso/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cursoPayload),
        });
  
        if (!cursoResponse.ok) {
          const errorData = await cursoResponse.json();
          throw new Error(
            `Error al asociar el curso con ID ${cursoId}: ${errorData.detail || 'Desconocido'}`
          );
        }
      }
  
      // Eliminar cursos desasociados
      for (const cursoId of cursosAEliminar) {
        const cursoPayload = {
          instructor: createdInstructor.id,
          curso: cursoId,
        };
        

        const cursoResponse = await fetch('http://127.0.0.1:8000/api/instructor-curso/', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cursoPayload),
        });
  
        if (!cursoResponse.ok) {
          const errorData = await cursoResponse.json();
          throw new Error(
            `Error al desasociar el curso con ID ${cursoId}: ${errorData.detail || 'Desconocido'}`
          );
        }
      }
  
      // Mostrar mensaje de éxito
      showAlert(
        'Éxito',
        isEdit ? 'Instructor actualizado con éxito.' : 'Instructor creado con éxito.',
        'success'
      );
  
      onSubmit();
    } catch (error) {
      showAlert('Error', error.message || 'No se pudo completar la operación.', 'error');
    }
  };
  

  

  return (
    <form className="form-instructor" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Editar Instructor' : 'Crear Instructor'}</h2>

      <div className="form-group">
        <Label htmlFor="first_name">Nombre</Label>
        <Input
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="last_name">Apellido</Label>
        <Input
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={isEdit}
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="area">Área</Label>
        <Input
          id="area"
          name="area"
          value={formData.area}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="fechaInicioCapacitacion">Fecha Inicio Capacitación</Label>
        <Input
          id="fechaInicioCapacitacion"
          name="fechaInicioCapacitacion"
          type="date"
          value={formData.fechaInicioCapacitacion}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="fechaFinCapacitacion">Fecha Fin Capacitación</Label>
        <Input
          id="fechaFinCapacitacion"
          name="fechaFinCapacitacion"
          type="date"
          value={formData.fechaFinCapacitacion}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="empresa">Empresa</Label>
        <select
          id="empresa"
          name="empresa"
          value={formData.empresa}
          onChange={handleInputChange}
          disabled={isEdit}
          required
        >
          <option value="">Seleccione una empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
  <Label htmlFor="cursos">Cursos</Label>
  <div className="cursos-list">

    {cursos.map((curso) => {
      const isChecked = formData.cursosSeleccionados.includes(curso.id);
      

      return (
        <div className="cursos-item" key={curso.id}>
          <input
            type="checkbox"
            id={`curso-${curso.id}`}
            checked={isChecked}
            onChange={() => handleCursoChange(curso.id)}
          />
          <label htmlFor={`curso-${curso.id}`}>{curso.titulo}</label>
        </div>
      );
    })}
  </div>
</div>



      <Button type="submit">{isEdit ? 'Actualizar Instructor' : 'Crear Instructor'}</Button>
    </form>
  );
};

export default FormInstructor;
