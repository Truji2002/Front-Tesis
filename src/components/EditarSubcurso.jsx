import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubcursoForm from './SubcursoForm';
import { showAlert } from './alerts';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditarSubcurso = () => {
  const { subcursoId } = useParams();
  const navigate = useNavigate();
  const [subcurso, setSubcurso] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcursoData = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        const subcursoResponse = await fetch(`${API_BASE_URL}/api/subcursos/${subcursoId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!subcursoResponse.ok) throw new Error('Error al cargar los datos del subcurso.');

        const subcursoData = await subcursoResponse.json();
        setSubcurso(subcursoData);

        const modulosResponse = await fetch(`${API_BASE_URL}/api/modulos/subcurso/${subcursoId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!modulosResponse.ok) throw new Error('Error al cargar los módulos.');

        const modulosData = await modulosResponse.json();
        setModulos(modulosData);

        setLoading(false);
      } catch (error) {
        showAlert('Error', error.message || 'No se pudo cargar el subcurso.', 'error');
        setLoading(false);
      }
    };

    fetchSubcursoData();
  }, [subcursoId]);

  if (loading) {
    return <p>Cargando subcurso...</p>;
  }

  return (
    <div className="editar-subcurso-container">
      <SubcursoForm isEdit={true} subcurso={subcurso} initialModulos={modulos} onSubmit={() => navigate(-1)} />
    </div>
  );
};

export default EditarSubcurso;
