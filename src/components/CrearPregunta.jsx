import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './ui/button/button';
import { showAlert } from './alerts';
import '../styles/CrearPregunta.css';
import Swal from 'sweetalert2';


const CrearPregunta = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  const params = new URLSearchParams(location.search);
  const pruebaId = params.get('pruebaId');

  const [pregunta, setPregunta] = useState('');
  const [opcionesRespuestas, setOpcionesRespuestas] = useState({ A: '', B: '', C: '', D: '' });
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');
  const [puntajePregunta, setPuntajePregunta] = useState('');
  const [error, setError] = useState(null);

  const handleCrearPregunta = async (e) => {
    e.preventDefault();
    setError(null);

    if (!pruebaId) {
      showAlert('Error', 'ID de prueba no proporcionado.', 'error');
      return;
    }

    // Confirmación con SweetAlert
    const confirm = await Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que desea crear esta pregunta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#F44336',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/preguntas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prueba: parseInt(pruebaId),
          pregunta,
          opcionesRespuestas,
          respuestaCorrecta,
          puntajePregunta: parseInt(puntajePregunta),
        }),
      });

      if (response.ok || response.status === 201) {
        const data = await response.json();
        showAlert('Éxito', 'Pregunta creada correctamente.', 'success');
        navigate(`/pruebas/admin/${pruebaId}`);
      } else {
        const errorData = await response.json();
        if (
          errorData.pregunta ||
          errorData.opcionesRespuestas ||
          errorData.respuestaCorrecta ||
          errorData.puntajePregunta
        ) {
          const mensajesError = Object.values(errorData).flat();
          showAlert('Error', mensajesError.join(' '), 'error');
          setError(mensajesError.join(' '));
        } else {
          showAlert('Error', 'Error al crear la pregunta.', 'error');
          setError('Error al crear la pregunta.');
        }
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      showAlert('Error', 'Error al conectar con el servidor.', 'error');
    }
  };

  return (
    <div className="crear-pregunta-container">
      <h2>Crear Nueva Pregunta</h2>
      <form onSubmit={handleCrearPregunta} className="formulario-pregunta">
        <div className="form-group">
          <label htmlFor="pregunta">Pregunta:</label>
          <textarea
            id="pregunta"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            required
            className="input-area"
          />
        </div>
        <div className="form-group">
          <label htmlFor="opcionA">Opción A:</label>
          <input
            type="text"
            id="opcionA"
            value={opcionesRespuestas.A}
            onChange={(e) =>
              setOpcionesRespuestas({ ...opcionesRespuestas, A: e.target.value })
            }
            required
            className="input-text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="opcionB">Opción B:</label>
          <input
            type="text"
            id="opcionB"
            value={opcionesRespuestas.B}
            onChange={(e) =>
              setOpcionesRespuestas({ ...opcionesRespuestas, B: e.target.value })
            }
            required
            className="input-text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="opcionC">Opción C:</label>
          <input
            type="text"
            id="opcionC"
            value={opcionesRespuestas.C}
            onChange={(e) =>
              setOpcionesRespuestas({ ...opcionesRespuestas, C: e.target.value })
            }
            required
            className="input-text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="opcionD">Opción D:</label>
          <input
            type="text"
            id="opcionD"
            value={opcionesRespuestas.D}
            onChange={(e) =>
              setOpcionesRespuestas({ ...opcionesRespuestas, D: e.target.value })
            }
            required
            className="input-text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="respuestaCorrecta">Respuesta Correcta:</label>
          <input
            type="text"
            id="respuestaCorrecta"
            value={respuestaCorrecta}
            onChange={(e) => setRespuestaCorrecta(e.target.value)}
            required
            className="input-text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="puntajePregunta">Puntaje de la Pregunta:</label>
          <input
            type="number"
            id="puntajePregunta"
            value={puntajePregunta}
            onChange={(e) => setPuntajePregunta(e.target.value)}
            required
            className="input-text"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="button-container">
          <Button type="submit" className="primary">
            Crear Pregunta
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CrearPregunta;