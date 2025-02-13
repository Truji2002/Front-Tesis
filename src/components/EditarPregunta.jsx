import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Button from './ui/button/button';
import Label from './ui/label/label';
import { showAlert } from './alerts';
import '../styles/EditarPregunta.css'; // Asegúrate de que este archivo exista

const EditarPregunta = () => {
  const { id } = useParams(); // ID de la pregunta
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const [pruebaId, setPruebaId] = useState(null); // Estado para almacenar el ID de la prueba
  const [pregunta, setPregunta] = useState('');
  const [opcionesRespuestas, setOpcionesRespuestas] = useState({ A: '', B: '', C: '', D: '' });
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');
  const [puntajePregunta, setPuntajePregunta] = useState(10);
  const [error, setError] = useState(null);

  // Función para obtener los datos de la pregunta existente
  const fetchPregunta = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/preguntas/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener la pregunta.');
      const data = await response.json();
      setPregunta(data.pregunta);
      setOpcionesRespuestas(data.opcionesRespuestas);
      setRespuestaCorrecta(data.respuestaCorrecta);
      setPuntajePregunta(data.puntajePregunta);
      setPruebaId(data.prueba); // Asignar el ID de la prueba
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la pregunta.', 'error');
    }
  };

  useEffect(() => {
    fetchPregunta();
  }, [id]);

  const handleActualizarPregunta = async (e) => {
    e.preventDefault();
    setError(null);

    const opcionesFiltradas = Object.fromEntries(
      Object.entries(opcionesRespuestas).filter(([_, valor]) => valor.trim() !== '')
    );

    // Confirmación con SweetAlert
    const confirm = await Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que desea actualizar esta pregunta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#F44336',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/preguntas/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prueba: pruebaId,
          pregunta,
          opcionesRespuestas: opcionesFiltradas,
          respuestaCorrecta,
          puntajePregunta: parseInt(puntajePregunta, 10),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showAlert('Éxito', 'Pregunta actualizada correctamente.', 'success');
        navigate(`/pruebas/admin/${data.prueba}`);
      } else {
        const errorData = await response.json();
        setError(JSON.stringify(errorData));
        showAlert('Error', 'Error al actualizar la pregunta.', 'error');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      showAlert('Error', 'Error al conectar con el servidor.', 'error');
    }
  };

  return (
    <div className="crear-pregunta-container">
      <h2>Editar Pregunta</h2>
      <form onSubmit={handleActualizarPregunta} className="formulario-pregunta">
        <div className="form-group">
          <Label htmlFor="pregunta">Pregunta:</Label>
          <textarea
            id="pregunta"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            required
            className="input-area"
          />
        </div>
        <div className="form-group">
          <Label htmlFor="opcionA">Opción A:</Label>
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
          <Label htmlFor="opcionB">Opción B:</Label>
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
          <Label htmlFor="opcionC">Opción C:</Label>
          <input
            type="text"
            id="opcionC"
            value={opcionesRespuestas.C}
            onChange={(e) =>
              setOpcionesRespuestas({ ...opcionesRespuestas, C: e.target.value })
            }
            className="input-text"
          />
        </div>
        <div className="form-group">
          <Label htmlFor="opcionD">Opción D:</Label>
          <input
            type="text"
            id="opcionD"
            value={opcionesRespuestas.D}
            onChange={(e) =>
              setOpcionesRespuestas({ ...opcionesRespuestas, D: e.target.value })
            }
            className="input-text"
          />
        </div>
        <div className="form-group">
          <Label htmlFor="respuestaCorrecta">Respuesta Correcta:</Label>
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
          <Label htmlFor="puntajePregunta">Puntaje de la Pregunta:</Label>
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
            Actualizar Pregunta
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarPregunta;
