// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import '../styles/EditarCliente.css';

// const EditarCliente = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const accessToken = localStorage.getItem('accessToken');
//   const editingClient = location.state?.editingClient; // Cliente recibido desde ListaClientes
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     area: '',
//     fechaInicioContrato: '',
//     fechaFinContrato: '',
//     empresa: '',
//     is_active:true
//   });


//   useEffect(() => {
//     if (editingClient) {
//       setFormData(editingClient);
//     }
//   }, [editingClient]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCancel = () => {
//     navigate('/clients');  // Vuelve a la pantalla principal
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const accessToken = localStorage.getItem('accessToken');
  
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/instructores/${editingClient?.id || ''}/`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(formData),
//       });
  
//       if (response.ok) {
//         setMessage({
//           text: `Cliente ${editingClient ? 'actualizado' : 'registrado'} con éxito.`,
//           type: 'success',
//         });
//         console.log('Cliente actualizado con éxito');
        
//         // Redirige a la lista de clientes
//         navigate('/clients');
//       } else {
//         const errorData = await response.json();
//         console.error('Error del servidor:', errorData); // Muestra detalles del error
//         setMessage({
//           text: `Error al ${
//             editingClient ? 'actualizar' : 'registrar'
//           } el cliente: ${errorData.detail || 'Datos inválidos.'}`,
//           type: 'error',
//         });
//       }
//     } catch (error) {
//       console.error('Error al conectar con el servidor:', error);
//       setMessage({ text: 'Hubo un problema al conectar con el servidor.', type: 'error' });
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Editar Cliente</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="first_name">Nombre:</label>
//           <input
//             type="text"
//             id="first_name"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="last_name">Apellido:</label>
//           <input
//             type="text"
//             id="last_name"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="area">Área:</label>
//           <input
//             type="text"
//             id="area"
//             name="area"
//             value={formData.area}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="fechaInicioContrato">Fecha Inicio Contrato:</label>
//           <input
//             type="date"
//             id="fechaInicioContrato"
//             name="fechaInicioContrato"
//             value={formData.fechaInicioContrato}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="fechaFinContrato">Fecha Fin Contrato:</label>
//           <input
//             type="date"
//             id="fechaFinContrato"
//             name="fechaFinContrato"
//             value={formData.fechaFinContrato}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="empresa">Empresa:</label>
//           <input
//             type="text"
//             id="empresa"
//             name="empresa"
//             value={formData.empresa}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-actions">
//           <button type="submit" className="btn-primary">Guardar Cambios</button>
//           <button type="button" className="btn-secondary" onClick={handleCancel}>Cancelar</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditarCliente;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/EditarCliente.css';

const EditarCliente = ({ setMessage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingClient = location.state?.editingClient; // Cliente recibido desde ListaClientes
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    area: '',
    fechaInicioContrato: '',
    fechaFinContrato: '',
    empresa: '',
    is_active: true,
  });
  const [localMessage, setLocalMessage] = useState({ text: '', type: '' }); // Mensaje local

  useEffect(() => {
    if (editingClient) {
      setFormData(editingClient);
    }
  }, [editingClient]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate(-1); // Vuelve a la pantalla principal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/instructores/${editingClient?.id || ''}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setLocalMessage({
          text: `Cliente ${editingClient ? 'actualizado' : 'registrado'} con éxito.`,
          type: 'success',
        });

        if (setMessage) {
          setMessage({
            text: `Cliente ${editingClient ? 'actualizado' : 'registrado'} con éxito.`,
            type: 'success',
          });
        }

        // Redirige a la lista de clientes
        setTimeout(() => navigate('/clients'), 2000);
      } else {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData); // Muestra detalles del error
        setLocalMessage({
          text: `Error al ${
            editingClient ? 'actualizar' : 'registrar'
          } el cliente: ${errorData.detail || 'Datos inválidos.'}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setLocalMessage({ text: 'Hubo un problema al conectar con el servidor.', type: 'error' });
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">Nombre:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Apellido:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="area">Área:</label>
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaInicioContrato">Fecha Inicio Contrato:</label>
          <input
            type="date"
            id="fechaInicioContrato"
            name="fechaInicioContrato"
            value={formData.fechaInicioContrato}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaFinContrato">Fecha Fin Contrato:</label>
          <input
            type="date"
            id="fechaFinContrato"
            name="fechaFinContrato"
            value={formData.fechaFinContrato}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="empresa">Empresa:</label>
          <input
            type="text"
            id="empresa"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">Guardar Cambios</button>
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
      {localMessage.text && (
        <p className={`message ${localMessage.type}`}>{localMessage.text}</p>
      )}
    </div>
  );
};

export default EditarCliente;
