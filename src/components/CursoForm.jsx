// src/components/CursoForm.jsx

import React, { useState, useEffect } from 'react';
import Button from './ui/button/Button';
import Input from './ui/input/Input';
import Label from './ui/label/Label';
import { showAlert } from './alerts';
import '../styles/CursoForm.css';
import Swal from 'sweetalert2';

const CursoForm = ({ isEdit, curso, onSubmit }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null, // Aquí se guardará el archivo seleccionado
    simulacion: false, // Nuevo campo
  });

  const [imagePreview, setImagePreview] = useState(null); // Vista previa de la nueva imagen
  const [currentImage, setCurrentImage] = useState(null); // Imagen actual del curso

  useEffect(() => {
    if (isEdit && curso) {
      setFormData({
        titulo: curso.titulo || '',
        descripcion: curso.descripcion || '',
        imagen: null, // Nueva imagen no cargada aún
        simulacion: curso.simulacion || false, // Cargar el valor del campo simulación
      });
      setCurrentImage(curso.imagen); // Cargar la imagen actual desde la API
    }
  }, [isEdit, curso]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, simulacion: e.target.checked });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imagen: file });
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result); // Actualizar vista previa
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo || !formData.descripcion) {
      showAlert('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    const payload = new FormData();
    payload.append('titulo', formData.titulo);
    payload.append('descripcion', formData.descripcion);
    payload.append('simulacion', formData.simulacion); // Incluir el campo simulación
    if (formData.imagen) {
      payload.append('imagen', formData.imagen);
    }

    const result = await Swal.fire({
      title: isEdit ? 'Confirmación de Modificación' : 'Confirmación de Creación',
      text: isEdit
        ? '¿Está seguro de que desea modificar este curso?'
        : '¿Está seguro de que desea crear este curso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isEdit ? 'Sí, modificar' : 'Sí, crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: 'var(--error-text-color)',
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      const url = isEdit
        ? `http://127.0.0.1:8000/api/cursos/${curso.id}/`
        : 'http://127.0.0.1:8000/api/cursos/';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al guardar el curso.');
      }

      showAlert(
        'Éxito',
        isEdit ? 'Curso modificado con éxito.' : 'Curso creado con éxito.',
        'success'
      );

      onSubmit(); // Callback para actualizar la lista o navegar
    } catch (error) {
      showAlert('Error', error.message || 'No se pudo completar la operación.', 'error');
    }
  };

  return (
    <form className="curso-form" onSubmit={handleSubmit} id="curso-form">
      <h2>{isEdit ? 'Editar Curso' : 'Crear Curso'}</h2>

      <div className="form-group">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="descripcion">Descripción</Label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          rows="4"
          className="textarea"
          required
        />
      </div>

      <div className="form-group">
  <Label htmlFor="imagen">Imagen</Label>
  <Input
    id="imagen"
    name="imagen"
    type="file"
    accept="image/*"
    onChange={handleFileChange}
  />
  <div className="image-preview">
    {imagePreview ? (
      <img src={imagePreview} alt="Vista previa de la imagen seleccionada" />
    ) : currentImage ? (
      <img src={currentImage} alt="Imagen actual del curso" />
    ) : (
      <p>No se ha cargado ninguna imagen</p>
    )}
  </div>
</div>

<div className="form-group simulacion-group">
  <Label htmlFor="simulacion">¿Incluye simulación?</Label>
  <Input
    id="simulacion"
    name="simulacion"
    type="checkbox"
    checked={formData.simulacion}
    onChange={handleCheckboxChange}
  />
</div>

      <div className="crear-curso-button-container">
        <Button type="submit" className="crear-curso-button">
          {isEdit ? 'Modificar Curso' : 'Crear Curso'}
        </Button>
      </div>
    </form>
  );
};

export default CursoForm;
