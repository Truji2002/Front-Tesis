import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // <-- Importa useNavigate
import axios from "axios";
import "../styles/ResponderPrueba.css";

const ResponderPrueba = () => {
  const { pruebaId } = useParams();
  const navigate = useNavigate(); // <-- Iniciamos el hook de navegación

  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/api/preguntas/por-prueba/?prueba_id=${pruebaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(response.data)) {
          // Inicializar respuestas con null para cada pregunta
          const initialRespuestas = {};
          response.data.forEach((pregunta) => {
            initialRespuestas[pregunta.id] = null;
          });
          setPreguntas(response.data);
          setRespuestas(initialRespuestas);
        } else {
          setPreguntas([]);
        }
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
        setPreguntas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPreguntas();
  }, [pruebaId]);

  const manejarCambio = (preguntaId, opcionSeleccionada) => {
    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      [preguntaId]: opcionSeleccionada,
    }));
  };

  const enviarRespuestas = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/responder-prueba/",
        {
          prueba_id: pruebaId,
          respuestas,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResultado(response.data.calificacion);
      setMensaje(response.data.mensaje);
    } catch (error) {
      console.error("Error al enviar las respuestas:", error);
      setMensaje("Hubo un error al enviar la prueba.");
    }
  };

  if (loading) {
    return <p>Cargando preguntas...</p>;
  }

  return (
    <div className="responder-prueba-container">
      <h1>Responder Prueba</h1>
      {preguntas.length > 0 ? (
        preguntas.map((pregunta) => {
          const opciones = pregunta.opcionesRespuestas
            .split(",")
            .map((opcion) => opcion.trim());

          return (
            <div key={pregunta.id} className="pregunta-card">
              <h3>{pregunta.pregunta}</h3>
              <div className="opciones">
                {opciones.map((opcion) => (
                  <label key={`${pregunta.id}-${opcion}`} className="opcion-label">
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      value={opcion}
                      checked={respuestas[pregunta.id] === opcion}
                      onChange={() => manejarCambio(pregunta.id, opcion)}
                    />
                    {opcion}
                  </label>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p>No hay preguntas disponibles para esta prueba.</p>
      )}

      <button onClick={enviarRespuestas} className="enviar-btn">
        Enviar
      </button>

      {/* Botón para regresar al curso */}
      <button 
        className="regresar-btn" 
        style={{ marginLeft: "10px" }}
        onClick={() => navigate("/cursos")} // <- Ajusta la ruta según necesites
      >
        Regresar al Curso
      </button>

      {resultado !== null && (
        <div className="resultado">
          <h2>Resultado: {resultado}</h2>
          <p>{mensaje}</p>
        </div>
      )}
    </div>
  );
};

export default ResponderPrueba;
