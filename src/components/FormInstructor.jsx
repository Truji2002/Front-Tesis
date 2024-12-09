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
    empresa: '', // Aquí se guardará el ID de la empresa seleccionada
  });

  const [empresas, setEmpresas] = useState([]); // Lista de empresas
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

    fetchEmpresas();
  }, [isEdit, instructor, token]);

  const isOnlyLetters = (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
  const isValidEmail = (value) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
  const isDateValid = () =>
    new Date(formData.fechaInicioCapacitacion) <=
    new Date(formData.fechaFinCapacitacion);

  const validateForm = () => {
    if (!isOnlyLetters(formData.first_name)) {
      showAlert('Error', 'El nombre solo puede contener letras.', 'error');
      return false;
    }

    if (!isOnlyLetters(formData.last_name)) {
      showAlert('Error', 'El apellido solo puede contener letras.', 'error');
      return false;
    }

    if (!isValidEmail(formData.email)) {
      showAlert('Error', 'El correo electrónico no es válido.', 'error');
      return false;
    }

    if (!isOnlyLetters(formData.area)) {
      showAlert('Error', 'El área solo puede contener letras.', 'error');
      return false;
    }

    if (formData.fechaInicioCapacitacion && formData.fechaFinCapacitacion) {
      if (!isDateValid()) {
        showAlert(
          'Error',
          'La fecha de fin no puede ser menor a la fecha de inicio.',
          'error'
        );
        return false;
      }
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await Swal.fire({
      title: isEdit ? 'Confirmación de Modificación' : 'Confirmación de Creación',
      text: isEdit
        ? '¿Está seguro de que desea modificar este instructor?'
        : '¿Está seguro de que desea crear este instructor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isEdit ? 'Sí, modificar' : 'Sí, crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: 'var(--error-text-color)',
    });

    if (!result.isConfirmed) return;

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
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.detail || 'Error al guardar los datos.');
      }

      if (!isEdit) {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          area: '',
          fechaInicioCapacitacion: '',
          fechaFinCapacitacion: '',
          empresa: '',
        });
      }

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
          onChange={handleInputChange} // Esto debe estar presente incluso si está deshabilitado
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
          onChange={handleInputChange} // Se añadió para que sea controlado
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
  
      <Button type="submit" className="w-full">
        {isEdit ? 'Actualizar Instructor' : 'Crear Instructor'}
      </Button>
    </form>
  );
  
};

export default FormInstructor;
