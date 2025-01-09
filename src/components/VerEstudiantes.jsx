import React, { useState, useEffect } from 'react';
import '../styles/VerEstudiantes.css';
import Button from './ui/button/button';
import { showAlert } from './alerts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VerEstudiantes = () => {
  const [contratos, setContratos] = useState({});        // Objeto con la forma { "URB-5RXSY": [{...}, {...}], "MAR-F26SH": [{...}] }
  const [estudiantes, setEstudiantes] = useState([]);    // Array de todos los estudiantes
  const [progreso, setProgreso] = useState([]);          // Array con los registros de progreso
  const [pruebas, setPruebas] = useState([]);            // Array con las pruebas
  const [courses, setCourses] = useState({});            // Diccionario de cursos, p.ej. { 1: {...}, 2: {...} }

  // Filtros
  const [busqueda, setBusqueda] = useState('');          
  const [codigoFiltro, setCodigoFiltro] = useState('');  
  const [activoFiltro, setActivoFiltro] = useState('');  

  const token = localStorage.getItem('accessToken');
  const instructorId = localStorage.getItem('id');

  // -----------------------------------------------------
  // Función para devolver headers con token
  // -----------------------------------------------------
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  // -----------------------------------------------------
  // 1. FETCH CONTRATOS POR INSTRUCTOR
  // -----------------------------------------------------
  const fetchContratos = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/obtener-contrato-por-instructor/?instructor_id=${instructorId}`,
        { headers: getHeaders() }
      );
      if (!response.ok) {
        throw new Error('Error al obtener los contratos.');
      }
      const data = await response.json();
      setContratos(data);
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la información de los contratos.', 'error');
      console.error(error);
    }
  };

  // -----------------------------------------------------
  // 2. FETCH ESTUDIANTES
  // -----------------------------------------------------
  const fetchEstudiantes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/estudiantes/`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener los estudiantes.');
      }
      const data = await response.json();
      setEstudiantes(data);
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la información de los estudiantes.', 'error');
      console.error(error);
    }
  };

  // -----------------------------------------------------
  // 3. FETCH PROGRESO
  // -----------------------------------------------------
  const fetchProgreso = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/progreso/`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener el progreso.');
      }
      const data = await response.json();
      setProgreso(data);
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la información de progreso.', 'error');
      console.error(error);
    }
  };

  // -----------------------------------------------------
  // 4. FETCH PRUEBAS
  // -----------------------------------------------------
  const fetchPruebas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/estudiantePrueba/`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener las pruebas de estudiantes.');
      }
      const data = await response.json();
      setPruebas(data);
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la información de las pruebas.', 'error');
      console.error(error);
    }
  };

  // -----------------------------------------------------
  // 5. FETCH CURSOS (para saber si tienen simulación o no)
  // -----------------------------------------------------
  const fetchCursos = async () => {
    try {
      // Asumiendo que este endpoint devuelve algo como:
      // [ {id: 1, titulo: 'Capacitación', simulacion: true, ... }, {id: 2, ...}, ... ]
      const response = await fetch(`${API_BASE_URL}/api/cursos/`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener los cursos.');
      }
      const data = await response.json();

      // Transformar el array en objeto { [idCurso]: { ...datosCurso } }
      const coursesObj = data.reduce((acc, curso) => {
        acc[curso.id] = curso;
        return acc;
      }, {});
      setCourses(coursesObj);
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la información de los cursos.', 'error');
      console.error(error);
    }
  };

  // -----------------------------------------------------
  // useEffect para cargar toda la data al inicio
  // -----------------------------------------------------
  useEffect(() => {
    fetchContratos();
    fetchEstudiantes();
    fetchProgreso();
    fetchPruebas();
    fetchCursos();   // <-- Importante para poder sacar el campo de simulación
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------
  // Manejo de filtros
  // -----------------------------------------------------
  const handleBusqueda = (value) => {
    setBusqueda(value);
  };

  const handleCodigoFiltro = (value) => {
    setCodigoFiltro(value);
  };

  const handleActivoFiltro = (value) => {
    setActivoFiltro(value);
  };

  // -----------------------------------------------------
  // Función para obtener todos los registros
  // en la tabla con base en los filtros
  // -----------------------------------------------------
  const getFilasTabla = () => {
    const filas = [];

    // Recorremos cada key de "contratos", que es un código de organización
    Object.keys(contratos).forEach((codOrg) => {
      // Filtrar si el usuario eligió un "codigoFiltro" y no coincide
      if (codigoFiltro && codigoFiltro !== codOrg) {
        return; // Skip
      }

      // Para cada contrato de esa organización
      contratos[codOrg].forEach((contrato) => {
        // Filtrar por contrato activo/inactivo
        // contrato.activo es un boolean
        // activoFiltro puede ser 'activo', 'inactivo' o ''
        if (activoFiltro) {
          if (activoFiltro === 'activo' && !contrato.activo) return;
          if (activoFiltro === 'inactivo' && contrato.activo) return;
        }

        // Buscar info del curso para ver si tiene simulación
        const cursoInfo = courses[contrato.curso_id];
        // Si no encontramos el curso, mostraremos "No Aplica"
        const tieneSimulacion = cursoInfo ? cursoInfo.simulacion : undefined;

        // Ahora buscamos los estudiantes que tengan "codigoOrganizacion" = codOrg
        const estudiantesDeEstaOrg = estudiantes.filter(
          (est) => est.codigoOrganizacion === codOrg
        );

        // Para cada estudiante de esta organización
        estudiantesDeEstaOrg.forEach((est) => {
          // Filtramos por búsqueda de nombre o correo
          const fullName = `${est.first_name} ${est.last_name}`.toLowerCase();
          const email = est.email.toLowerCase();
          const busquedaVal = busqueda.toLowerCase();

          if (
            busqueda &&
            !fullName.includes(busquedaVal) &&
            !email.includes(busquedaVal)
          ) {
            return; // Skip este estudiante
          }

          // Buscar el progreso correspondiente a este estudiante y este curso
          const progEst = progreso.find(
            (p) => p.estudiante === est.id && p.curso === contrato.curso_id
          );

          // Buscar si tiene pruebas aprobadas (ajusta si deseas filtrar por curso o no)
          const pruebaAprobada = pruebas.some(
            (pr) =>
              pr.estudiante === est.id &&
              pr.curso === contrato.curso_id && // si la prueba está asociada al curso
              pr.estaAprobado
          );

          // Lógica para extraer datos del progreso
          const fechaInicio = contrato.fechaInicioCapacitacion || 'N/A';
          const fechaFin = contrato.fechaFinCapacitacion || 'N/A';
          const nombreCurso = contrato.curso_titulo || 'N/A';

          const porcentajeCompletado = progEst?.porcentajeCompletado
            ? `${progEst?.porcentajeCompletado.toFixed(2)}%`
            : '0%';

          const contenidoCompletado = progEst?.contenidoCompletado
            ? 'Sí'
            : 'No';

          // Revisar si la simulación la completó el estudiante
          const simulacionCompletada =
          tieneSimulacion === false || tieneSimulacion === undefined
            ? 'N/A'
            : progEst?.simulacionCompletada === true
            ? 'Sí'
            : progEst?.simulacionCompletada === false
            ? 'No'
            : 'N/A';

          filas.push({
            idEstudiante: est.id,
            nombreEstudiante: `${est.first_name} ${est.last_name}`,
            correoEstudiante: est.email,
            nombreCurso,
            fechaInicio,
            fechaFin,
            porcentajeCompletado,
            contenidoCompletado,
            // Si no tenemos "cursoInfo" o no existe "simulacion" en el curso, "No Aplica"
            simulacionDelCurso:
              tieneSimulacion === undefined
                ? 'No Aplica'
                : tieneSimulacion
                ? 'Sí'
                : 'No',
            simulacionCompletada,
            pruebaAprobada: pruebaAprobada ? 'Sí' : 'No',
            cursoId: contrato.curso_id,
            completado: progEst?.completado || false,
          });
        });
      });
    });

    return filas;
  };

  // -----------------------------------------------------
  // Descargar Certificado
  // -----------------------------------------------------
  const handleDescargarCertificado = async (cursoId, estudianteId, nombreEstudiante) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/certificado/?curso_id=${cursoId}&estudiante_id=${estudianteId}`,
        { headers: getHeaders() }
      );
      if (!response.ok) {
        throw new Error('No se pudo obtener el certificado.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificado_Curso_${cursoId}_${nombreEstudiante}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el certificado:', error);
      showAlert('Error', 'No se pudo descargar el certificado.', 'error');
    }
  };

  // -----------------------------------------------------
  // Render principal
  // -----------------------------------------------------
  const filasTabla = getFilasTabla();

  return (
    <div className="ver-estudiantes-container">
      <h2>Lista de Estudiantes</h2>

      {/* Filtros */}
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

        <div className="filter">
          <label htmlFor="codigoFiltro">Código de Organización (Contrato):</label>
          <select
            id="codigoFiltro"
            value={codigoFiltro}
            onChange={(e) => handleCodigoFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            {Object.keys(contratos).map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label htmlFor="activoFiltro">Estado del Contrato:</label>
          <select
            id="activoFiltro"
            value={activoFiltro}
            onChange={(e) => handleActivoFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Tabla de estudiantes */}
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
          {filasTabla.length > 0 ? (
            filasTabla.map((fila, index) => (
              <tr key={`${fila.idEstudiante}-${index}`}>
                <td>{fila.nombreEstudiante}</td>
                <td>{fila.correoEstudiante}</td>
                <td>{fila.nombreCurso}</td>
                <td>{fila.fechaInicio}</td>
                <td>{fila.fechaFin}</td>
                <td>{fila.porcentajeCompletado}</td>
                <td>{fila.contenidoCompletado}</td>
                <td>{fila.simulacionDelCurso}</td>
                <td>{fila.simulacionCompletada}</td>
                <td>{fila.pruebaAprobada}</td>
                <td>
                  {fila.completado && (
                    <Button
                      className="success"
                      onClick={() =>
                        handleDescargarCertificado(
                          fila.cursoId,
                          fila.idEstudiante,
                          fila.nombreEstudiante
                        )
                      }
                    >
                      Ver Certificado
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No se encontraron registros.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerEstudiantes;
