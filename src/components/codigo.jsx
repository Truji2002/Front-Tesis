import React, { useEffect, useState } from "react";

const VistaEstudiante = () => {
  const [cursos, setCursos] = useState([
    { id: 1, titulo: "Curso 1", descripcion: "Descripción del Curso 1" },
    { id: 2, titulo: "Curso 2", descripcion: "Descripción del Curso 2" },
  ]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [subcursos, setSubcursos] = useState([
    { id: 1, nombre: "Subcurso 1", progreso: 50 },
    { id: 2, nombre: "Subcurso 2", progreso: 20 },
  ]);
  const [modulos, setModulos] = useState([
    {
      id: 1,
      nombre: "Módulo 1",
      enlace: "https://example.com/modulo1",
    },
    {
      id: 2,
      nombre: "Módulo 2",
      archivo: "https://example.com/modulo2.pdf",
    },
  ]);

  return (
    <div className="vista-estudiante-container">
      <h2>Mis Cursos (Vista de Prueba)</h2>
      <div className="cursos-container">
        {cursos.map((curso) => (
          <div
            key={curso.id}
            className="curso-card"
            onClick={() => setSelectedCurso(curso)}
          >
            <h3>{curso.titulo}</h3>
            <p>{curso.descripcion}</p>
          </div>
        ))}
      </div>

      {selectedCurso && (
        <div className="subcursos-container">
          <h3>Subcursos de {selectedCurso.titulo}</h3>
          {subcursos.map((subcurso) => (
            <div key={subcurso.id} className="subcurso-card">
              <h4>{subcurso.nombre}</h4>
              <p>Progreso: {subcurso.progreso}%</p>
            </div>
          ))}
        </div>
      )}

      {modulos.length > 0 && (
        <div className="modulos-container">
          <h3>Módulos</h3>
          {modulos.map((modulo) => (
            <div key={modulo.id} className="modulo-card">
              <h4>{modulo.nombre}</h4>
              {modulo.enlace && (
                <a href={modulo.enlace} target="_blank" rel="noopener noreferrer">
                  Ver Contenido
                </a>
              )}
              {modulo.archivo && (
                <a href={modulo.archivo} target="_blank" rel="noopener noreferrer">
                  Descargar Contenido
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VistaEstudiante;
