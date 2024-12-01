// import React, { useState, useEffect } from 'react';
// import { showAlert } from './alerts';
// import Swal from 'sweetalert2';
// import Button from './ui/button/button';
// import Input from './ui/input/input';
// import Label from './ui/label/label';
// import '../styles/Empresas.css';

// const Empresas = () => {
//   const [empresas, setEmpresas] = useState([]);
//   const [formData, setFormData] = useState({
//     nombre: '',
//     area: '',
//     direccion: '',
//     telefono: '',
//     correoElectronico: '',
//     numeroEmpleados: '',
//   });
//   const [editingEmpresa, setEditingEmpresa] = useState(null);

//   const token = localStorage.getItem('accessToken');

//   const getHeaders = () => ({
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//   });

//   const fetchEmpresas = async () => {
//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/empresas/', {
//         headers: getHeaders(),
//       });
//       if (!response.ok) throw new Error('Error al obtener las empresas');
//       const data = await response.json();
//       setEmpresas(data);
//     } catch (error) {
//       showAlert('Error', 'Error al obtener las empresas.', 'error');
//     }
//   };

//   useEffect(() => {
//     fetchEmpresas();
//   }, []);

//   const isOnlyLetters = (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
//   const isOnlyNumbers = (value) => /^[0-9]+$/.test(value);
//   const isValidEmail = (value) =>
//     /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);

//   const validateForm = () => {
//     if (!isOnlyLetters(formData.area)) {
//       showAlert('Error', 'El área solo puede contener letras.', 'error');
//       return false;
//     }

//     if (!isOnlyNumbers(formData.telefono)) {
//       showAlert('Error', 'El teléfono solo puede contener números.', 'error');
//       return false;
//     }

//     if (formData.correoElectronico && !isValidEmail(formData.correoElectronico)) {
//       showAlert('Error', 'El correo electrónico no es válido.', 'error');
//       return false;
//     }

//     if (formData.numeroEmpleados && !isOnlyNumbers(formData.numeroEmpleados)) {
//       showAlert(
//         'Error',
//         'El número de empleados solo puede contener números enteros.',
//         'error'
//       );
//       return false;
//     }

