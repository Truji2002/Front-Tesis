import React, { useState, useEffect } from "react";
import "../styles/CrearPrueba.css";

const CrearPrueba = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [duracion, setDuracion] = useState("");
  const [preguntas, setPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState({
    pregunta: "",
    opciones: ["", "", "", ""],
    respuestaCorrecta: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetch("http://127.0.0.1:8000/api/cursos/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch((err) => console.error("Error al cargar los cursos:", err));
  }, []);

  const handleAgregarPregunta = () => {
    if (!nuevaPregunta.pregunta || !nuevaPregunta.respuestaCorrecta) {
      alert("Por favor, completa todos los campos de la pregunta.");
      return;
    }
    setPreguntas([...preguntas, nuevaPregunta]);
    setNuevaPregunta({
      pregunta: "",
      opciones: ["", "", "", ""],
      respuestaCorrecta: "",
    });
  };

  const handleEliminarPregunta = (index) => {
    setPreguntas(preguntas.filter((_, i) => i !== index));
  };

  const handleCrearPrueba = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (!cursoSeleccionado || !duracion || preguntas.length === 0) {
      alert(
        "Por favor, completa todos los campos y agrega al menos una pregunta."
      );
      return;
    }

    const data = {
      curso: cursoSeleccionado,
      duracion: parseInt(duracion, 10),
      estaAprobado: false,
      calificacion: 0,
      fechaEvaluacion: new Date().toISOString().split("T")[0],
      preguntas: preguntas.map((p) => ({
        pregunta: p.pregunta,
        opcionesRespuestas: p.opciones.join(";"),
        respuestaCorrecta: p.respuestaCorrecta,
        puntajePregunta: 10,
      })),
    };

    fetch("http://127.0.0.1:8000/api/pruebas/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.curso || "Error al crear la prueba");
          });
        }
        return res.json();
      })
      .then((data) => {
        alert("Prueba creada con éxito.");
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
        console.error("Error al crear la prueba:", err);
      });
  };

  return (
    <div className="crear-prueba-container">
      <h2>Crear Prueba</h2>
      <form onSubmit={handleCrearPrueba} className="crear-prueba-form">
        <div className="form-group">
          <label htmlFor="curso">Seleccionar Curso:</label>
          <select
            id="curso"
            value={cursoSeleccionado}
            onChange={(e) => setCursoSeleccionado(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.titulo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="duracion">Duración (en minutos):</label>
          <input
            type="number"
            id="duracion"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
          />
        </div>
        <div className="form-group">
          <h3>Agregar Pregunta</h3>
          <input
            type="text"
            placeholder="Escribe tu pregunta aquí"
            value={nuevaPregunta.pregunta}
            onChange={(e) =>
              setNuevaPregunta({ ...nuevaPregunta, pregunta: e.target.value })
            }
          />
          {nuevaPregunta.opciones.map((opcion, index) => (
            <div key={index} className="form-group-opciones">
              <input
                type="text"
                placeholder={`Opción ${index + 1}`}
                value={opcion}
                onChange={(e) => {
                  const nuevasOpciones = [...nuevaPregunta.opciones];
                  nuevasOpciones[index] = e.target.value;
                  setNuevaPregunta({ ...nuevaPregunta, opciones: nuevasOpciones });
                }}
              />
            </div>
          ))}
          <input
            type="text"
            placeholder="Respuesta Correcta"
            value={nuevaPregunta.respuestaCorrecta}
            onChange={(e) =>
              setNuevaPregunta({
                ...nuevaPregunta,
                respuestaCorrecta: e.target.value,
              })
            }
          />
          <button
            type="button"
            className="btn-agregar-pregunta"
            onClick={handleAgregarPregunta}
          >
            Agregar Pregunta
          </button>
        </div>
        <div className="preguntas-lista">
          <h3>Preguntas Agregadas</h3>
          {preguntas.length === 0 ? (
            <p>No se han agregado preguntas aún.</p>
          ) : (
            preguntas.map((pregunta, index) => (
              <div key={index} className="pregunta-item">
                <p>{pregunta.pregunta}</p>
                <button
                  type="button"
                  className="btn-eliminar-pregunta"
                  onClick={() => handleEliminarPregunta(index)}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
        <button type="submit" className="btn-crear-prueba">
          Crear Prueba
        </button>
      </form>
    </div>
  );
};

export default CrearPrueba;
