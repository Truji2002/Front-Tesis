import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditarPregunta = () => {
  const { id } = useParams(); // Obtiene el ID de la pregunta desde la URL
  const [pregunta, setPregunta] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/preguntas/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setPregunta(data);
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar la pregunta:", err);
      }
    };

    fetchPregunta();
  }, [id, token]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/preguntas/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pregunta),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      alert("Pregunta actualizada con éxito.");
    } catch (err) {
      alert("Error al actualizar la pregunta.");
      console.error("Error al guardar la pregunta:", err);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!pregunta) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Editar Pregunta</h2>
      <input
        type="text"
        value={pregunta.pregunta}
        onChange={(e) => setPregunta({ ...pregunta, pregunta: e.target.value })}
      />
      <textarea
        value={pregunta.opcionesRespuestas}
        onChange={(e) => setPregunta({ ...pregunta, opcionesRespuestas: e.target.value })}
      />
      <input
        type="text"
        value={pregunta.respuestaCorrecta}
        onChange={(e) => setPregunta({ ...pregunta, respuestaCorrecta: e.target.value })}
      />
      <button onClick={handleSave}>Guardar</button>
    </div>
  );
};

export default EditarPregunta;