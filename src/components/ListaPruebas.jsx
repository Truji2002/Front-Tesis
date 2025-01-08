import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListaPruebas.css"; // Ajusta la ruta según la ubicación real del archivo CSS
import Button from "./ui/button/Button"; // Asegúrate de que el componente Button esté correctamente importado

const ListaPruebas = () => {
  const [pruebas, setPruebas] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPruebas = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/pruebas/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Pruebas obtenidas:", data); // Aquí verifica que los datos son correctos
        setPruebas(data);
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar las pruebas:", err);
      }
    };
    

    fetchPruebas();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta prueba?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/pruebas/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        setPruebas(pruebas.filter((prueba) => prueba.id !== id));
        alert("Prueba eliminada con éxito.");
      } catch (err) {
        console.error("Error al eliminar la prueba:", err);
        alert("Error al eliminar la prueba. Revisa la consola para más detalles.");
      }
    }
  };

  return (
    <div className="lista-pruebas-container">
      <h2 className="title">Lista de Pruebas</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="cursos-table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pruebas.length > 0 ? (
            pruebas.map((prueba) => (
              <tr key={prueba.id}>
                <td>{prueba.curso_titulo || "Curso no asignado"}</td>
                <td className="acciones">
                  <Button onClick={() => navigate(`/pruebas/edit/${prueba.id}`)}>
                    Editar Prueba
                  </Button>
                  <Button onClick={() => handleDelete(prueba.id)}>
                    Eliminar Prueba
                  </Button>
                  {/* Redirige a la nueva ventana de administrar preguntas */}
                  <Button onClick={() => navigate(`/preguntas/${prueba.id}`)}>
  Administrar Preguntas
</Button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="no-data">
                No hay pruebas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaPruebas;