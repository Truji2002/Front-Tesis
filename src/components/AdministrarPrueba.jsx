import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Button from './ui/button/button';
import { showAlert } from './alerts';
import '../styles/AdministrarPrueba.css';

const AdministrarPrueba = () => {
  const { pruebaId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const [prueba, setPrueba] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [duracion, setDuracion] = useState('');
  const [cursoActivo, setCursoActivo] = useState(false); // Estado para determinar si el curso está activo
  const [error, setError] = useState(null);

  // Verificar si el curso relacionado con la prueba está activo
  const checkContratoActivo = async (cursoId) => {
    try {
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

  useEffect(() => {
    if (!pruebaId) {
      showAlert('Error', 'ID de prueba no proporcionado.', 'error');
      navigate('/pruebas/list');
      return;
    }

    const fetchPrueba = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/pruebas/${pruebaId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al obtener la prueba.');
        const data = await response.json();
        setPrueba(data);
        setDuracion(data.duracion);
        setPreguntas(data.preguntas);

        // Verificar si el curso relacionado con la prueba está activo
        if (data.curso) {
          checkContratoActivo(data.curso);
        }
      } catch (error) {
        showAlert('Error', 'No se pudo cargar la prueba.', 'error');
      }
    };

    fetchPrueba();
  }, [pruebaId, token, navigate]);

  const handleActualizarPrueba = async (e) => {
    e.preventDefault();
    setError(null);

    if (cursoActivo) {
      showAlert('Advertencia', 'No puedes modificar esta prueba porque el curso está activo.', 'warning');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que desea actualizar esta prueba?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#F44336',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/pruebas/${pruebaId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          duracion: parseInt(duracion, 10),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrueba(data);
        showAlert('Éxito', 'Prueba actualizada correctamente.', 'success');
      } else {
        const errorData = await response.json();
        setError(JSON.stringify(errorData));
        showAlert('Error', 'Error al actualizar la prueba.', 'error');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      showAlert('Error', 'Error al conectar con el servidor.', 'error');
    }
  };

  const handleEliminarPrueba = async () => {
    if (cursoActivo) {
      showAlert('Advertencia', 'No puedes eliminar esta prueba porque el curso está activo.', 'warning');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que desea eliminar esta prueba? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#F44336',
      cancelButtonColor: '#6c757d',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/pruebas/${pruebaId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        showAlert('Éxito', 'Prueba eliminada correctamente.', 'success');
        navigate('/courses/list');
      } else {
        const errorData = await response.json();
        showAlert('Error', JSON.stringify(errorData), 'error');
      }
    } catch (err) {
      showAlert('Error', 'Error al conectar con el servidor.', 'error');
    }
  };

  const handleEliminarPregunta = async (preguntaId) => {
    if (cursoActivo) {
      showAlert('Advertencia', 'No puedes eliminar preguntas porque el curso está activo.', 'warning');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que desea eliminar esta pregunta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#F44336',
      cancelButtonColor: '#6c757d',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/preguntas/${preguntaId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        setPreguntas(preguntas.filter((p) => p.id !== preguntaId));
        showAlert('Éxito', 'Pregunta eliminada correctamente.', 'success');
      } else {
        const errorData = await response.json();
        showAlert('Error', JSON.stringify(errorData), 'error');
      }
    } catch (err) {
      showAlert('Error', 'Error al conectar con el servidor.', 'error');
    }
  };

  const handleAgregarPregunta = () => {
    if (cursoActivo) {
      showAlert('Advertencia', 'No puedes agregar preguntas porque el curso está activo.', 'warning');
      return;
    }
    navigate(`/preguntas/crear?pruebaId=${pruebaId}`);
  };

  const handleEditarPregunta = (preguntaId) => {
    if (cursoActivo) {
      showAlert('Advertencia', 'No puedes editar preguntas porque el curso está activo.', 'warning');
      return;
    }
    navigate(`/preguntas/edit/${preguntaId}`);
  };

  const handleVolverACursos = () => {
    navigate('/courses/list');
  };

  if (!prueba) return <div className="loading">Cargando...</div>;

  return (
    <div className="administrar-prueba-container">
      <h2>Administrar Prueba</h2>
      {cursoActivo && (
        <div className="alert alert-warning">
          Este curso está activo. No puedes modificar ni eliminar la prueba ni las preguntas asociadas.
        </div>
      )}
      <form onSubmit={handleActualizarPrueba} className="formulario-prueba">
        <div className="form-group">
          <label htmlFor="duracion">Duración (minutos):</label>
          <input
            type="number"
            id="duracion"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            required
            className="duracion-input"
            disabled={cursoActivo} // Deshabilitar si el curso está activo
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="botones-actualizar-eliminar">
          <Button
            type="submit"
            className="btn btn-primary-actualizar btn-small"
            disabled={cursoActivo} // Deshabilitar si el curso está activo
          >
            Actualizar Prueba
          </Button>
          <Button
            type="button"
            onClick={handleEliminarPrueba}
            className="btn btn-danger btn-small"
            disabled={cursoActivo} // Deshabilitar si el curso está activo
          >
            Eliminar Prueba
          </Button>
        </div>
      </form>

      <h3>Preguntas</h3>
      <div className="boton-agregar-pregunta">
        <Button
          onClick={handleAgregarPregunta}
          className="btn btn-success btn-small"
          disabled={cursoActivo} // Deshabilitar si el curso está activo
        >
          Agregar Pregunta
        </Button>
      </div>
      {preguntas.length > 0 ? (
        <ul className="preguntas-lista">
          {preguntas.map((pregunta) => (
            <li key={pregunta.id} className="pregunta-item">
              <p>
                <strong>Pregunta:</strong> {pregunta.pregunta}
              </p>
              <p>
                <strong>Opciones:</strong>
              </p>
              <ul>
                {Object.entries(pregunta.opcionesRespuestas).map(([letra, texto]) => (
                  <li key={letra}>
                    <strong>{letra}:</strong> {texto}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Respuesta Correcta:</strong> {pregunta.respuestaCorrecta}
              </p>
              <p>
                <strong>Puntaje:</strong> {pregunta.puntajePregunta}
              </p>
              <div className="botones-editar-eliminar-pregunta">
                <Button
                  onClick={() => handleEditarPregunta(pregunta.id)}
                  className="btn btn-warning btn-small"
                  disabled={cursoActivo} // Deshabilitar si el curso está activo
                >
                  Editar
                </Button>
                <Button
                  onClick={() => handleEliminarPregunta(pregunta.id)}
                  className="btn btn-danger btn-small"
                  disabled={cursoActivo} // Deshabilitar si el curso está activo
                >
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sin-preguntas">No hay preguntas asociadas a esta prueba.</p>
      )}
      <div className="boton-volver-cursos">
        <Button onClick={handleVolverACursos} className="btn btn-secondary btn-small">
          Volver a Cursos
        </Button>
      </div>
    </div>
  );
};

export default AdministrarPrueba;
