import React, { useState } from 'react';
import '../styles/RegistrarCliente.css';

const RegistrarCliente = ({ setMessage }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: 'defaultpassword',
    area: '',
    fechaInicioContrato: '',
    fechaFinContrato: '',
    empresa: '',
  });
  const [localMessage, setLocalMessage] = useState({ text: '', type: '' }); // Mensaje local con tipo

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLocalMessage({ text: '', type: '' });
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/instructores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setLocalMessage({ text: 'Cliente creado con éxito.', type: 'success' });
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: 'defaultpassword',
          area: '',
          fechaInicioContrato: '',
          fechaFinContrato: '',
          empresa: '',
        });
        if (setMessage) setMessage({ text: 'Cliente creado con éxito.', type: 'success' });
      } else {
        const errorData = await response.json();
        setLocalMessage({ text: `Error al crear el cliente: ${errorData.detail || 'Problema desconocido'}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setLocalMessage({ text: 'Hubo un problema al conectar con el servidor.', type: 'error' });
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar Cliente</h2>
      <form className="client-form" onSubmit={handleCreate}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">Nombre:</label>
            <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Apellido:</label>
            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="area">Área Empresa:</label>
            <input type="text" id="area" name="area" value={formData.area} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fechaInicioContrato">Fecha inicio contrato:</label>
            <input type="date" id="fechaInicioContrato" name="fechaInicioContrato" value={formData.fechaInicioContrato} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="fechaFinContrato">Fecha fin contrato:</label>
            <input type="date" id="fechaFinContrato" name="fechaFinContrato" value={formData.fechaFinContrato} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="empresa">Nombre Empresa:</label>
            <input type="text" id="empresa" name="empresa" value={formData.empresa} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit" className="create-button">Crear</button>
      </form>
      {localMessage.text && <p className={`message ${localMessage.type}`}>{localMessage.text}</p>}
    </div>
  );
};

export default RegistrarCliente;