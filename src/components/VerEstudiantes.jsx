import React, { useState, useEffect } from 'react';
import '../styles/VerEstudiantes.css';
import Button from './ui/button/button';
import { showAlert } from './alerts';

const VerEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cursos, setCursos] = useState({});

  const token = localStorage.getItem('accessToken');
  const codigoOrganizacion = localStorage.getItem('codigoOrganizacion');

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const fetchCursos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/cursos/', {
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error('Error al obtener los cursos.');

      const cursosData = await response.json();
      const cursosMap = {};
      cursosData.forEach((curso) => {
        cursosMap[curso.id] = {
          titulo: curso.titulo,
          simulacion: curso.simulacion,
        };
      });

      setCursos(cursosMap);
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la información de los cursos.', 'error');
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/estudiante-codigoOrganizacion/?codigoOrganizacion=${codigoOrganizacion}`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) throw new Error('Error al obtener los estudiantes.');

      const estudiantesData = await response.json();

      const progresoResponse = await fetch('http://127.0.0.1:8000/api/progreso/', {
        headers: getHeaders(),
      });

      const progresoData = await progresoResponse.json();

      const pruebaResponse = await fetch('http://127.0.0.1:8000/api/estudiantePrueba/', {
        headers: getHeaders(),
      });

      const pruebaData = await pruebaResponse.json();

      const estudiantesConInfo = estudiantesData.map((estudiante) => {
        const progresoEstudiante = progresoData.filter(
          (progreso) => progreso.estudiante === estudiante.id
        );

        const pruebasEstudiante = pruebaData.filter(
          (prueba) => prueba.estudiante === estudiante.id
        );

        return {
          ...estudiante,
          progreso: progresoEstudiante.map((progreso) => ({
            ...progreso,
            cursoTitulo: cursos[progreso.curso]?.titulo || 'N/A',
            cursoSimulacion: cursos[progreso.curso]?.simulacion || false,
          })),
          pruebas: pruebasEstudiante,
        };
      });

      setEstudiantes(estudiantesConInfo);
      setFilteredEstudiantes(estudiantesConInfo);
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la información de los estudiantes.', 'error');
    }
  };

  useEffect(() => {
    fetchCursos(); // Cargar los cursos antes de los estudiantes
  }, []);

  useEffect(() => {
    if (Object.keys(cursos).length > 0) {
      fetchEstudiantes();
    }
  }, [cursos]);

  const handleBusqueda = (value) => {
    setBusqueda(value);

    const filtered = estudiantes.filter(
      (estudiante) =>
        estudiante.first_name.toLowerCase().includes(value.toLowerCase()) ||
        estudiante.email.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredEstudiantes(filtered);
  };

  return (
    <div className="ver-estudiantes-container">
      <h2>Lista de Estudiantes</h2>

      <div className="filters">
        <div className="filter">
          <label htmlFor="busqueda">Buscar por Nombre o Correo:</label>
          <input
            id="busqueda"
            type="text"
            value={busqueda}
            onChange={(e) => handleBusqueda(e.target.value)}
            placeholder="Buscar..."
            className="search-input"
          />
        </div>
      </div>

      <table className="estudiantes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Curso</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Porcentaje Completado</th>
            <th>Contenido Completado</th>
            <th>Simulación</th>
            <th>Simulación Completada</th>
            <th>Prueba Aprobada</th>
            <th>Certificado</th>
          </tr>
        </thead>
        <tbody>
          {filteredEstudiantes.length > 0 ? (
            filteredEstudiantes.map((estudiante) =>
              estudiante.progreso.map((progreso) => (
                <tr key={`${estudiante.id}-${progreso.id}`}>
                  <td>
                    {estudiante.first_name} {estudiante.last_name}
                  </td>
                  <td>{estudiante.email}</td>
                  <td>{progreso.cursoTitulo}</td>
                  <td>{progreso.fechaInicioCurso || 'N/A'}</td>
                  <td>{progreso.fechaFinCurso || 'N/A'}</td>
                  <td>{progreso.porcentajeCompletado.toFixed(2) || 0}%</td>
                  <td>{progreso.contenidoCompletado ? 'Sí' : 'No'}</td>
                  <td>{progreso.cursoSimulacion ? 'Sí' : 'No'}</td>
                  <td>
                    {progreso.simulacionCompletada !== null
                      ? progreso.simulacionCompletada
                        ? 'Sí'
                        : 'No'
                      : 'N/A'}
                  </td>
                  <td>
                    {estudiante.pruebas.some((prueba) => prueba.estaAprobado) ? 'Sí' : 'No'}
                  </td>
                  <td>
                    {progreso.completado && (
                        <Button
                        className="success"
                        onClick={async () => {
                            try {
                            const response = await fetch(
                                `http://127.0.0.1:8000/api/certificado/?curso_id=${progreso.curso}&estudiante_id=${estudiante.id}`,
                                {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                                }
                            );

                            if (!response.ok) {
                                throw new Error('No se pudo obtener el certificado.');
                            }

                            // Obtener el PDF como blob
                            const blob = await response.blob();

                            // Crear un enlace temporal para descargar/abrir el archivo
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `Certificado_Curso_${progreso.curso}_${estudiante.first_name}.pdf`;
                            a.target = '_blank'; // Abrir en una nueva pestaña
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                            } catch (error) {
                            console.error('Error al descargar el certificado:', error);
                            showAlert('Error', 'No se pudo descargar el certificado.', 'error');
                            }
                        }}
                        >
                        Ver Certificado
                        </Button>
                    )}
                    </td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="11">No se encontraron estudiantes.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerEstudiantes;