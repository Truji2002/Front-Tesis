import React, { useState, useEffect } from "react";
import { Bar as BarChart, Pie as PieChart } from "react-chartjs-2";
import "../styles/GeneralMetrics.css";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes necesarios para Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const GeneralMetrics = () => {
  const [metrics, setMetrics] = useState(null); // Estado para almacenar las métricas
  const [finalizationData, setFinalizationData] = useState(null); // Estado para tasa de finalización
  const [empresas, setEmpresas] = useState([]); // Lista de empresas
  const [cursos, setCursos] = useState([]); // Lista de cursos
  const [filters, setFilters] = useState({ empresa: "", curso: "" }); // Filtros seleccionados
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Obtener el token desde localStorage
  const token = localStorage.getItem("accessToken");

  // Cargar empresas y cursos
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [empresasResponse, cursosResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/empresas/", { headers }),
          axios.get("http://localhost:8000/api/cursos/", { headers }),
        ]);

        setEmpresas(empresasResponse.data);
        setCursos(cursosResponse.data);
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };

    fetchOptions();
  }, [token]);

  // Cargar métricas
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Añadir filtros a la solicitud
        const params = {};
        if (filters.empresa) params.empresa_id = filters.empresa;
        if (filters.curso) params.curso_id = filters.curso;

        const [metricsResponse, finalizationResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/metricas-general/", { headers, params }),
          axios.get("http://localhost:8000/api/cursos-finalizacion/", { headers, params }),
        ]);

        setMetrics(metricsResponse.data);
        setFinalizationData(finalizationResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [token, filters]); // Dependencia en filtros para recargar métricas

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Mostrar estado de carga o errores
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Datos para gráficos
  const barData = {
    labels: ["Estudiantes", "Instructores", "Empresas", "Cursos"],
    datasets: [
      {
        label: "Distribución",
        data: [
          metrics?.total_estudiantes || 0,
          metrics?.total_instructores || 0,
          metrics?.total_empresas || 0,
          metrics?.total_cursos || 0,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#E91E63"],
      },
    ],
  };
  const barOptions = {
    responsive: true,
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
        text: "Distribución de Estudiantes, Instructores, Empresas y Cursos",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#333",
      },
    },
  };

  const pieData = {
    labels: ["Certificados Emitidos", "Pruebas Aprobadas"],
    datasets: [
      {
        data: [
          metrics?.total_certificados || 0,
          metrics?.pruebas_aprobadas || 0,
        ],
        backgroundColor: ["#FF5722", "#3F51B5"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
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
        text: "Comparación: Certificados Emitidos vs Pruebas Aprobadas",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#333",
      },
    },
  };

  const finalizationBarData = {
    labels: ["Mayor Finalización", "Menor Finalización"],
    datasets: [
      {
        label: "Tasa de Finalización (%)",
        data: [
          finalizationData?.curso_mayor_finalizacion?.tasa_finalizacion || 0,
          finalizationData?.curso_menor_finalizacion?.tasa_finalizacion || 0,
        ],
        backgroundColor: ["#42A5F5", "#FFA726"],
      },
    ],
  };

  const finalizationBarOptions = {
    responsive: true,
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
        text: "Comparación de Tasa de Finalización entre Cursos",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#333",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Tasa (%)",
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
      },
      x: {
        title: {
          display: true,
          text: "Cursos",
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
      },
    },
  };

  const showPieChart =
    (metrics?.total_certificados || 0) > 0 || (metrics?.pruebas_aprobadas || 0) > 0;

  return (
    <div className="general-metrics-container">
      <h1>Métricas Generales</h1>

      {/* Combobox de filtros */}
      <div className="filters-container">
        <select
          name="empresa"
          value={filters.empresa}
          onChange={handleFilterChange}
        >
          <option value="">Todas las Empresas</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nombre}
            </option>
          ))}
        </select>

        <select
          name="curso"
          value={filters.curso}
          onChange={handleFilterChange}
        >
          <option value="">Todos los Cursos</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.titulo}
            </option>
          ))}
        </select>
      </div>

      <div className="metrics-summary">
        <div className="metric">
          <h2>Total Estudiantes</h2>
          <p>{metrics?.total_estudiantes || 0}</p>
        </div>
        <div className="metric">
          <h2>Total Instructores</h2>
          <p>{metrics?.total_instructores || 0}</p>
        </div>
        <div className="metric">
          <h2>Total Empresas</h2>
          <p>{metrics?.total_empresas || 0}</p>
        </div>
        <div className="metric">
          <h2>Total Cursos</h2>
          <p>{metrics?.total_cursos || 0}</p>
        </div>
        <div className="metric">
          <h2>Estudiantes Activos</h2>
          <p>{metrics?.estudiantes_activos || 0}</p>
        </div>
        <div className="metric">
          <h2>Instructores Activos</h2>
          <p>{metrics?.instructores_activos || 0}</p>
        </div>
        <div className="metric">
          <h2>Tasa de Certificación</h2>
          <p>{metrics?.tasa_certificacion || 0}%</p>
        </div>
        <div className="metric">
          <h2>Tasa de Aprobación</h2>
          <p>{metrics?.tasa_aprobacion || 0}%</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h3>Distribución de Datos</h3>
          <BarChart data={barData} options={barOptions} />
        </div>

        <div className="chart-section">
          <h3>Certificados vs. Pruebas Aprobadas</h3>
          {showPieChart ? (
            <PieChart data={pieData} options={pieOptions} />
          ) : (
            <p>No hay datos disponibles para Certificados y Pruebas Aprobadas</p>
          )}
        </div>

        <div className="chart-section">
          <h3>Tasa de Finalización</h3>
          <BarChart data={finalizationBarData} options={finalizationBarOptions} />
        </div>
      </div>
    </div>
  );
};

export default GeneralMetrics;
