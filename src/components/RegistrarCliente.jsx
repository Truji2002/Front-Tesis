// import React, { useState } from 'react';
// import Swal from 'sweetalert2';
// import '../styles/FormularioCliente.css';

// const RegistrarCliente = () => {
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     password: 'defaultpassword',
//     area: '',
//     fechaInicioContrato: '',
//     fechaFinContrato: '',
//     empresa: '',
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false); // Estado para deshabilitar el botón mientras se realiza la acción

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true); // Deshabilita el botón al iniciar el registro

//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/instructores/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         Swal.fire(
//           '¡Éxito!',
//           'El cliente ha sido registrado correctamente.',
//           'success'
//         ).then(() => {
//           setFormData({
//             first_name: '',
//             last_name: '',
//             email: '',
//             password: 'defaultpassword',
//             area: '',
//             fechaInicioContrato: '',
//             fechaFinContrato: '',
//             empresa: '',
//           });
//         });
//       } else {
//         const errorData = await response.json();
//         Swal.fire(
//           'Error',
//           `No se pudo registrar el cliente: ${
//             errorData.detail || 'Error desconocido.'
//           }`,
//           'error'
//         );
//       }
//     } catch (error) {
//       Swal.fire(
//         'Error',
//         'Hubo un problema al conectar con el servidor.',
//         'error'
//       );
//     } finally {
//       setIsSubmitting(false); // Rehabilita el botón al finalizar la acción
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Registrar Cliente</h2>
//       <form className="client-form" onSubmit={handleCreate}>
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
//         <button type="submit" className="btn-primary btn-center" disabled={isSubmitting}>
//           {isSubmitting ? 'Creando...' : 'Crear'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegistrarCliente;
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/FormularioCliente.css';

const RegistrarCliente = () => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // Mostrar el diálogo de confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres registrar este cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      // Si el usuario cancela, no hacemos nada
      return;
    }

    setIsSubmitting(true); // Desactivar el botón mientras se realiza la acción

    try {
      const response = await fetch('http://127.0.0.1:8000/api/instructores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire(
          '¡Éxito!',
          'El cliente ha sido registrado correctamente.',
          'success'
        ).then(() => {
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
        });
      } else {
        const errorData = await response.json();
        Swal.fire(
          'Error',
          `No se pudo registrar el cliente: ${
            errorData.detail || 'Error desconocido.'
          }`,
          'error'
        );
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'Hubo un problema al conectar con el servidor.',
        'error'
      );
    } finally {
      setIsSubmitting(false); // Reactivar el botón
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar Cliente</h2>
      <form className="client-form" onSubmit={handleCreate}>
        <div className="form-row">
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
        </div>
        <div className="form-row">
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
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary btn-center" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear'}
        </button>
      </form>
    </div>
  );
};

export default RegistrarCliente;
