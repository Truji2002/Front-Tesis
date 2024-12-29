import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from './ui/button/button';

const PreguntasPrueba = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState({
    pregunta: '',
    opcionesRespuestas: '',
    respuestaCorrecta: '',
    puntajePregunta: '',
  });
  const { pruebaId } = useParams(); // Obtenemos el ID de la prueba desde la URL
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/preguntas/?prueba=${pruebaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setPreguntas)
      .catch((err) => console.error('Error al cargar preguntas:', err));
  }, [pruebaId]);

  const handleAddPregunta = async (e) => {
    e.preventDefault();
    await fetch('http://127.0.0.1:8000/api/preguntas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...nuevaPregunta, prueba: pruebaId }),
    });
    setNuevaPregunta({
      pregunta: '',
      opcionesRespuestas: '',
      respuestaCorrecta: '',
      puntajePregunta: '',
    });
    // Refrescar preguntas
    fetch(`http://127.0.0.1:8000/api/preguntas/?prueba=${pruebaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setPreguntas);
  };

  const handleDeletePregunta = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta pregunta?')) {
      await fetch(`http://127.0.0.1:8000/api/preguntas/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPreguntas(preguntas.filter((pregunta) => pregunta.id !== id));
    }
  };

  return (
    <div className="preguntas-container">
      <h2>Administrar Preguntas</h2>
      <form onSubmit={handleAddPregunta}>
        <input
          type="text"
          placeholder="Pregunta"
          value={nuevaPregunta.pregunta}
          onChange={(e) =>
            setNuevaPregunta({ ...nuevaPregunta, pregunta: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Opciones (separadas por comas)"
          value={nuevaPregunta.opcionesRespuestas}
          onChange={(e) =>
            setNuevaPregunta({
              ...nuevaPregunta,
              opcionesRespuestas: e.target.value,
            })
          }
          required
        />
        <input
          type="text"
          placeholder="Respuesta correcta"
          value={nuevaPregunta.respuestaCorrecta}
          onChange={(e) =>
            setNuevaPregunta({
              ...nuevaPregunta,
              respuestaCorrecta: e.target.value,
            })
          }
          required
        />
        <input
          type="number"
          placeholder="Puntaje"
          value={nuevaPregunta.puntajePregunta}
          onChange={(e) =>
            setNuevaPregunta({
              ...nuevaPregunta,
              puntajePregunta: e.target.value,
            })
          }
          required
        />
        <Button type="submit">Agregar Pregunta</Button>
      </form>

      <table className="preguntas-table">
        <thead>
          <tr>
            <th>Pregunta</th>
            <th>Opciones</th>
            <th>Respuesta Correcta</th>
            <th>Puntaje</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {preguntas.map((pregunta) => (
            <tr key={pregunta.id}>
              <td>{pregunta.pregunta}</td>
              <td>{pregunta.opcionesRespuestas}</td>
              <td>{pregunta.respuestaCorrecta}</td>
              <td>{pregunta.puntajePregunta}</td>
              <td>
                <Button
                  onClick={() =>
                    navigate(`/preguntas/edit/${pregunta.id}`)
                  }
                >
                  Editar
                </Button>
                <Button
                  onClick={() => handleDeletePregunta(pregunta.id)}
                  className="danger"
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreguntasPrueba;
