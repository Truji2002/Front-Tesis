import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CursoForm from './CursoForm';
import { showAlert } from './alerts';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditarCurso = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [curso, setCurso] = useState(null); // Estado inicial como `null`
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurso = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/cursos/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error al cargar el curso');
                }
                const data = await response.json();
                setCurso(data); // Establece los datos del curso
            } catch (error) {
                showAlert('Error', 'No se pudo cargar el curso.', 'error');
                navigate('/courses/list'); // Redirige si hay un error
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };
        fetchCurso();
    }, [id, navigate]);

    if (loading) {
        return <p>Cargando curso...</p>; // Muestra un mensaje mientras carga
    }

    if (!curso) {
        return <p>No se encontró el curso.</p>; // Maneja el caso de curso no encontrado
    }

    return (
        <div className="editar-curso-container">
            <CursoForm isEdit={true} curso={curso} onSubmit={() => navigate('/courses/list')} />
        </div>
    );
};

export default EditarCurso;
