import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CrearPrueba.css";

const CrearPrueba = () => {
  const [formData, setFormData] = useState({
    cursoId: "",
    duracion: 0,
    fechaCreacion: new Date().toISOString().split("T")[0],
  });
  const [preguntas, setPreguntas] = useState([]);
  const [currentPregunta, setCurrentPregunta] = useState({
    pregunta: "",
    opcionesRespuestas: "",
    respuestaCorrecta: "",
    puntajePregunta: 10,
  });
  const [pruebaId, setPruebaId] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      console.log("Obteniendo lista de cursos...");
      const response = await fetch("http://127.0.0.1:8000/api/cursos/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al obtener los cursos:", errorData);
        throw new Error(errorData.detail || "Error al obtener los cursos.");
      }

      const data = await response.json();
      console.log("Cursos obtenidos:", data);
      setCursos(data);
    } catch (err) {
      console.error("Error en fetchCursos:", err.message);
      setError(err.message);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(`Formulario actualizado: ${name} = ${value}`);
  };

  const handlePreguntaChange = (e) => {
    const { name, value } = e.target;
    setCurrentPregunta({ ...currentPregunta, [name]: value });
    console.log(`Pregunta actualizada: ${name} = ${value}`);
  };

  const addPregunta = async () => {
    if (!currentPregunta.pregunta || !currentPregunta.respuestaCorrecta || !currentPregunta.opcionesRespuestas) {
      alert("Por favor completa todos los campos de la pregunta.");
      return;
    }

    if (currentPregunta.opcionesRespuestas.split(";").length < 2) {
      alert("Debe haber al menos dos opciones de respuesta separadas por ';'.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Enviando pregunta al servidor:", currentPregunta);

      const response = await fetch(
        `http://127.0.0.1:8000/api/pruebas/${pruebaId}/add_preguntas/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([currentPregunta]),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al agregar la pregunta:", errorData);
        throw new Error(errorData.detail || "Error al agregar la pregunta.");
      }

      console.log("Pregunta agregada exitosamente.");
      setPreguntas([...preguntas, { ...currentPregunta }]);
      setCurrentPregunta({
        pregunta: "",
        opcionesRespuestas: "",
        respuestaCorrecta: "",
        puntajePregunta: 10,
      });
      alert("Pregunta agregada con éxito.");
    } catch (err) {
      console.error("Error en addPregunta:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrueba = async () => {
    if (!formData.cursoId || !formData.duracion) {
        alert("Por favor completa todos los campos requeridos antes de guardar.");
        return;
    }

    try {
        setIsLoading(true);
        console.log("Creando prueba con datos:", {
            curso: parseInt(formData.cursoId, 10),
            duracion: parseInt(formData.duracion, 10),
            fechaCreacion: formData.fechaCreacion,
            preguntas: [], // Agregar un arreglo vacío de preguntas
        });

        const response = await fetch("http://127.0.0.1:8000/api/pruebas/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                curso: parseInt(formData.cursoId, 10),
                duracion: parseInt(formData.duracion, 10),
                fechaCreacion: formData.fechaCreacion,
                preguntas: [], // Enviar el campo preguntas
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al crear la prueba:", errorData);
            throw new Error(
                errorData.detail || JSON.stringify(errorData) || "Error al crear la prueba."
            );
        }

        const pruebaData = await response.json();
        setPruebaId(pruebaData.id);
        alert("Prueba creada con éxito. Ahora puedes agregar preguntas.");
    } catch (err) {
        console.error("Error en handleSavePrueba:", err.message);
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
};



  return (
    <div className="crear-prueba-container">
      <h2>Crear Prueba</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Paso 1: Crear Prueba */}
      <div className="form-section">
        <h3>Paso 1: Crear Prueba</h3>
        <label htmlFor="cursoId">Seleccionar Curso:</label>
        <select
          id="cursoId"
          name="cursoId"
          value={formData.cursoId}
          onChange={handleFormChange}
          disabled={pruebaId !== null}
        >
          <option value="">Seleccionar un curso</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.titulo}
            </option>
          ))}
        </select>

        <label htmlFor="duracion">Duración (minutos):</label>
        <input
          type="number"
          id="duracion"
          name="duracion"
          value={formData.duracion}
          onChange={handleFormChange}
          disabled={pruebaId !== null}
        />

        <div className="form-actions">
          <button
            className="save-button"
            onClick={handleSavePrueba}
            disabled={isLoading || pruebaId !== null}
          >
            {isLoading ? "Guardando..." : "Crear Prueba"}
          </button>
          <button
            className="cancel-button"
            onClick={() => navigate("/pruebas/list")}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Paso 2: Agregar Preguntas */}
      {pruebaId && (
        <div className="preguntas-section">
          <h3>Paso 2: Agregar Preguntas</h3>
          <input
            type="text"
            name="pregunta"
            placeholder="Escribe la pregunta"
            value={currentPregunta.pregunta}
            onChange={handlePreguntaChange}
          />
          <input
            type="text"
            name="opcionesRespuestas"
            placeholder="Opciones separadas por ';'"
            value={currentPregunta.opcionesRespuestas}
            onChange={handlePreguntaChange}
          />
          <input
            type="text"
            name="respuestaCorrecta"
            placeholder="Respuesta Correcta"
            value={currentPregunta.respuestaCorrecta}
            onChange={handlePreguntaChange}
          />
          <input
            type="number"
            name="puntajePregunta"
            placeholder="Puntaje"
            value={currentPregunta.puntajePregunta}
            onChange={handlePreguntaChange}
          />
          <button className="add-button" onClick={addPregunta}>
            {isLoading ? "Agregando..." : "Agregar Pregunta"}
          </button>
        </div>
      )}

      {/* Lista de Preguntas Agregadas */}
      {pruebaId && (
        <div className="preguntas-list">
          <h3>Preguntas Agregadas</h3>
          {preguntas.length > 0 ? (
            <ul>
              {preguntas.map((pregunta, index) => (
                <li key={index}>
                  <strong>{pregunta.pregunta}</strong>
                  <p>
                    Opciones: {pregunta.opcionesRespuestas.split(";").join(", ")}
                  </p>
                  <p>Respuesta Correcta: {pregunta.respuestaCorrecta}</p>
                  <p>Puntaje: {pregunta.puntajePregunta}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No se han agregado preguntas.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CrearPrueba;
