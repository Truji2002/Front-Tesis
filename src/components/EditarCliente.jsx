// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import '../styles/FormularioCliente.css';

// const EditarCliente = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const editingClient = location.state?.editingClient;

//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     area: '',
//     fechaInicioContrato: '',
//     fechaFinContrato: '',
//     empresa: '',
//     is_active: true,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false); // Estado para habilitar/deshabilitar el botón

//   useEffect(() => {
//     if (editingClient) {
//       setFormData(editingClient);
//     }
//   }, [editingClient]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCancel = () => {
//     Swal.fire({
//       title: '¿Seguro que deseas cancelar?',
//       text: 'Se perderán los cambios realizados.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, cancelar',
//       cancelButtonText: 'No, continuar',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         navigate(-1);
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true); // Deshabilitar el botón al inicio de la acción

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/api/instructores/${editingClient?.id || ''}/`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (response.ok) {
//         Swal.fire({
//           title: '¡Éxito!',
//           text: 'El cliente ha sido actualizado correctamente.',
//           icon: 'success',
//         }).then(() => {
//           navigate('/clients'); // Redirigir a la lista de clientes
//         });
//       } else {
//         const errorData = await response.json();
//         Swal.fire({
//           title: 'Error',
//           text: `No se pudo actualizar el cliente: ${errorData.detail || 'Error desconocido.'}`,
//           icon: 'error',
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         title: 'Error',
//         text: 'Hubo un problema al conectar con el servidor.',
//         icon: 'error',
//       });
//     } finally {
//       setIsSubmitting(false); // Rehabilitar el botón al finalizar
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Editar Cliente</h2>
//       <form onSubmit={handleSubmit} className="client-form">
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="first_name">Nombre:</label>
//             <input
//               type="text"
//               id="first_name"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="last_name">Apellido:</label>
//             <input
//               type="text"
//               id="last_name"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="area">Área:</label>
//             <input
//               type="text"
//               id="area"
//               name="area"
//               value={formData.area}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="fechaInicioContrato">Fecha Inicio Contrato:</label>
//             <input
//               type="date"
//               id="fechaInicioContrato"
//               name="fechaInicioContrato"
//               value={formData.fechaInicioContrato}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="fechaFinContrato">Fecha Fin Contrato:</label>
//             <input
//               type="date"
//               id="fechaFinContrato"
//               name="fechaFinContrato"
//               value={formData.fechaFinContrato}
//               onChange={handleChange}
//               required
//             />
//           </div>
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
//           <button type="submit" className="btn-primary" disabled={isSubmitting}>
//             {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
//           </button>
//           <button type="button" className="btn-secondary" onClick={handleCancel}>
//             Cancelar
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditarCliente;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/FormularioCliente.css';

const EditarCliente = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingClient = location.state?.editingClient;

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

  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para habilitar/deshabilitar el botón

  useEffect(() => {
    if (editingClient) {
      setFormData(editingClient);
    }
  }, [editingClient]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateDates = () => {
    const { fechaInicioContrato, fechaFinContrato } = formData;
    if (new Date(fechaFinContrato) < new Date(fechaInicioContrato)) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha de fin no puede ser menor a la fecha de inicio.',
        icon: 'error',
      });
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    Swal.fire({
      title: '¿Seguro que deseas cancelar?',
      text: 'Se perderán los cambios realizados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(-1);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) {
      return;
    }

    setIsSubmitting(true); // Deshabilitar el botón al inicio de la acción

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/instructores/${editingClient?.id || ''}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            fechaInicioContrato: formData.fechaInicioContrato,
            fechaFinContrato: formData.fechaFinContrato,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El cliente ha sido actualizado correctamente.',
          icon: 'success',
        }).then(() => {
          navigate('/clients'); // Redirigir a la lista de clientes
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error',
          text: `No se pudo actualizar el cliente: ${errorData.detail || 'Error desconocido.'}`,
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al conectar con el servidor.',
        icon: 'error',
      });
    } finally {
      setIsSubmitting(false); // Rehabilitar el botón al finalizar
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Cliente</h2>
      <form onSubmit={handleSubmit} className="client-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">Nombre:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Apellido:</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              readOnly
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="area">Área:</label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              readOnly
            />
          </div>
        </div>
        <div className="form-row">
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
        </div>
        <div className="form-group">
          <label htmlFor="empresa">Empresa:</label>
          <input
            type="text"
            id="empresa"
            name="empresa"
            value={formData.empresa}
            readOnly
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarCliente;
