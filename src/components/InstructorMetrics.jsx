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

  // Obtener tokens e IDs de localStorage
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

  // Desestructurar métricas principales
  const { instructor_metrics, empresa_metrics } = generalData;

  // Preparar datos para gráficas

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

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permitir control de tamaño vía CSS
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Comparativa de Tasas (Instructor vs. Empresa)",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#333",
      },
    },
  };

  // 2) PieChart para Estudiantes Activos vs. Inactivos (Instructor)
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

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permitir control de tamaño vía CSS
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Estudiantes Activos vs Inactivos (Instructor)",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#333",
      },
    },
  };

  // 3) PieChart para Estudiantes Activos vs. Inactivos (Empresa)
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

  const pieOptionsEmpresa = {
    responsive: true,
    maintainAspectRatio: false, // Permitir control de tamaño vía CSS
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Estudiantes Activos vs Inactivos (Empresa)",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#333",
      },
    },
  };

  // Preparar datos de Finalización (mayor/menor)
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

      {/* SECCIÓN DE GRÁFICOS */}
      <div className="charts-container">
        {/* GRÁFICO BARRAS: COMPARA TASAS */}
        <div className="chart-section">
          <Bar data={barData} options={barOptions} />
        </div>

        {/* GRÁFICO PIE: DISTRIBUCIÓN DE ESTUDIANTES ACTIVOS/INACTIVOS (Instructor) */}
        <div className="chart-section">
          <Pie data={pieData} options={pieOptions} />
        </div>

        {/* GRÁFICO PIE: DISTRIBUCIÓN DE ESTUDIANTES ACTIVOS/INACTIVOS (Empresa) */}
        <div className="chart-section">
          <Pie data={pieDataEmpresa} options={pieOptionsEmpresa} />
        </div>
      </div>

              {/* SECCIÓN DE CURSOS (MAYOR/MENOR FINALIZACIÓN) */}
        <div className="finalization-section">
          <h2>Tasa de finalización (INSTRUCTOR)</h2>
          {cursos_instructor.curso_mayor_finalizacion ? (
            <div className="finalization-card">
              <p>
                <strong>Mayor:</strong> {cursos_instructor.curso_mayor_finalizacion?.titulo || 'Sin título'} (
                {cursos_instructor.curso_mayor_finalizacion?.tasa_finalizacion || 0}%)
              </p>
              <p>
                <strong>Menor:</strong> {cursos_instructor.curso_menor_finalizacion?.titulo || 'Sin título'} (
                {cursos_instructor.curso_menor_finalizacion?.tasa_finalizacion || 0}%)
              </p>
            </div>
          ) : (
            <p>No hay datos de finalización para este instructor</p>
          )}

          <h2>Tasa de finalización (EMPRESA)</h2>
          {cursos_empresa.curso_mayor_finalizacion ? (
            <div className="finalization-card">
              <p>
                <strong>Mayor:</strong> {cursos_empresa.curso_mayor_finalizacion?.titulo || 'Sin título'} (
                {cursos_empresa.curso_mayor_finalizacion?.tasa_finalizacion || 0}%)
              </p>
              <p>
                <strong>Menor:</strong> {cursos_empresa.curso_menor_finalizacion?.titulo || 'Sin título'} (
                {cursos_empresa.curso_menor_finalizacion?.tasa_finalizacion || 0}%)
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
