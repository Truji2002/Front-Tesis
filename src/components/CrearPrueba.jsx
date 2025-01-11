import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { showAlert } from './alerts';
import '../styles/CrearPrueba.css';
import Swal from 'sweetalert2';

const CrearPrueba = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  const params = new URLSearchParams(location.search);
  const cursoId = params.get('cursoId');

  const [duracion, setDuracion] = useState('');
  const [error, setError] = useState(null);

  const handleCrearPrueba = async (e) => {
    e.preventDefault();
    setError(null);

    if (!cursoId) {
      showAlert('Error', 'ID del curso no proporcionado.', 'error');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/pruebas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          curso: cursoId,
          duracion: parseInt(duracion),
          preguntas: [],
        }),
      });

      if (response.ok || response.status === 201) {
        const data = await response.json();
        showAlert('Éxito', 'Prueba creada correctamente.', 'success');
        if (data.id) {
          navigate(`/pruebas/admin/${data.id}`);
        } else {
          showAlert('Error', 'ID de prueba no proporcionado en la respuesta.', 'error');
        }
      } else {
        const errorData = await response.json();
        if (errorData.curso) {
          showAlert('Error', errorData.curso.join(' '), 'error');
          setError(errorData.curso.join(' '));
        } else {
          showAlert('Error', 'Error al crear la prueba.', 'error');
          setError('Error al crear la prueba.');
        }
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      showAlert('Error', 'Error al conectar con el servidor.', 'error');
    }
  };

  return (
    <div className="crear-prueba-container">
      <h2>Crear Nueva Prueba</h2>
      <form onSubmit={handleCrearPrueba}>
        <div className="form-group">
          <label>Duración (minutos):</label>
          <input
            type="number"
            className="duracion-input"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <div className="form-actions">
          <button type="submit" className="boton-crear-prueba">
            Crear Prueba
          </button>
        </div>
      </form>

      <div className="imagen-footer">
        <img
          src="https://elearningindustry.com/wp-content/uploads/2017/12/5-advantages-of-online-mock-tests-1.png"
          alt="Descripción de la imagen"
        />
      </div>
    </div>
  );
};

export default CrearPrueba;
