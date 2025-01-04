// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
    const [data, setData] = useState({
        totalEmpresas: 0,
        totalUsuarios: { instructores: 0, estudiantes: 0 },
        totalCursos: 0,
        progresoPromedio: 0,
        simulaciones: { completadas: 0, porcentaje: 0 },
        tasaCertificacion: 0,
        tasaAprobacion: 0,
        estudiantesPorEmpresa: {},
        instructoresPorEmpresa: {},
        cursosFinalizacion: { mayor: null, menor: null }
    });

    const [empresas, setEmpresas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [filters, setFilters] = useState({ empresa: '', curso: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('accessToken');

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        // Convertir el valor a string para evitar inconsistencias de tipo
        setFilters((prev) => ({ ...prev, [name]: value.toString() }));
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };

                const [empresasResponse, cursosResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/empresas/`, { headers }),
                    axios.get(`${API_BASE_URL}/api/cursos/`, { headers })
                ]);

                // Verificar la estructura de la respuesta
                console.log('Empresas Response:', empresasResponse.data);
                console.log('Cursos Response:', cursosResponse.data);

                // Asegurarse de que las respuestas son arrays
                setEmpresas(Array.isArray(empresasResponse.data) ? empresasResponse.data : []);
                setCursos(Array.isArray(cursosResponse.data) ? cursosResponse.data : []);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setError('Error al cargar las empresas y cursos.');
            }
        };

        fetchInitialData();
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const headers = { Authorization: `Bearer ${token}` };
                
                // Preparar parámetros filtrados
                const params = {};
                if (filters.empresa) params.empresa = filters.empresa;
                if (filters.curso) params.curso = filters.curso;

                // Agregar logs para depuración
                console.log('Fetching data with filters:', params);

                const [
                    empresasTotal,
                    usuariosTotal,
                    cursosTotal,
                    progresoPromedio,
                    simulacionesCompletadas,
                    tasaCertificacion,
                    tasaAprobacion,
                    estudiantesEmpresa,
                    instructoresEmpresa,
                    cursosFinalizacion
                ] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/empresas-total/`, { headers }),
                    axios.get(`${API_BASE_URL}/api/usuarios-total/`, { headers, params: { empresa: filters.empresa } }),
                    axios.get(`${API_BASE_URL}/api/cursos-total/`, { headers, params: { empresa: filters.empresa } }),
                    axios.get(`${API_BASE_URL}/api/progreso-promedio/`, { headers, params }),
                    axios.get(`${API_BASE_URL}/api/simulaciones-completadas/`, { headers }),
                    axios.get(`${API_BASE_URL}/api/tasa-certificacion/`, { headers, params }),
                    axios.get(`${API_BASE_URL}/api/tasa-aprobacion/`, { headers, params }),
                    axios.get(`${API_BASE_URL}/api/estudiante-empresa/`, { headers }),
                    axios.get(`${API_BASE_URL}/api/instructor-empresa/`, { headers }),
                    axios.get(`${API_BASE_URL}/api/cursos-finalizacion/`, { headers })
                ]);

                // Verificar la estructura de las respuestas
                console.log('Empresas Total Response:', empresasTotal.data);
                console.log('Cursos Total Response:', cursosTotal.data);
                console.log('Usuarios Total Response:', usuariosTotal.data);
                // ... puedes agregar más logs según sea necesario

                setData({
                    totalEmpresas: empresasTotal.data.total_empresas,
                    totalUsuarios: {
                        instructores: usuariosTotal.data.total_instructores,
                        estudiantes: usuariosTotal.data.total_estudiantes
                    },
                    totalCursos: cursosTotal.data.total_cursos,
                    progresoPromedio: progresoPromedio.data.progreso_promedio,
                    simulaciones: {
                        completadas: simulacionesCompletadas.data.total_simulaciones_completadas,
                        porcentaje: simulacionesCompletadas.data.porcentaje_completadas
                    },
                    tasaCertificacion: tasaCertificacion.data.tasa_certificacion,
                    tasaAprobacion: tasaAprobacion.data.tasa_aprobacion,
                    estudiantesPorEmpresa: estudiantesEmpresa.data,
                    instructoresPorEmpresa: instructoresEmpresa.data,
                    cursosFinalizacion: {
                        mayor: cursosFinalizacion.data.curso_mayor_finalizacion,
                        menor: cursosFinalizacion.data.curso_menor_finalizacion
                    }
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error al cargar los datos del dashboard.');
                setLoading(false);
            }
        };

        fetchData();
    }, [token, filters]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard de Métricas
            </Typography>

            {/* Filtros */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <FormControl fullWidth>
                    <InputLabel id="empresa-label">Empresa</InputLabel>
                    <Select
                        labelId="empresa-label"
                        name="empresa"
                        value={filters.empresa}
                        label="Empresa"
                        onChange={handleFilterChange}
                    >
                        <MenuItem value="">
                            <em>Todas</em>
                        </MenuItem>
                        {empresas.map((empresa) => (
                            <MenuItem key={empresa.id} value={empresa.id.toString()}>
                                {empresa.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="curso-label">Curso</InputLabel>
                    <Select
                        labelId="curso-label"
                        name="curso"
                        value={filters.curso}
                        label="Curso"
                        onChange={handleFilterChange}
                    >
                        <MenuItem value="">
                            <em>Todos</em>
                        </MenuItem>
                        {cursos.map((curso) => (
                            <MenuItem key={curso.id} value={curso.id.toString()}>
                                {curso.titulo}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Métricas Principales */}
            <Grid container spacing={3}>
                {/* Total de Empresas */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ minHeight: 150 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Total de Empresas
                            </Typography>
                            <Typography variant="h4" component="div">
                                {data.totalEmpresas}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Total de Usuarios */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ minHeight: 150 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Total de Usuarios
                            </Typography>
                            <Typography variant="h5">Instructores: {data.totalUsuarios.instructores}</Typography>
                            <Typography variant="h5">Estudiantes: {data.totalUsuarios.estudiantes}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Total de Cursos */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ minHeight: 150 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Total de Cursos
                            </Typography>
                            <Typography variant="h4" component="div">
                                {data.totalCursos}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Progreso Promedio */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ minHeight: 300 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Progreso Promedio
                            </Typography>
                            <Typography variant="h4" component="div" sx={{ mb: 2 }}>
                                {data.progresoPromedio}%
                            </Typography>
                            <Box sx={{ height: 200 }}>
                                <Pie
                                    data={{
                                        labels: ['Completado', 'Restante'],
                                        datasets: [
                                            {
                                                data: [data.progresoPromedio, 100 - data.progresoPromedio],
                                                backgroundColor: ['#4CAF50', '#FFCDD2']
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'bottom' }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Simulaciones Completadas */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ minHeight: 300 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Simulaciones Completadas
                            </Typography>
                            <Typography variant="h4" component="div">
                                {data.simulaciones.completadas}
                            </Typography>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Porcentaje: {data.simulaciones.porcentaje}%
                            </Typography>
                            <Box sx={{ height: 200 }}>
                                <Line
                                    data={{
                                        labels: ['Simulaciones'],
                                        datasets: [
                                            {
                                                label: 'Completadas',
                                                data: [data.simulaciones.completadas],
                                                borderColor: '#3f51b5',
                                                backgroundColor: '#3f51b5',
                                                fill: true
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: { beginAtZero: true }
                                        },
                                        plugins: {
                                            legend: { display: false }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tasa de Certificación */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ minHeight: 300 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Tasa de Certificación
                            </Typography>
                            <Typography variant="h4" component="div">
                                {data.tasaCertificacion}%
                            </Typography>
                            <Box sx={{ height: 200 }}>
                                <Bar
                                    data={{
                                        labels: ['Certificación'],
                                        datasets: [
                                            {
                                                label: 'Porcentaje',
                                                data: [data.tasaCertificacion],
                                                backgroundColor: '#2196F3'
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: { y: { beginAtZero: true, max: 100 } },
                                        plugins: {
                                            legend: { display: false }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tasa de Aprobación */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ minHeight: 300 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Tasa de Aprobación
                            </Typography>
                            <Typography variant="h4" component="div">
                                {data.tasaAprobacion}%
                            </Typography>
                            <Box sx={{ height: 200 }}>
                                <Bar
                                    data={{
                                        labels: ['Aprobación'],
                                        datasets: [
                                            {
                                                label: 'Porcentaje',
                                                data: [data.tasaAprobacion],
                                                backgroundColor: '#FF9800'
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: { y: { beginAtZero: true, max: 100 } },
                                        plugins: {
                                            legend: { display: false }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Estudiantes por Empresa */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ minHeight: 400 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Estudiantes por Empresa
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Bar
                                    data={{
                                        labels: Object.keys(data.estudiantesPorEmpresa),
                                        datasets: [
                                            {
                                                label: 'Estudiantes',
                                                data: Object.values(data.estudiantesPorEmpresa),
                                                backgroundColor: '#66BB6A'
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: { y: { beginAtZero: true } },
                                        plugins: {
                                            legend: { display: false }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Instructores por Empresa */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ minHeight: 400 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Instructores por Empresa
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Bar
                                    data={{
                                        labels: Object.keys(data.instructoresPorEmpresa),
                                        datasets: [
                                            {
                                                label: 'Instructores',
                                                data: Object.values(data.instructoresPorEmpresa),
                                                backgroundColor: '#AB47BC'
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: { y: { beginAtZero: true } },
                                        plugins: {
                                            legend: { display: false }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Cursos por Finalización */}
                <Grid item xs={12}>
                    <Card sx={{ minHeight: 500 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Cursos por Finalización
                            </Typography>

                            {/* Mayor Tasa de Finalización */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6">Mayor Tasa de Finalización</Typography>
                                {data.cursosFinalizacion.mayor ? (
                                    <Typography>
                                        {data.cursosFinalizacion.mayor.titulo} : {data.cursosFinalizacion.mayor.tasa_finalizacion}%
                                    </Typography>
                                ) : (
                                    <Typography>No hay datos</Typography>
                                )}
                            </Box>

                            {/* Menor Tasa de Finalización */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6">Menor Tasa de Finalización</Typography>
                                {data.cursosFinalizacion.menor ? (
                                    <Typography>
                                        {data.cursosFinalizacion.menor.titulo} : {data.cursosFinalizacion.menor.tasa_finalizacion}%
                                    </Typography>
                                ) : (
                                    <Typography>No hay datos</Typography>
                                )}
                            </Box>

                            {/* Gráfico de Tasa de Finalización */}
                            <Box sx={{ height: 300 }}>
                                <Bar
                                    data={{
                                        labels: ['Mayor Finalización', 'Menor Finalización'],
                                        datasets: [
                                            {
                                                label: 'Tasa de Finalización (%)',
                                                data: [
                                                    data.cursosFinalizacion.mayor
                                                        ? data.cursosFinalizacion.mayor.tasa_finalizacion
                                                        : 0,
                                                    data.cursosFinalizacion.menor
                                                        ? data.cursosFinalizacion.menor.tasa_finalizacion
                                                        : 0
                                                ],
                                                backgroundColor: ['#42A5F5', '#FFA726']
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: { y: { beginAtZero: true, max: 100 } },
                                        plugins: {
                                            legend: { display: false }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
