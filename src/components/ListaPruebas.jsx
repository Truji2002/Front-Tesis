import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/button/button';
import { showAlert } from './alerts'; 
import '../styles/ListaCursos.css'; // Puedes usar la misma hoja de estilos o crear una propia

const ListaPruebas = () => {
  const navigate = useNavigate();
  const [pruebas, setPruebas] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchPruebas = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/pruebas/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Error al obtener las pruebas.');
        const data = await response.json();
        setPruebas(data);
      } catch (err) {
        setError('No se pudieron cargar las pruebas.');
      }
    };
    fetchPruebas();
  }, [token]);

  const handleVerPreguntas = (pruebaId) => {
    navigate(`/pruebas/${pruebaId}/preguntas`);
  };

  const handleEditarPrueba = (pruebaId) => {
    navigate(`/pruebas/${pruebaId}/edit`);
  };

  const handleEliminarPrueba = async (pruebaId) => {
    // Confirmación antes de eliminar
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta prueba?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/pruebas/${pruebaId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        // Eliminar la prueba del estado local
        setPruebas(pruebas.filter((p) => p.id !== pruebaId));
        showAlert('Éxito', 'Prueba eliminada con éxito.', 'success');
      } else {
        showAlert('Error', 'No se pudo eliminar la prueba.', 'error');
      }
    } catch (err) {
      showAlert('Error', 'Hubo un problema al conectar con el servidor.', 'error');
    }
  };

  const handleCrearPrueba = () => {
    navigate('/pruebas/create');
  };

  return (
    <div className="lista-cursos-container">
      <h2>Lista de Pruebas</h2>
      {error && <p className="error">{error}</p>}

      {/* Botón para crear una nueva prueba */}
      <Button onClick={handleCrearPrueba} className="primary" style={{ marginBottom: '20px' }}>
        Crear Prueba
      </Button>

      <table className="cursos-table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Duración (min)</th>
            <th>Calificación</th>
            <th>Fecha de Evaluación</th>
            <th>Aprobado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pruebas.length > 0 ? (
            pruebas.map((prueba) => (
              <tr key={prueba.id}>
                <td>{prueba.curso ? prueba.curso : 'Sin curso'}</td>
                <td>{prueba.duracion}</td>
                <td>{prueba.calificacion}</td>
                <td>{prueba.fechaEvaluacion}</td>
                <td>{prueba.estaAprobado ? 'Sí' : 'No'}</td>
                <td>
                  <Button onClick={() => handleVerPreguntas(prueba.id)} className="info" style={{ marginRight: '5px' }}>
                    Ver Preguntas
                  </Button>
                  <Button onClick={() => handleEditarPrueba(prueba.id)} className="warning" style={{ marginRight: '5px' }}>
                    Editar
                  </Button>
                  <Button onClick={() => handleEliminarPrueba(prueba.id)} className="danger">
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No se encontraron pruebas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaPruebas;
