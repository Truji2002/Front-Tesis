// src/components/PruebaForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PruebaForm = () => {
  const { id } = useParams(); // undefined si no viene param
  const isEditMode = !!id;    // true si estamos editando
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [pruebaData, setPruebaData] = useState({
    curso: null,        // o el ID si quieres asignarlo
    duracion: "",
    fechaCreacion: "",
  });

  const [error, setError] = useState("");

  // Cargar datos si es modo editar
  useEffect(() => {
    if (isEditMode) {
      const fetchPrueba = async () => {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/pruebas/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
          }
          const data = await res.json();
          setPruebaData(data);
        } catch (err) {
          console.error("Error al cargar la prueba:", err);
          setError(err.message);
        }
      };
      fetchPrueba();
    }
  }, [id, isEditMode, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPruebaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "http://127.0.0.1:8000/api/pruebas/";
      let method = "POST";

      if (isEditMode) {
        url = `http://127.0.0.1:8000/api/pruebas/${id}/`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pruebaData),
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      alert(isEditMode ? "Prueba actualizada con éxito" : "Prueba creada con éxito");
      navigate("/pruebas"); // Regresa a la lista de pruebas
    } catch (err) {
      console.error("Error al guardar la prueba:", err);
      setError("Error al guardar la prueba. Revisa la consola para más detalles.");
    }
  };

  return (
    <div>
      <h2>{isEditMode ? "Editar" : "Crear"} Prueba</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Duración:
          <input
            type="number"
            name="duracion"
            value={pruebaData.duracion}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Fecha de creación:
          <input
            type="date"
            name="fechaCreacion"
            value={pruebaData.fechaCreacion}
            onChange={handleChange}
            required
          />
        </label>

        {/* 
          Si manejas "curso", podrías tener un select con la lista de cursos 
          o un input para poner el ID. Ajusta según tu lógica.
        */}

        <button type="button" onClick={() => navigate("/pruebas")}>
          Cancelar
        </button>
        <button type="submit">
          {isEditMode ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
};

export default PruebaForm;
