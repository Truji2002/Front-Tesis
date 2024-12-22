import React, { useState, useEffect } from 'react';
import Button from './ui/button/button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import { showAlert } from './alerts';
import '../styles/SubcursoForm.css';
import { useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom';

const SubcursoForm = ({ isEdit, subcurso, onSubmit, initialModulos = [] }) => {
  const { cursoId } = useParams();
  const [subcursoData, setSubcursoData] = useState({
    nombre: '',
    curso: cursoId || '',// Curso asociado
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
    setModulos([...modulos, { id: null, nombre: '', enlace: '', archivo: null }]);
  };

  const handleModuloChange = (index, field, value) => {
    const updatedModulos = [...modulos];
    updatedModulos[index][field] = value;
    setModulos(updatedModulos);
  };

  const handleFileChange = (index, file) => {
    const updatedModulos = [...modulos];
    updatedModulos[index].archivo = file;
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
        <div className="enlace-preview">
          <h4>Vista previa del Enlace</h4>
          <iframe
            src={embedUrl}
            width="100%"
            height="300px"
            title="Vista previa del video de YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    return null;
  };
  

  const renderArchivoPreview = (archivo, isEdit) => {
    // Si el archivo proviene del backend (es una URL) y estamos editando
    if (isEdit && typeof archivo === 'string') {
      return (
        <div>
          <a
            href={`http://127.0.0.1:8000${archivo}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver archivo actual
          </a>
        </div>
      );
    }
  
    // Si el archivo es un nuevo archivo local (File)
    if (archivo instanceof File) {
      const fileUrl = URL.createObjectURL(archivo);
      if (archivo.type === 'application/pdf') {
        return (
          <iframe
            src={fileUrl}
            width="100%"
            height="300px"
            title="Vista previa del archivo PDF"
          ></iframe>
        );
      }
  
      if (archivo.type.startsWith('image/')) {
        return (
          <img
            src={fileUrl}
            alt="Vista previa de la imagen"
            style={{ width: '100%', height: '300px' }}
          />
        );
      }
    }
  
    return null; // No hay archivo seleccionado
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
        ? `http://127.0.0.1:8000/api/subcursos/${subcurso.id}/`
        : 'http://127.0.0.1:8000/api/subcursos/';
  
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
        if (modulo.archivo) moduloPayload.append('archivo', modulo.archivo);
        moduloPayload.append('subcurso', finalSubcursoId); // Asignar el ID del subcurso
  
        const moduloMethod = modulo.id ? 'PATCH' : 'POST';
        const moduloUrl = modulo.id
          ? `http://127.0.0.1:8000/api/modulos/${modulo.id}/`
          : 'http://127.0.0.1:8000/api/modulos/';
  
        const moduloResponse = await fetch(moduloUrl, {
          method: moduloMethod,
          headers: { Authorization: `Bearer ${token}` },
          body: moduloPayload,
        });
  
        if (!moduloResponse.ok) throw new Error('Error al guardar un módulo.');
      }
  
      showAlert(
        'Éxito',
        isEdit ? 'Subcurso y módulos actualizados con éxito.' : 'Subcurso y módulos creados con éxito.',
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
            <Label htmlFor={`modulo-nombre-${index}`}>Nombre del Módulo</Label>
            <Input
              id={`modulo-nombre-${index}`}
              name={`modulo-nombre-${index}`}
              value={modulo.nombre}
              onChange={(e) => handleModuloChange(index, 'nombre', e.target.value)}
              required
            />

            <Label htmlFor={`modulo-enlace-${index}`}>Enlace</Label>
            <Input
              id={`modulo-enlace-${index}`}
              name={`modulo-enlace-${index}`}
              value={modulo.enlace}
              onChange={(e) => handleModuloChange(index, 'enlace', e.target.value)}
            />
            {renderEnlacePreview(modulo.enlace)}

            <Label htmlFor={`modulo-archivo-${index}`}>Archivo</Label>
            <Input
              id={`modulo-archivo-${index}`}
              name={`modulo-archivo-${index}`}
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
            />

            {renderArchivoPreview(modulo.archivo,isEdit)}

            <Button type="button" onClick={() => handleRemoveModulo(index)} className="danger">
              Eliminar
            </Button>
          </div>
        ))}

        <Button type="button" onClick={handleAddModulo} className="primary">
          Agregar Módulo
        </Button>
      </div>

      <Button type="submit" className="w-full">
        {isEdit ? 'Guardar Cambios' : 'Crear Subcurso'}
      </Button>
      <Button type="button" onClick={() => navigate(-1)} className="volver-button">
          Regresar
        </Button>
    </form>
  );
};

export default SubcursoForm;
