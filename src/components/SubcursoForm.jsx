/* src/components/SubcursoForm.jsx */

import React, { useState, useEffect } from 'react';
import Button from './ui/button/Button';
import Input from './ui/input/Input';
import Label from './ui/label/Label';
import { showAlert } from './alerts';
import '../styles/SubcursoForm.css';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubcursoForm = ({ isEdit, subcurso, onSubmit, initialModulos = [] }) => {
  const { cursoId } = useParams();
  const [subcursoData, setSubcursoData] = useState({
    nombre: '',
    curso: cursoId || '', // Curso asociado
  });
  const navigate = useNavigate();
  const [modulos, setModulos] = useState(initialModulos);

  useEffect(() => {
    if (isEdit && subcurso) {
      setSubcursoData({
        nombre: subcurso.nombre || '',
        curso: subcurso.curso || '',
      });
    }
  }, [isEdit, subcurso]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubcursoData({ ...subcursoData, [name]: value });
  };

  const handleAddModulo = () => {
    setModulos([...modulos, { id: null, nombre: '', enlace: '', archivo: null, archivo_url: null }]);
  };

  const handleModuloChange = (index, field, value) => {
    const updatedModulos = [...modulos];
    updatedModulos[index][field] = value;
    setModulos(updatedModulos);
  };

  const handleFileChange = (index, file) => {
    const updatedModulos = [...modulos];
    // Revocar el objeto URL anterior si existe para evitar fugas de memoria
    if (updatedModulos[index].archivo_url) {
      URL.revokeObjectURL(updatedModulos[index].archivo_url);
    }
    updatedModulos[index].archivo = file;
    updatedModulos[index].archivo_url = file ? URL.createObjectURL(file) : null;
    setModulos(updatedModulos);
  };

  const handleRemoveModulo = (index) => {
    const updatedModulos = modulos.filter((_, i) => i !== index);
    setModulos(updatedModulos);
  };

  const renderEnlacePreview = (enlace) => {
    if (enlace && enlace.includes('youtube.com/watch?v=')) {
      const videoId = enlace.split('v=')[1].split('&')[0]; // Extraer el ID del video
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return (
        <div className="preview-section">
          <h4>Vista previa del Enlace</h4>
          <iframe
            src={embedUrl}
            width="100%"
            height="200px" /* Reducido de 300px a 200px */
            title="Vista previa del video de YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    return null;
  };

  const renderArchivoPreview = (archivo_url, archivo, isEdit) => {
    // Si archivo es un objeto File (nuevo archivo local), priorízalo
    if (archivo instanceof File) {
      if (archivo.type === 'application/pdf') {
        return (
          <div className="preview-section">
            <iframe
              src={archivo_url}
              width="100%"
              height="200px" /* Reducido de 300px a 200px */
              title="Vista previa del archivo PDF"
            ></iframe>
          </div>
        );
      }

      if (archivo.type.startsWith('image/')) {
        return (
          <div className="preview-section">
            <img
              src={archivo_url}
              alt="Vista previa de la imagen"
              style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} /* Reducido maxHeight */
            />
          </div>
        );
      }
    }

    // Si archivo_url está disponible, úsalo (archivo del servidor)
    if (archivo_url) {
      if (archivo_url.endsWith('.pdf')) {
        return (
          <div className="preview-section">
            <iframe
              src={archivo_url}
              width="100%"
              height="200px" /* Reducido de 300px a 200px */
              title="Vista previa del archivo PDF"
            ></iframe>
          </div>
        );
      } else if (archivo_url.match(/\.(jpeg|jpg|png|gif)$/i)) {
        return (
          <div className="preview-section">
            <img
              src={archivo_url}
              alt="Vista previa de la imagen"
              style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} /* Reducido maxHeight */
            />
          </div>
        );
      } else {
        return (
          <div className="preview-section">
            <a href={archivo_url} download>
              Descargar archivo
            </a>
          </div>
        );
      }
    }

    // Si estamos en modo edición y no hay archivo_url pero el archivo existe
    if (isEdit && typeof archivo_url === 'string') {
      return (
        <div className="preview-section">
          <a
            href={`${API_BASE_URL}${archivo_url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver archivo actual
          </a>
        </div>
      );
    }

    // Si no hay archivo o archivo_url
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subcursoData.nombre) {
      showAlert('Error', 'El nombre del subcurso es obligatorio.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');

      // **Primero guardar el subcurso**
      const subcursoMethod = isEdit ? 'PATCH' : 'POST';
      const subcursoUrl = isEdit
        ? `${API_BASE_URL}/api/subcursos/${subcurso.id}/`
        : `${API_BASE_URL}/api/subcursos/`;

      const subcursoResponse = await fetch(subcursoUrl, {
        method: subcursoMethod,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subcursoData),
      });

      if (!subcursoResponse.ok) throw new Error('Error al guardar el subcurso.');

      const subcursoResult = await subcursoResponse.json(); // Respuesta del backend
      const finalSubcursoId = subcursoResult.id; // Obtén el ID del subcurso guardado

      // **Luego guardar los módulos**
      for (const modulo of modulos) {
        const moduloPayload = new FormData();
        moduloPayload.append('nombre', modulo.nombre);
        moduloPayload.append('enlace', modulo.enlace);
        if (modulo.archivo instanceof File) {
          moduloPayload.append('archivo', modulo.archivo);
        } else if (!modulo.archivo) {
          // Si no hay archivo, envíalo vacío o maneja el caso según el backend
          moduloPayload.append('archivo', '');
        }
        moduloPayload.append('subcurso', finalSubcursoId); // Asignar el ID del subcurso

        console.log([...moduloPayload.entries()]);
        const moduloMethod = modulo.id ? 'PATCH' : 'POST';
        const moduloUrl = modulo.id
          ? `${API_BASE_URL}/api/modulos/${modulo.id}/`
          : `${API_BASE_URL}/api/modulos/`;

        const moduloResponse = await fetch(moduloUrl, {
          method: moduloMethod,
          headers: { Authorization: `Bearer ${token}` },
          body: moduloPayload,
        });

        if (!moduloResponse.ok) throw new Error('Error al guardar un módulo.');
      }

      showAlert(
        'Éxito',
        isEdit
          ? 'Subcurso y módulos actualizados con éxito.'
          : 'Subcurso y módulos creados con éxito.',
        'success'
      );
      onSubmit(); // Notifica al componente padre
    } catch (error) {
      showAlert('Error', error.message || 'No se pudo completar la operación.', 'error');
    }
    console.log('Payload subcursoData:', JSON.stringify(subcursoData));
  };

  return (
    <form className="subcurso-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Editar Subcurso' : 'Crear Subcurso'}</h2>

      <div className="form-group">
        <Label htmlFor="nombre">Nombre del Subcurso</Label>
        <Input
          id="nombre"
          name="nombre"
          value={subcursoData.nombre}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="modulos-section">
        <h3>Módulos</h3>
        {modulos.map((modulo, index) => (
          <div key={index} className="modulo-item">
            <div className="modulo-header">
              <h4>Módulo {index + 1}</h4>
              <Button
                type="button"
                onClick={() => handleRemoveModulo(index)}
                className="btn btn-danger btn-small"
              >
                Eliminar
              </Button>
            </div>
            <div className="modulo-body">
              <div className="form-group">
                <Label htmlFor={`modulo-nombre-${index}`}>Nombre del Módulo</Label>
                <Input
                  id={`modulo-nombre-${index}`}
                  name={`modulo-nombre-${index}`}
                  value={modulo.nombre}
                  onChange={(e) => handleModuloChange(index, 'nombre', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor={`modulo-enlace-${index}`}>Enlace</Label>
                <Input
                  id={`modulo-enlace-${index}`}
                  name={`modulo-enlace-${index}`}
                  value={modulo.enlace}
                  onChange={(e) => handleModuloChange(index, 'enlace', e.target.value)}
                />
              </div>

              {renderEnlacePreview(modulo.enlace)}

              <div className="form-group">
                <Label htmlFor={`modulo-archivo-${index}`}>Archivo</Label>
                <Input
                  id={`modulo-archivo-${index}`}
                  name={`modulo-archivo-${index}`}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                />
              </div>

              {renderArchivoPreview(modulo.archivo_url, modulo.archivo, isEdit)}
            </div>
          </div>
        ))}

        <div className="add-modulo-button">
          <Button type="button" onClick={handleAddModulo} className="btn btn-primary btn-small">
            + Agregar Módulo
          </Button>
        </div>
      </div>

      <div className="button-group">
        <Button type="submit" className="btn btn-primary btn-small">
          {isEdit ? 'Guardar Cambios' : 'Crear Subcurso'}
        </Button>
        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-small"
        >
          Regresar
        </Button>
      </div>
    </form>
  );
};

export default SubcursoForm;
