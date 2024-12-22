import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditarPrueba = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    duracion: '',
    estaAprobado: false,
    calificacion: '',
    fechaEvaluacion: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar datos de la prueba
    const fetchPrueba = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/pruebas/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            duracion: data.duracion,
            estaAprobado: data.estaAprobado,
            calificacion: data.calificacion,
            fechaEvaluacion: data.fechaEvaluacion
          });
        } else {
          setError('No se pudo cargar la prueba.');
        }
      } catch (err) {
        setError('Error al conectar con el servidor.');
      }
    };
    fetchPrueba();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/pruebas/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          duracion: parseInt(formData.duracion),
          estaAprobado: formData.estaAprobado,
          calificacion: parseFloat(formData.calificacion),
          fechaEvaluacion: formData.fechaEvaluacion
        })
      });
      if (response.ok) {
        // Prueba editada con éxito
        navigate('/pruebas');
      } else {
        const errData = await response.json();
        setError(`Error: ${JSON.stringify(errData)}`);
      }
    } catch (err) {
      setError('Error al intentar editar la prueba.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Editar Prueba {id}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Duración (min):</label>
          <input
            type="number"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Calificación:</label>
          <input
            type="number"
            step="0.1"
            name="calificacion"
            value={formData.calificacion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Fecha de Evaluación:</label>
          <input
            type="date"
            name="fechaEvaluacion"
            value={formData.fechaEvaluacion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="estaAprobado"
              checked={formData.estaAprobado}
              onChange={handleChange}
            />
            ¿Está aprobada por defecto?
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default EditarPrueba;
