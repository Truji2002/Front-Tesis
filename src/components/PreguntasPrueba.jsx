import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PreguntasPrueba = () => {
  const { pruebaId } = useParams();
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    
    fetchPreguntas();
  }, [pruebaId]);

  const fetchPreguntas = async () => {
    try {
      if (!pruebaId) {
        throw new Error("ID de prueba no proporcionado.");
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/preguntas/por-prueba/`,
        {
          params: { prueba_id: pruebaId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPreguntas(response.data);
    } catch (err) {
      console.error("Error al cargar las preguntas:", err);
      setError(
        err.response?.data?.error || "No se pudieron cargar las preguntas. Inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando preguntas...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="preguntas-container">
      <h2>Preguntas de la Prueba</h2>
      {preguntas.length > 0 ? (
        preguntas.map((pregunta) => (
          <div key={pregunta.id} className="pregunta-card">
            <h3>{pregunta.pregunta}</h3>
            <ul>
              {pregunta.opcionesRespuestas.split(";").map((opcion, index) => (
                <li key={index}>{opcion.trim()}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No hay preguntas disponibles para esta prueba.</p>
      )}
    </div>
  );
};

export default PreguntasPrueba;
