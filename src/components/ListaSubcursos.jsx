import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from './ui/button/Button';
import Swal from 'sweetalert2';
import '../styles/ListaSubcursos.css';

const ListaSubcursos = () => {
  const { cursoId } = useParams(); // Obtener el ID del curso desde la URL
  const navigate = useNavigate();
  const [tituloCurso, setTituloCurso] = useState('Curso');
  const [subcursos, setSubcursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursoActivo, setCursoActivo] = useState(false); // Estado para determinar si el curso está activo

  // Verificar si el curso tiene contrato activo
  const checkContratoActivo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://127.0.0.1:8000/api/progreso/verificar-contrato-activo/?curso_id=${cursoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al verificar el contrato activo.');
      }

      const data = await response.json();
      setCursoActivo(data.activo); // Actualiza el estado según el campo "activo"
    } catch (error) {
      console.error('Error al verificar contrato activo:', error);
      setCursoActivo(false); // Por defecto, asume que no está activo si hay un error
    }
  };

  // Obtener la lista de subcursos
  const fetchSubcursos = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://127.0.0.1:8000/api/subcursos/curso/${cursoId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener los subcursos.');
      }

      const data = await response.json();
      setSubcursos(data);
    } catch (error) {
      console.error('Error al cargar subcursos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkContratoActivo(); // Verificar contrato activo
    fetchSubcursos(); // Cargar subcursos
  }, [cursoId]);

  const handleEditarSubcurso = (subcursoId) => {
    navigate(`/subcourses/edit/${subcursoId}`, { state: { deshabilitado: cursoActivo } });
  };

  const handleEliminarSubcurso = async (subcursoId) => {
    const confirm = await Swal.fire({
      title: 'Advertencia',
      text: '¿Estás seguro de que deseas eliminar este subcurso con sus respectivos módulos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'var(--logout-bg-color)',
      cancelButtonColor: 'var(--primary-color)',
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://127.0.0.1:8000/api/subcursos/${subcursoId}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      {/* Mensaje de advertencia si el curso está activo */}
      {cursoActivo && (
        <div className="alert alert-warning">
          No puedes modificar este curso porque está activo.
        </div>
      )}

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
                  <Button onClick={() => handleEditarSubcurso(subcurso.id)}>
                    {cursoActivo ? 'Ver contenido' : 'Editar'}
                  </Button>
                  <Button
                    onClick={() => handleEliminarSubcurso(subcurso.id)}
                    className="danger"
                    disabled={cursoActivo} // Deshabilita si el curso está activo
                  >
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
      <div className="botones-container">
        <Button onClick={() => navigate(`/subcourses/create/${cursoId}`)} disabled={cursoActivo}>
          + Crear Subcurso
        </Button>
      </div>
      <div className="botones-container">
        <Button onClick={() => navigate('/courses/list')} className="volver-button">
          Volver a Cursos
        </Button>
      </div>
    </div>
  );
};

export default ListaSubcursos;
