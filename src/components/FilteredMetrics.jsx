import React, { useState } from "react";
import { Line as LineChart } from "react-chartjs-2"; // Renombramos Line para evitar conflicto
import "../styles/FilteredMetrics.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const FilteredMetrics = ({ metrics, onFilter }) => {
  const [filters, setFilters] = useState({ empresa_id: "", curso_id: "" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  // Datos para gráfico
  const lineData = {
    labels: ["Total Estudiantes", "Certificados", "Pruebas Aprobadas"],
    datasets: [
      {
        label: "Métricas Específicas",
        data: [
          metrics?.total_estudiantes || 0,
          metrics?.total_certificados || 0,
          metrics?.pruebas_aprobadas || 0,
        ],
        borderColor: "#03A9F4",
        backgroundColor: "rgba(3, 169, 244, 0.5)",
        fill: true,
      },
    ],
  };

  return (
    <div className="filtered-metrics-container">
      <h1>Métricas Filtradas</h1>
      <div className="filters">
        <input
          type="text"
          name="empresa_id"
          placeholder="ID Empresa"
          value={filters.empresa_id}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="curso_id"
          placeholder="ID Curso"
          value={filters.curso_id}
          onChange={handleFilterChange}
        />
        <button onClick={applyFilters}>Aplicar Filtros</button>
      </div>
      <div className="charts">
        <div className="chart">
          <h3>Métricas Específicas</h3>
          <LineChart data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default FilteredMetrics;
