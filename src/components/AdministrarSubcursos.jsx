
import React, { useState, useEffect } from 'react';
import '../styles/AdministrarSubcursos.css';

const AdministrarSubcursos = ({ setMessage }) => {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [subcursoNombre, setSubcursoNombre] = useState('');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/cursos/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setCursos(data);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
        setMessage({ text: 'Error al cargar cursos.', type: 'error' });
      }
    };
    fetchCursos();
  }, []);

  const handleAddSubcurso = async (e) => {
    e.preventDefault();
    if (!selectedCurso || !subcursoNombre) {
      setMessage({ text: 'Por favor, selecciona un curso y proporciona un nombre para el subcurso.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/subcursos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          curso: selectedCurso,
          nombre: subcursoNombre,
        }),
      });

      if (response.ok) {
        setMessage({ text: 'Subcurso creado con éxito.', type: 'success' });
        setSubcursoNombre('');
      } else {
        setMessage({ text: 'Error al crear subcurso.', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Hubo un problema al conectar con el servidor.', type: 'error' });
    }
  };

  return (
    <div className="form-container">
      <h2>Administrar Subcursos</h2>
      <form className="admin-form" onSubmit={handleAddSubcurso}>
        <div className="form-group">
          <label>Curso:</label>
          <select value={selectedCurso} onChange={(e) => setSelectedCurso(e.target.value)}>
            <option value="">Selecciona un curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>{curso.titulo}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Nombre del Subcurso:</label>
          <input
            type="text"
            value={subcursoNombre}
            onChange={(e) => setSubcursoNombre(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="create-button">Crear Subcurso</button>
      </form>
    </div>
  );
};

export default AdministrarSubcursos;
