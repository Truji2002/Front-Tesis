import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdministrarPreguntas = () => {
  const { pruebaId } = useParams();
  const [preguntas, setPreguntas] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPregunta, setCurrentPregunta] = useState(null);
  const [formData, setFormData] = useState({
    pregunta: "",
    opcionesRespuestas: "",
    respuestaCorrecta: "",
    puntajePregunta: 10,
  });

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    
    fetchPreguntas();
  }, [pruebaId]);

  const fetchPreguntas = async () => {
    try {
      if (!pruebaId) {
        throw new Error("ID de prueba no proporcionado.");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/preguntas/?prueba=${pruebaId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cargar las preguntas");
      }

      const data = await response.json();
      
      setPreguntas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDialog = (pregunta = null) => {
    setCurrentPregunta(pregunta);
    setFormData(
      pregunta
        ? {
            pregunta: pregunta.pregunta,
            opcionesRespuestas: pregunta.opcionesRespuestas,
            respuestaCorrecta: pregunta.respuestaCorrecta,
            puntajePregunta: pregunta.puntajePregunta,
          }
        : { pregunta: "", opcionesRespuestas: "", respuestaCorrecta: "", puntajePregunta: 10 }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPregunta(null);
    setFormData({
      pregunta: "",
      opcionesRespuestas: "",
      respuestaCorrecta: "",
      puntajePregunta: 10,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const url = currentPregunta
      ? `http://127.0.0.1:8000/api/preguntas/${currentPregunta.id}/`
      : "http://127.0.0.1:8000/api/preguntas/";
    const method = currentPregunta ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, prueba: pruebaId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar la pregunta");
      }

      fetchPreguntas();
      handleCloseDialog();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta pregunta?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/preguntas/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la pregunta");
      }

      fetchPreguntas();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-preguntas-container">
      <h2>Administrar Preguntas</h2>
      {error && <p className="error-message">{error}</p>}
      <button className="add-button" onClick={() => handleOpenDialog()}>
        Agregar Pregunta
      </button>
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
          {preguntas.length > 0 ? (
            preguntas.map((pregunta) => (
              <tr key={pregunta.id}>
                <td>{pregunta.pregunta}</td>
                <td>{pregunta.opcionesRespuestas.split(";").join(", ")}</td>
                <td>{pregunta.respuestaCorrecta}</td>
                <td>{pregunta.puntajePregunta}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleOpenDialog(pregunta)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(pregunta.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay preguntas disponibles para esta prueba.</td>
            </tr>
          )}
        </tbody>
      </table>

      {openDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>{currentPregunta ? "Editar Pregunta" : "Agregar Pregunta"}</h3>
            <input
              type="text"
              name="pregunta"
              placeholder="Pregunta"
              value={formData.pregunta}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="opcionesRespuestas"
              placeholder="Opciones (separadas por ';')"
              value={formData.opcionesRespuestas}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="respuestaCorrecta"
              placeholder="Respuesta Correcta"
              value={formData.respuestaCorrecta}
              onChange={handleFormChange}
            />
            <input
              type="number"
              name="puntajePregunta"
              placeholder="Puntaje"
              value={formData.puntajePregunta}
              onChange={handleFormChange}
              min="1"
            />
            <div className="dialog-actions">
              <button onClick={handleCloseDialog}>Cancelar</button>
              <button onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministrarPreguntas;
