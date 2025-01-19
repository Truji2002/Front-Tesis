import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Button from "./ui/button/Button";
import Input from "./ui/input/input";
import Label from "./ui/label/label";
import Select from "react-select";
import "../styles/ContractsManagement.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContractsManagement = () => {
  const [contracts, setContracts] = useState({});
  const [courses, setCourses] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cursos: [],
    fechaInicioCapacitacion: "",
    fechaFinCapacitacion: "",
  });
  const { id } = useParams(); // Obtener el ID del instructor desde la URL
  const token = localStorage.getItem("accessToken");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchInstructor = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/instructores/${id}/`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Error al obtener los detalles del instructor.");
      const data = await response.json();
      setInstructor(data);
    } catch (error) {
      console.error("Error fetching instructor details:", error);
      Swal.fire("Error", "No se pudieron cargar los detalles del instructor.", "error");
    }
  };

  const fetchContracts = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/obtener-contrato-por-instructor/?instructor_id=${id}`,
        { headers: getHeaders() }
      );
      if (!response.ok) throw new Error("Error al obtener los contratos.");
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      Swal.fire("Error", "No se pudieron cargar los contratos.", "error");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cursos/`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Error al obtener los cursos.");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      Swal.fire("Error", "No se pudieron cargar los cursos.", "error");
    }
  };

  const checkCourseHasTest = async (cursoId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pruebas/verificar-prueba/?curso_id=${cursoId}`,
        {
          headers: getHeaders(),
        }
      );
      if (!response.ok) throw new Error("Error al verificar si el curso tiene prueba.");
      const data = await response.json();
      return data.tiene_prueba;
    } catch (error) {
      console.error("Error checking course test:", error);
      Swal.fire("Error", "No se pudo verificar si el curso tiene prueba.", "error");
      return false;
    }
  };

  useEffect(() => {
    if (id) {
      fetchInstructor(id);
      fetchContracts(id);
      fetchCourses();
    }
  }, [id]);

  const handleAddContract = () => {
    setFormData({
      cursos: [],
      fechaInicioCapacitacion: "",
      fechaFinCapacitacion: "",
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Confirmación",
      text: "¿Estás seguro de que deseas crear este contrato?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#F44336",
    });

    if (!confirm.isConfirmed) return;

    const contratos = formData.cursos.map((cursoId) => ({
      instructor: id,
      curso: cursoId,
      fechaInicioCapacitacion: formData.fechaInicioCapacitacion,
      fechaFinCapacitacion: formData.fechaFinCapacitacion,
    }));

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/crear-contrato/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ contratos }),
      });

      if (!response.ok) throw new Error("Error al crear los contratos.");

      Swal.fire("Éxito", "Contratos creados con éxito.", "success");
      fetchContracts(id);
      setShowForm(false);
    } catch (error) {
      Swal.fire("Error", "No se pudieron crear los contratos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateContract = async (codigoOrganizacion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/actualizar-contrato/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          codigoOrganizacion,
          activo: false,
        }),
      });

      if (!response.ok) throw new Error("Error al desactivar el contrato.");
      Swal.fire("Éxito", "Contrato desactivado con éxito.", "success");
      fetchContracts(id);
    } catch (error) {
      Swal.fire("Error", "No se pudo desactivar el contrato.", "error");
    }
  };

  const handleCourseSelection = async (selectedOptions) => {
    const cursosSeleccionados = [...formData.cursos];
    for (const option of selectedOptions) {
      const tienePrueba = await checkCourseHasTest(option.value);
      if (!tienePrueba) {
        Swal.fire("Advertencia", `El curso "${option.label}" no tiene prueba asociada.`, "warning");
      } else {
        cursosSeleccionados.push(option.value);
      }
    }

    setFormData({
      ...formData,
      cursos: cursosSeleccionados,
    });
  };

  const courseOptions = courses.map((course) => ({
    value: course.id,
    label: course.titulo,
  }));

  return (
    <div className={`contracts-management-container ${loading ? "loading" : ""}`}>
      <h2>Gestión de Contratos</h2>

      {instructor ? (
        <div className="instructor-details">
          <p>
            <strong>Instructor:</strong> {instructor.first_name} {instructor.last_name}
          </p>
          <p>
            <strong>Empresa:</strong> {instructor.empresa_nombre}
          </p>
        </div>
      ) : (
        <p>Cargando datos del instructor...</p>
      )}

      {!showForm && (
        <div className="actions">
          <Button onClick={handleAddContract}>Crear Contrato</Button>
        </div>
      )}

      {!showForm ? (
        <table className="contracts-table">
          <thead>
            <tr>
              <th>Código Organización</th>
              <th>Cursos</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(contracts).length > 0 ? (
              Object.entries(contracts).map(([codigoOrganizacion, courses]) => (
                <tr key={codigoOrganizacion}>
                  <td>{codigoOrganizacion}</td>
                  <td>
                    <ul>
                      {courses.map((course) => (
                        <li key={course.curso_id}>{course.curso_titulo}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{courses[0]?.fechaInicioCapacitacion || "N/A"}</td>
                  <td>{courses[0]?.fechaFinCapacitacion || "N/A"}</td>
                  <td>{courses.some((course) => course.activo) ? "Activo" : "Inactivo"}</td>

                  <td>
                    {courses.some((course) => course.activo) && (
                      <Button
                        onClick={() => handleDeactivateContract(codigoOrganizacion)}
                        className="danger-desactivar"
                      >
                        Desactivar Contrato
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay contratos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <form className="contract-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <Label htmlFor="cursos">Cursos</Label>
            <Select
              id="cursos"
              isMulti
              options={courseOptions}
              value={courseOptions.filter((opt) => formData.cursos.includes(opt.value))}
              onChange={handleCourseSelection}
              placeholder="Selecciona cursos..."
              className="react-select-container"
              classNamePrefix="react-select"
              required
            />
          </div>
          <div className="form-group">
            <Label htmlFor="fechaInicioCapacitacion">Fecha Inicio</Label>
            <Input
              id="fechaInicioCapacitacion"
              name="fechaInicioCapacitacion"
              type="date"
              value={formData.fechaInicioCapacitacion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fechaInicioCapacitacion: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <Label htmlFor="fechaFinCapacitacion">Fecha Fin</Label>
            <Input
              id="fechaFinCapacitacion"
              name="fechaFinCapacitacion"
              type="date"
              value={formData.fechaFinCapacitacion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fechaFinCapacitacion: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-actions">
            <Button type="submit">Guardar</Button>
            <Button onClick={() => setShowForm(false)} className="secondary">
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContractsManagement;
