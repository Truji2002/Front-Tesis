// src/components/PreguntaForm.jsx
import React, { useState, useEffect } from "react";

const PreguntaForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: null,
    pregunta: "",
    opcionesRespuestas: "",
    respuestaCorrecta: "",
    puntajePregunta: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: null,
        pregunta: "",
        opcionesRespuestas: "",
        respuestaCorrecta: "",
        puntajePregunta: 0,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Solo llamamos a onSave con los datos
    onSave(formData);
  };

  return (
    <div className="dialog">
      <h3>{formData.id ? "Editar Pregunta" : "Agregar Pregunta"}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Pregunta:
          <input
            type="text"
            name="pregunta"
            value={formData.pregunta}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Opciones (separadas por ";"):
          <input
            type="text"
            name="opcionesRespuestas"
            value={formData.opcionesRespuestas}
            onChange={handleChange}
          />
        </label>
        <label>
          Respuesta Correcta:
          <input
            type="text"
            name="respuestaCorrecta"
            value={formData.respuestaCorrecta}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Puntaje:
          <input
            type="number"
            name="puntajePregunta"
            value={formData.puntajePregunta}
            onChange={handleChange}
            required
          />
        </label>

        <div className="dialog-actions">
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default PreguntaForm;
