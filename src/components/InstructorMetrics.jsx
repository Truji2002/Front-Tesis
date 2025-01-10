import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/InstructorMetrics.css";
 
function InstructorMetrics() {
  const [loading, setLoading] = useState(true);
  const [generalData, setGeneralData] = useState(null);
  const [finalizationData, setFinalizationData] = useState(null);
  const [error, setError] = useState(null);
 
  // Tomar tokens e IDs de localStorage
  const token = localStorage.getItem("accessToken");
  const instructorId = localStorage.getItem("id"); // Asumimos que aquí guardaste el ID del instructor
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { instructor_id: instructorId };
        const headers = { Authorization: `Bearer ${token}` };
 
        const [generalRes, finalizationRes] = await Promise.all([
          axios.get("http://localhost:8000/api/metricas-instructor/", { params, headers }),
          axios.get("http://localhost:8000/api/metricas-instructor-finalizacion/", { params, headers }),
        ]);
 
        setGeneralData(generalRes.data);
        setFinalizationData(finalizationRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching instructor metrics", err);
        setError("Ocurrió un error al cargar las métricas. Ver consola.");
        setLoading(false);
      }
    };
 
    fetchData();
  }, [token, instructorId]);
 
  if (loading) {
    return <div className="loader">Cargando métricas...</div>;
  }
 
  if (error) {
    return <div className="error-message">{error}</div>;
  }
 
  if (!generalData || !finalizationData) {
    return <div className="error-message">No hay datos disponibles.</div>;
  }
 
  // --------------------------------------------------------------------------------
  // Desestructurar métricas principales
  // --------------------------------------------------------------------------------
  const { instructor_metrics, empresa_metrics } = generalData;
  // Ejemplo:
  // instructor_metrics: {
  //   total_estudiantes, total_certificados, total_pruebas, pruebas_aprobadas, ...
  //   tasa_certificacion, tasa_aprobacion
  // }
  // empresa_metrics: {
  //   nombre_empresa, total_instructores, total_estudiantes, ...
  //   tasa_certificacion, tasa_aprobacion
  // }
 
  // --------------------------------------------------------------------------------
  // Preparar datos para gráficas
  // --------------------------------------------------------------------------------
 
  // 1) BarChart comparando Tasa Certificación y Tasa Aprobación (Instructor vs. Empresa)
  const barData = {
    labels: ["Tasa de Certificación (%)", "Tasa de Aprobación (%)"],
    datasets: [
      {
        label: "Instructor",
        backgroundColor: "#4caf50",
        data: [
          instructor_metrics.tasa_certificacion,
          instructor_metrics.tasa_aprobacion,
        ],
      },
      {
        label: "Empresa",
        backgroundColor: "#2196f3",
        data: [
          empresa_metrics.tasa_certificacion,
          empresa_metrics.tasa_aprobacion,
        ],
      },
    ],
  };
 
  // 2) PieChart para ver la relación entre Estudiantes Activos vs. Inactivos (del Instructor)
  //    Se asume que total_estudiantes son todos y que estudiantes_activos están en instructor_metrics.
  const totalEst = instructor_metrics.total_estudiantes;
  const activosEst = instructor_metrics.estudiantes_activos;
  const inactivosEst = totalEst - activosEst < 0 ? 0 : totalEst - activosEst;
 
  const pieData = {
    labels: ["Activos", "Inactivos"],
    datasets: [
      {
        data: [activosEst, inactivosEst],
        backgroundColor: ["#FF6384", "#FFCE56"],
      },
    ],
  };
 
  // Lógica para empresa
const totalEstEmp = empresa_metrics.total_estudiantes;
const activosEstEmp = empresa_metrics.estudiantes_activos;
const inactivosEstEmp = totalEstEmp - activosEstEmp < 0 ? 0 : totalEstEmp - activosEstEmp;
 
