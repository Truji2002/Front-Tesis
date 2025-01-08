import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from './ui/button/Button';
import { showAlert } from './alerts';
import '../styles/ListaSubcursos.css';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';

const ListaSubcursos = () => {
  const location = useLocation();
  const [tituloCurso, setTituloCurso] = useState('');
  const { cursoId } = useParams(); // Obtener el ID del curso desde la URL
  const navigate = useNavigate();
  const [subcursos, setSubcursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubcursos = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/api/subcursos/curso/${cursoId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los subcursos.');
      }

      const data = await response.json();
      setSubcursos(data);
    } catch (error) {
      showAlert('Error', error.message || 'No se pudieron cargar los subcursos.', 'error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Usar primero el estado de la navegación, luego buscar en localStorage
    const titulo = location.state?.tituloCurso || localStorage.getItem('tituloCurso');
    setTituloCurso(titulo || 'Sin Título');
  }, [location]);

  useEffect(() => {
    fetchSubcursos();
  }, [cursoId]);

  const handleCrearSubcurso = () => {
    navigate(`/subcourses/create/${cursoId}`);
  };

  const handleVerModulos = (subcursoId) => {
    navigate(`/subcursos/${subcursoId}/modulos`);
  };

  const handleEditarSubcurso = (subcursoId) => {
    navigate(`/subcourses/edit/${subcursoId}`);
  };

  const handleEliminarSubcurso = async (subcursoId) => {
    const confirm = await Swal.fire({
      title: 'Advertencia',
      text: '¿Estás seguro de que deseas eliminar este subcurso con sus respectivos módulos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'var(--logout-bg-color)', // Color del botón Confirmar
      cancelButtonColor: 'var(--primary-color)', // Color del botón Cancelar
    });
  
    if (!confirm.isConfirmed) return;
  
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/api/subcursos/${subcursoId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el subcurso.');
      }
  
      Swal.fire({
        title: 'Éxito',
        text: 'Subcurso eliminado correctamente.',
        icon: 'success',
        confirmButtonColor: 'var(--primary-color)',
      });
  
      fetchSubcursos(); // Refrescar la lista de subcursos
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo eliminar el subcurso.',
        icon: 'error',
        confirmButtonColor: 'var(--error-color)',
      });
    }
  };

  return (
    <div className="lista-subcursos-container">
      <h2>Lista de subcursos {tituloCurso}</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : subcursos.length > 0 ? (
        <table className="subcursos-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad de Módulos</th>
              
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subcursos.map((subcurso) => (
              <tr key={subcurso.id}>
                <td>{subcurso.nombre}</td>
                <td>{subcurso.cantidad_modulos}</td>
                
                <td>
                  
                  <Button onClick={() => handleEditarSubcurso(subcurso.id)}>Editar</Button>
                  <Button onClick={() => handleEliminarSubcurso(subcurso.id)} className="danger">
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron subcursos.</p>
      )}
      <Button onClick={handleCrearSubcurso} className="primary">
        Crear Subcurso
      </Button>
      <Button onClick={() => navigate('/courses/list')} className="volver-button">
        Volver a Cursos
      </Button>
    </div>
  );
};

export default ListaSubcursos;
