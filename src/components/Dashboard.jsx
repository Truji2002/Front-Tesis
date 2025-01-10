import React, { useState, useEffect } from "react";
import GeneralMetrics from "./GeneralMetrics";
import axios from "axios";
 
const Dashboard = () => {
  const [generalMetrics, setGeneralMetrics] = useState({});
  const [filteredMetrics, setFilteredMetrics] = useState({});
 
  useEffect(() => {
    // Obtener métricas generales
    axios.get("/api/general-metrics/").then((res) => setGeneralMetrics(res.data));
  }, []);
 
  const fetchFilteredMetrics = (filters) => {
    axios
      .get("/api/filtered-metrics/", { params: filters })
      .then((res) => setFilteredMetrics(res.data));
  };
 
  return (
    <div>
      <GeneralMetrics metrics={generalMetrics} />
      {/* <FilteredMetrics metrics={filteredMetrics} onFilter={fetchFilteredMetrics} /> */}
    </div>
  );
};
 
export default Dashboard;