//     return true;
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     const result = await Swal.fire({
//       title: editingEmpresa ? '¿Actualizar Empresa?' : '¿Crear Empresa?',
//       text: editingEmpresa
//         ? 'Estás a punto de actualizar esta empresa.'
//         : 'Estás a punto de crear una nueva empresa.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: 'var(--primary-color)',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Sí, confirmar',
//       cancelButtonText: 'Cancelar',
//     });

//     if (!result.isConfirmed) return;

//     try {
//       const method = editingEmpresa ? 'PUT' : 'POST';
//       const url = editingEmpresa
//         ? `http://127.0.0.1:8000/api/empresas/${editingEmpresa.id}/`
//         : 'http://127.0.0.1:8000/api/empresas/';
//       const response = await fetch(url, {
//         method,
//         headers: getHeaders(),
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) throw new Error('Error en el servidor');

//       showAlert(
//         'Éxito',
//         editingEmpresa
//           ? 'Empresa actualizada con éxito.'
//           : 'Empresa creada con éxito.',
//         'success'
//       );

//       setFormData({
//         nombre: '',
//         area: '',
//         direccion: '',
//         telefono: '',
//         correoElectronico: '',
//         numeroEmpleados: '',
//       });

//       setEditingEmpresa(null);
//       fetchEmpresas();
//     } catch (error) {
//       showAlert('Error', 'Error al guardar la empresa.', 'error');
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: '¿Eliminar Empresa?',
//       text: 'Esta acción eliminará la empresa de forma permanente.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: 'var(--primary-color)',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar',
//     });

//     if (!result.isConfirmed) return;

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/empresas/${id}/`, {
//         method: 'DELETE',
//         headers: getHeaders(),
//       });
//       if (!response.ok) throw new Error('Error al eliminar la empresa');
//       showAlert('Éxito', 'Empresa eliminada con éxito.', 'success');
//       fetchEmpresas();
//     } catch (error) {
//       showAlert('Error', 'Error al eliminar la empresa.', 'error');
//     }
//   };

//   const handleEdit = (empresa) => {
//     setEditingEmpresa(empresa);
//     setFormData(empresa);
//   };

//   return (
//     <div className="empresas-container">
//       <h2>Administrar Empresas</h2>

//       <form className="empresa-form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <Label htmlFor="nombre">Nombre</Label>
//           <Input
//             id="nombre"
//             name="nombre"
//             value={formData.nombre}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <Label htmlFor="area">Área</Label>
//           <Input
//             id="area"
//             name="area"
//             value={formData.area}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <Label htmlFor="direccion">Dirección</Label>
//           <Input
//             id="direccion"
//             name="direccion"
//             value={formData.direccion}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className="form-group">
//           <Label htmlFor="telefono">Teléfono</Label>
//           <Input
//             id="telefono"
//             name="telefono"
//             value={formData.telefono}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <Label htmlFor="correoElectronico">Correo Electrónico</Label>
//           <Input
//             id="correoElectronico"
//             name="correoElectronico"
//             value={formData.correoElectronico}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className="form-group">
//           <Label htmlFor="numeroEmpleados">Número de Empleados</Label>
//           <Input
//             id="numeroEmpleados"
//             name="numeroEmpleados"
//             value={formData.numeroEmpleados}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <Button type="submit" className="w-full">
//           {editingEmpresa ? 'Actualizar Empresa' : 'Crear Empresa'}
//         </Button>
//       </form>

//       <table className="empresa-table">
//         <thead>
//           <tr>
//             <th>Nombre</th>
//             <th>Área</th>
//             <th>Dirección</th>
//             <th>Teléfono</th>
//             <th>Correo</th>
//             <th>Empleados</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {empresas.map((empresa) => (
//             <tr key={empresa.id}>
//               <td>{empresa.nombre}</td>
//               <td>{empresa.area}</td>
//               <td>{empresa.direccion}</td>
//               <td>{empresa.telefono}</td>
//               <td>{empresa.correoElectronico}</td>
//               <td>{empresa.numeroEmpleados}</td>
//               <td>
//                 <Button onClick={() => handleEdit(empresa)}>Editar</Button>
//                 <Button onClick={() => handleDelete(empresa.id)} className="danger">
//                   Eliminar
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Empresas;
import React, { useState, useEffect } from 'react';
import { showAlert } from './alerts';
import Swal from 'sweetalert2';
import Button from './ui/button/button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import '../styles/Empresas.css';

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    area: '',
    direccion: '',
    telefono: '',
    correoElectronico: '',
    numeroEmpleados: '',
  });
  const [editingEmpresa, setEditingEmpresa] = useState(null);

  const token = localStorage.getItem('accessToken');

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const fetchEmpresas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/empresas/', {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Error al obtener las empresas');
      const data = await response.json();
      setEmpresas(data);
      setFilteredEmpresas(data); // Inicialmente mostrar todas las empresas
    } catch (error) {
      showAlert('Error', 'Error al obtener las empresas.', 'error');
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = empresas.filter((empresa) =>
      empresa.nombre.toLowerCase().includes(term)
    );
    setFilteredEmpresas(filtered);
  };

  const isOnlyLetters = (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
  const isOnlyNumbers = (value) => /^[0-9]+$/.test(value);
  const isValidEmail = (value) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);

  const validateForm = () => {
    if (!isOnlyLetters(formData.area)) {
      showAlert('Error', 'El área solo puede contener letras.', 'error');
      return false;
    }

    if (!isOnlyNumbers(formData.telefono)) {
      showAlert('Error', 'El teléfono solo puede contener números.', 'error');
      return false;
    }

    if (formData.correoElectronico && !isValidEmail(formData.correoElectronico)) {
      showAlert('Error', 'El correo electrónico no es válido.', 'error');
      return false;
    }

    if (formData.numeroEmpleados && !isOnlyNumbers(formData.numeroEmpleados)) {
      showAlert(
        'Error',
        'El número de empleados solo puede contener números enteros.',
        'error'
      );
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await Swal.fire({
      title: editingEmpresa ? '¿Actualizar Empresa?' : '¿Crear Empresa?',
      text: editingEmpresa
        ? 'Estás a punto de actualizar esta empresa.'
        : 'Estás a punto de crear una nueva empresa.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const method = editingEmpresa ? 'PUT' : 'POST';
      const url = editingEmpresa
        ? `http://127.0.0.1:8000/api/empresas/${editingEmpresa.id}/`
        : 'http://127.0.0.1:8000/api/empresas/';
      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error en el servidor');

      showAlert(
        'Éxito',
        editingEmpresa
          ? 'Empresa actualizada con éxito.'
          : 'Empresa creada con éxito.',
        'success'
      );

      setFormData({
        nombre: '',
        area: '',
        direccion: '',
        telefono: '',
        correoElectronico: '',
        numeroEmpleados: '',
      });

      setEditingEmpresa(null);
      fetchEmpresas();
    } catch (error) {
      showAlert('Error', 'Error al guardar la empresa.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar Empresa?',
      text: 'Esta acción eliminará la empresa de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/empresas/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Error al eliminar la empresa');
      showAlert('Éxito', 'Empresa eliminada con éxito.', 'success');
      fetchEmpresas();
    } catch (error) {
      showAlert('Error', 'Error al eliminar la empresa.', 'error');
    }
  };

  const handleEdit = (empresa) => {
    setEditingEmpresa(empresa);
    setFormData(empresa);
  };

  return (
    <div className="empresas-container">
  <h2>Administrar Empresas</h2>

  <form className="empresa-form" onSubmit={handleSubmit}>
    <div className="form-group">
      <Label htmlFor="nombre">Nombre</Label>
      <Input
        id="nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <Label htmlFor="area">Área</Label>
      <Input
        id="area"
        name="area"
        value={formData.area}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <Label htmlFor="direccion">Dirección</Label>
      <Input
        id="direccion"
        name="direccion"
        value={formData.direccion}
        onChange={handleInputChange}
      />
    </div>
    <div className="form-group">
      <Label htmlFor="telefono">Teléfono</Label>
      <Input
        id="telefono"
        name="telefono"
        value={formData.telefono}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <Label htmlFor="correoElectronico">Correo Electrónico</Label>
      <Input
        id="correoElectronico"
        name="correoElectronico"
        value={formData.correoElectronico}
        onChange={handleInputChange}
      />
    </div>
    <div className="form-group">
      <Label htmlFor="numeroEmpleados">Número de Empleados</Label>
      <Input
        id="numeroEmpleados"
        name="numeroEmpleados"
        value={formData.numeroEmpleados}
        onChange={handleInputChange}
        required
      />
    </div>
    <Button type="submit" className="w-full">
      {editingEmpresa ? 'Actualizar Empresa' : 'Crear Empresa'}
    </Button>
  </form>

  <div className="search-bar">
    <Label htmlFor="search">Buscar Empresa:</Label>
    <Input
      id="search"
      name="search"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Escribe el nombre de la empresa"
    />
  </div>

  <table className="empresa-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Área</th>
        <th>Dirección</th>
        <th>Teléfono</th>
        <th>Correo</th>
        <th>Empleados</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {filteredEmpresas.length > 0 ? (
        filteredEmpresas.map((empresa) => (
          <tr key={empresa.id}>
            <td>{empresa.nombre}</td>
            <td>{empresa.area}</td>
            <td>{empresa.direccion}</td>
            <td>{empresa.telefono}</td>
            <td>{empresa.correoElectronico}</td>
            <td>{empresa.numeroEmpleados}</td>
            <td>
              <Button onClick={() => handleEdit(empresa)}>Editar</Button>
              <Button
                onClick={() => handleDelete(empresa.id)}
                className="danger"
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7">No se encontraron empresas.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
  );
};

export default Empresas;
