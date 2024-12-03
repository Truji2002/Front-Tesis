import React, { useState, useEffect } from 'react';
import Button from './ui/button/button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import { showAlert } from './alerts';
import '../styles/CursoForm.css';
import Swal from 'sweetalert2';

const CursoForm = ({ isEdit, curso, onSubmit }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null, // Aquí se guardará el archivo seleccionado
  });

  useEffect(() => {
    if (isEdit && curso) {
      setFormData({
        titulo: curso.titulo || '',
        descripcion: curso.descripcion || '',
        imagen: null, // La imagen no se carga como valor inicial
      });
    }
  }, [isEdit, curso]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imagen: file });
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
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

      if (!response.ok) throw new Error('Error al guardar el curso.');

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
    <form className="curso-form" onSubmit={handleSubmit}>
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
      </div>
  
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Vista previa de la imagen seleccionada" />
        </div>
      )}
  
      <Button type="submit" className="w-full">
        {isEdit ? 'Actualizar Curso' : 'Crear Curso'}
      </Button>
    </form>
  );
};  

export default CursoForm;
