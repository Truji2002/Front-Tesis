import React, { useState } from 'react';
import Button from './ui/button/button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import { showAlert } from './alerts';
import Swal from 'sweetalert2';
import '../styles/SubcursoForm.css';
import { useParams, useNavigate } from 'react-router-dom';

const SubcursoForm = ({ onSubmit }) => {
  const { cursoId } = useParams();
  const [subcursoData, setSubcursoData] = useState({
    nombre: '',
    curso: cursoId,
  });

  const [modulos, setModulos] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubcursoData({ ...subcursoData, [name]: value });
  };

  const handleAddModulo = () => {
    setModulos([...modulos, { nombre: '', enlace: '', archivo: null }]);
  };

  const handleModuloChange = (index, field, value) => {
    const updatedModulos = [...modulos];
    updatedModulos[index][field] = value;
    setModulos(updatedModulos);
  };

  const handleRemoveModulo = (index) => {
    const updatedModulos = modulos.filter((_, i) => i !== index);
    setModulos(updatedModulos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subcursoData.nombre) {
      showAlert('Error', 'El nombre del subcurso es obligatorio.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const subcursoResponse = await fetch('http://127.0.0.1:8000/api/subcursos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subcursoData),
      });

      if (!subcursoResponse.ok) throw new Error('Error al crear el subcurso.');
      const subcurso = await subcursoResponse.json();

      for (const modulo of modulos) {
        const moduloPayload = new FormData();
        moduloPayload.append('nombre', modulo.nombre);
        moduloPayload.append('enlace', modulo.enlace);
        if (modulo.archivo) {
          moduloPayload.append('archivo', modulo.archivo);
        }
        moduloPayload.append('subcurso', subcurso.id);

        const moduloResponse = await fetch('http://127.0.0.1:8000/api/modulos/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: moduloPayload,
        });

        if (!moduloResponse.ok) throw new Error('Error al crear un módulo.');
      }

      showAlert('Éxito', 'Subcurso y módulos creados con éxito.', 'success');
      onSubmit();
    } catch (error) {
      showAlert('Error', error.message || 'No se pudo completar la operación.', 'error');
    }
  };

  const renderEnlacePreview = (enlace) => {
    if (enlace && enlace.includes('youtube.com')) {
      return (
        <div className="visualizador-enlace">
          <h4>Vista previa del Enlace</h4>
          <iframe
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${enlace.split('v=')[1]}`}
            title="YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    return null;
  };

  const renderArchivoPreview = (archivo) => {
    if (archivo) {
      if (archivo.type === 'application/pdf') {
        return (
          <div className="visualizador-archivo">
            <h4>Vista previa del Archivo</h4>
            <iframe
              width="100%"
              height="300"
              src={URL.createObjectURL(archivo)}
              title="PDF Viewer"
            ></iframe>
          </div>
        );
      }

      if (archivo.type.startsWith('image/')) {
        return (
          <div className="visualizador-archivo">
            <h4>Vista previa del Archivo</h4>
            <img
              src={URL.createObjectURL(archivo)}
              alt="Vista previa del archivo"
              style={{ width: '100%', height: '300' }}
            />
          </div>
        );
      }
    }
    return null;
  };

  return (
    <form className="subcurso-form" onSubmit={handleSubmit}>
      <h2>Crear Subcurso y Módulos</h2>

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
              accept="application/pdf,application/vnd.ms-excel,image/*"
              onChange={(e) => handleModuloChange(index, 'archivo', e.target.files[0])}
            />

            {renderArchivoPreview(modulo.archivo)}

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
        Crear Subcurso y Módulos
      </Button>
    </form>
  );
};

export default SubcursoForm;
