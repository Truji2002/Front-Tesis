import React, { useState, useEffect } from 'react';
import Button from './ui/button/Button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import Swal from 'sweetalert2';
import { showAlert } from './alerts';
import '../styles/SubcursoForm.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubcursoForm = ({ isEdit, subcurso, onSubmit, initialModulos = [] }) => {
  const { cursoId } = useParams();
  const location = useLocation(); // Para recibir parámetros desde la navegación
  const [subcursoData, setSubcursoData] = useState({
    nombre: '',
    curso: cursoId || '', // Curso asociado
  });
  const navigate = useNavigate();
  const [modulos, setModulos] = useState(initialModulos);
  const deshabilitado = location.state?.deshabilitado || false; // Variable para verificar si el curso está activo

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
    if (deshabilitado) return; // No permitir agregar módulos si está deshabilitado
    setModulos([...modulos, { id: null, nombre: '', enlace: '', archivo: null, archivo_url: null }]);
  };

  const handleModuloChange = (index, field, value) => {
    if (deshabilitado) return; // No permitir editar módulos si está deshabilitado
    const updatedModulos = [...modulos];
    updatedModulos[index][field] = value;
    setModulos(updatedModulos);
  };

  const handleFileChange = (index, file) => {
    if (deshabilitado) return; // No permitir subir archivos si está deshabilitado
    const updatedModulos = [...modulos];
    if (updatedModulos[index].archivo_url) {
      URL.revokeObjectURL(updatedModulos[index].archivo_url);
    }
    updatedModulos[index].archivo = file;
    updatedModulos[index].archivo_url = file ? URL.createObjectURL(file) : null;
    setModulos(updatedModulos);
  };

  const handleRemoveModulo = async (index) => {
    if (deshabilitado) return; // No permitir eliminar módulos si está deshabilitado
    const modulo = modulos[index];

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará el módulo de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    if (modulo.id) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/api/modulos/${modulo.id}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al eliminar el módulo.');

        Swal.fire('¡Eliminado!', 'El módulo ha sido eliminado correctamente.', 'success');
      } catch (error) {
        Swal.fire('Error', error.message || 'No se pudo eliminar el módulo.', 'error');
        return;
      }
    } else {
      Swal.fire('Eliminado', 'El módulo ha sido eliminado de forma local.', 'success');
    }

    const updatedModulos = modulos.filter((_, i) => i !== index);
    setModulos(updatedModulos);
  };

  const renderEnlacePreview = (enlace) => {
    if (enlace && enlace.includes('youtube.com/watch?v=')) {
      const videoId = enlace.split('v=')[1].split('&')[0];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return (
        <div className="preview-section">
          <h4>Vista previa del Enlace</h4>
          <iframe
            src={embedUrl}
            width="100%"
            height="600px"
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
    if (archivo instanceof File) {
      if (archivo.type === 'application/pdf') {
        return (
          <div className="preview-section">
            <iframe
              src={archivo_url}
              width="100%"
              height="600px"
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
              style={{ width: '100%', height: '600px', objectFit: 'contain' }}
            />
          </div>
        );
      }
    }

    if (archivo_url) {
      if (archivo_url.endsWith('.pdf')) {
        return (
          <div className="preview-section">
            <iframe
              src={archivo_url}
              width="100%"
              height="600px"
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
              style={{ width: '100%', height: '400px', objectFit: 'contain' }}
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

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (deshabilitado) {
      showAlert('Advertencia', 'No puedes modificar este subcurso porque está activo.', 'warning');
      return;
    }

    if (!subcursoData.nombre) {
      showAlert('Error', 'El nombre del subcurso es obligatorio.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
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

      const subcursoResult = await subcursoResponse.json();
      const finalSubcursoId = subcursoResult.id;

      for (const modulo of modulos) {
        const moduloPayload = new FormData();
        moduloPayload.append('nombre', modulo.nombre);
        moduloPayload.append('enlace', modulo.enlace);
        if (modulo.archivo instanceof File) {
          moduloPayload.append('archivo', modulo.archivo);
        } else if (!modulo.archivo) {
          moduloPayload.append('archivo', '');
        }
        moduloPayload.append('subcurso', finalSubcursoId);

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
      onSubmit();
    } catch (error) {
      showAlert('Error', error.message || 'No se pudo completar la operación.', 'error');
    }
  };

  return (
    <form className="subcurso-form" onSubmit={handleSubmit}>
      {deshabilitado && (
        <div className="alert alert-warning">
          No puedes modificar este subcurso porque el curso está activo.
        </div>
      )}

      <h2>{isEdit ? 'Editar Subcurso' : 'Crear Subcurso'}</h2>

      <div className="form-group">
        <Label htmlFor="nombre">Nombre del Subcurso</Label>
        <Input
          id="nombre"
          name="nombre"
          value={subcursoData.nombre}
          onChange={handleInputChange}
          disabled={deshabilitado}
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
                disabled={deshabilitado}
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
                  disabled={deshabilitado}
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
                  disabled={deshabilitado}
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
                  disabled={deshabilitado}
                />
              </div>

              {renderArchivoPreview(modulo.archivo_url, modulo.archivo, isEdit)}
            </div>
          </div>
        ))}

        <div className="add-modulo-button">
        <Button
          type="button"
          onClick={handleAddModulo}
          className=" btn-add-modulo"
          disabled={deshabilitado}
        >
          + Agregar Módulo
        </Button>
        </div>
      </div>

      <div className="button-group">
            <Button
        type="submit"
        className=" btn-guardar-cambios"
        disabled={deshabilitado}
      >
        {isEdit ? 'Guardar Cambios' : 'Crear Subcurso'}
      </Button>
      <Button
        type="button"
        onClick={() => navigate(-1)}
        className=" btn-regresar"
      >
        Regresar
      </Button>
      </div>
    </form>
  );
};

export default SubcursoForm;