const pieDataEmpresa = {
  labels: ["Activos", "Inactivos"],
  datasets: [
    {
      data: [activosEstEmp, inactivosEstEmp],
      backgroundColor: ["#FF6384", "#FFCE56"],
    },
  ],
};
 
  // --------------------------------------------------------------------------------
  // Preparar datos de Finalización (mayor/menor)
  // --------------------------------------------------------------------------------
  // finalizationData: {
  //   "cursos_instructor": {
  //       "curso_mayor_finalizacion": {...},
  //       "curso_menor_finalizacion": {...}
  //   },
  //   "cursos_empresa": {
  //       "curso_mayor_finalizacion": {...},
  //       "curso_menor_finalizacion": {...}
  //   }
  // }
  const { cursos_instructor, cursos_empresa } = finalizationData;
 
  return (
    <div className="metrics-container">
 
      {/* TÍTULO PRINCIPAL */}
      <h1>Métricas del Instructor</h1>
      <p className="subtitle">Instructor: {instructor_metrics.instructor_email}</p>
      <p className="subtitle">Empresa: {empresa_metrics.nombre_empresa}</p>
 
      {/* SECCIÓN DE INDICADORES RÁPIDOS */}
      <div className="cards-container">
        <div className="card">
          <h3>Estudiantes (Instructor)</h3>
          <p>{instructor_metrics.total_estudiantes}</p>
        </div>
        <div className="card">
          <h3>Certificados (Instructor)</h3>
          <p>{instructor_metrics.total_certificados}</p>
        </div>
        <div className="card">
          <h3>Pruebas (Instructor)</h3>
          <p>{instructor_metrics.total_pruebas}</p>
        </div>
        <div className="card">
          <h3>Aprobadas (Instructor)</h3>
          <p>{instructor_metrics.pruebas_aprobadas}</p>
        </div>
      </div>
 
      {/* TARJETAS: MÉTRICAS DE LA EMPRESA */}
      <div className="cards-container">
        <div className="card">
          <h3>Estudiantes (Empresa)</h3>
          <p>{empresa_metrics.total_estudiantes}</p>
        </div>
        <div className="card">
          <h3>Certificados (Empresa)</h3>
          <p>{empresa_metrics.total_certificados}</p>
        </div>
        <div className="card">
          <h3>Pruebas (Empresa)</h3>
          <p>{empresa_metrics.total_pruebas}</p>
        </div>
        <div className="card">
          <h3>Aprobadas (Empresa)</h3>
          <p>{empresa_metrics.pruebas_aprobadas}</p>
        </div>
      </div>
 
      {/* GRÁFICO BARRAS: COMPARA TASAS */}
      <div className="chart-section">
        <h2>Comparativa de Tasas (Instructor vs. Empresa)</h2>
        <Bar data={barData} />
      </div>
 
      {/* GRÁFICO PIE: DISTRIBUCIÓN DE ESTUDIANTES ACTIVOS/INACTIVOS */}
      <div className="chart-section">
        <h2>Estudiantes Activos vs Inactivos (Instructor)</h2>
        <Pie data={pieData} />
      </div>
 
      {/* GRÁFICO PIE: DISTRIBUCIÓN DE ESTUDIANTES ACTIVOS/INACTIVOS */}
      <div className="chart-section">
        <h2>Estudiantes Activos vs Inactivos (Empresa)</h2>
        <Pie data={pieDataEmpresa} />
      </div>
 
      {/* SECCIÓN DE CURSOS (MAYOR/MENOR FINALIZACIÓN) */}
      <div className="finalization-section">
        <h2>Tasa de finalización (INSTRUCTOR)</h2>
        {cursos_instructor.curso_mayor_finalizacion ? (
          <div className="finalization-card">
            <p>
              <strong>Mayor:</strong> {cursos_instructor.curso_mayor_finalizacion.titulo} (
              {cursos_instructor.curso_mayor_finalizacion.tasa_finalizacion}%)
            </p>
            <p>
              <strong>Menor:</strong> {cursos_instructor.curso_menor_finalizacion.titulo} (
              {cursos_instructor.curso_menor_finalizacion.tasa_finalizacion}%)
            </p>
          </div>
        ) : (
          <p>No hay datos de finalización para este instructor</p>
        )}
 
        <h2>Tasa de finalización (EMPRESA)</h2>
        {cursos_empresa.curso_mayor_finalizacion ? (
          <div className="finalization-card">
            <p>
              <strong>Mayor:</strong> {cursos_empresa.curso_mayor_finalizacion.titulo} (
              {cursos_empresa.curso_mayor_finalizacion.tasa_finalizacion}%)
            </p>
            <p>
              <strong>Menor:</strong> {cursos_empresa.curso_menor_finalizacion.titulo} (
              {cursos_empresa.curso_menor_finalizacion.tasa_finalizacion}%)
            </p>
          </div>
        ) : (
          <p>No hay datos de finalización para la empresa</p>
        )}
      </div>
    </div>
  );
}
 
export default InstructorMetrics;