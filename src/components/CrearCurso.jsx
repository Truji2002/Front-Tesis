// import React, { useState, useEffect } from 'react';
// import '../styles/CrearCurso.css';

// const CrearCurso = ({ setMessage }) => {
//   const [titulo, setTitulo] = useState('');
//   const [descripcion, setDescripcion] = useState('');
//   const [imagen, setImagen] = useState(null);
//   const [cursos, setCursos] = useState([]);
//   const [editingCurso, setEditingCurso] = useState(null);

//   const fetchCursos = async () => {
//     const accessToken = localStorage.getItem('accessToken');
//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/cursos/', {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });
//       const data = await response.json();
//       setCursos(data);
//     } catch (error) {
//       console.error('Error al cargar cursos:', error);
//       setMessage({ text: 'Error al cargar cursos', type: 'error' });
//     }
//   };

//   useEffect(() => {
//     fetchCursos();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     const accessToken = localStorage.getItem('accessToken');

//     const url = editingCurso ? `http://127.0.0.1:8000/api/cursos/${editingCurso.id}/` : 'http://127.0.0.1:8000/api/cursos/';
//     const method = editingCurso ? 'PUT' : 'POST';

//     const formData = new FormData();
//     formData.append('titulo', titulo);
//     formData.append('descripcion', descripcion);
//     if (imagen) {
//       formData.append('imagen', imagen);
//     }

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: formData,
//       });

//       if (response.ok) {
//         setMessage({ text: editingCurso ? 'Curso actualizado con éxito.' : 'Curso creado con éxito.', type: 'success' });
//         setTitulo('');
//         setDescripcion('');
//         setImagen(null);
//         setEditingCurso(null);
//         fetchCursos();
//       } else {
//         const errorData = await response.json();
//         setMessage({ text: `Error: ${errorData.detail || 'Problema desconocido'}`, type: 'error' });
//       }
//     } catch (error) {
//       console.error('Error al conectar con el servidor:', error);
//       setMessage({ text: 'Hubo un problema al intentar crear o actualizar el curso.', type: 'error' });
//     }
//   };

//   const handleEdit = (curso) => {
//     setTitulo(curso.titulo);
//     setDescripcion(curso.descripcion);
//     setImagen(null);
//     setEditingCurso(curso);
//   };

//   const handleDelete = async (id) => {
//     const accessToken = localStorage.getItem('accessToken');
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/cursos/${id}/`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });
//       if (response.ok) {
//         setMessage({ text: 'Curso eliminado con éxito.', type: 'success' });
//         fetchCursos();
//       } else {
//         setMessage({ text: 'Error al eliminar el curso.', type: 'error' });
//       }
//     } catch (error) {
//       console.error('Error al eliminar el curso:', error);
//       setMessage({ text: 'Hubo un problema al intentar eliminar el curso.', type: 'error' });
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>{editingCurso ? 'Editar Curso' : 'Crear Curso'}</h2>
//       <form className="crear-curso-form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="titulo">Título:</label>
//           <input
//             type="text"
//             id="titulo"
//             value={titulo}
//             onChange={(e) => setTitulo(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="descripcion">Descripción:</label>
//           <textarea
//             id="descripcion"
//             value={descripcion}
//             onChange={(e) => setDescripcion(e.target.value)}
//             required
//           ></textarea>
//         </div>
//         <div className="form-group">
//           <label htmlFor="imagen">Imagen:</label>
//           <input
//             type="file"
//             id="imagen"
//             onChange={(e) => setImagen(e.target.files[0])}
//           />
//         </div>
//         <button type="submit" className="create-button">{editingCurso ? 'Actualizar' : 'Crear'}</button>
//       </form>

//       <h2>Lista de Cursos</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Imagen</th>
//             <th>Título</th>
//             <th>Descripción</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {cursos.map((curso) => (
//             <tr key={curso.id}>
//               <td>
//                 {curso.imagen ? (
//                   <img src={curso.imagen} alt="Imagen del curso" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
//                 ) : (
//                   'No disponible'
//                 )}
//               </td>
//               <td>{curso.titulo}</td>
//               <td>{curso.descripcion}</td>
//               <td>
//                 <button onClick={() => handleEdit(curso)}>Editar</button>
//                 <button onClick={() => handleDelete(curso.id)}>Eliminar</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CrearCurso;

// import React, { useState, useEffect } from 'react';
// import '../styles/CrearCurso.css';

// const CrearCurso = ({ setMessage }) => {
//   const [titulo, setTitulo] = useState('');
//   const [descripcion, setDescripcion] = useState('');
//   const [imagen, setImagen] = useState(null);
//   const [imagenActual, setImagenActual] = useState(null);
//   const [eliminarImagen, setEliminarImagen] = useState(false); // Nuevo estado para eliminar la imagen actual
//   const [cursos, setCursos] = useState([]);
//   const [editingCurso, setEditingCurso] = useState(null);

//   const fetchCursos = async () => {
//     const accessToken = localStorage.getItem('accessToken');
//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/cursos/', {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });
//       const data = await response.json();
//       setCursos(data);
//     } catch (error) {
//       console.error('Error al cargar cursos:', error);
//       setMessage({ text: 'Error al cargar cursos', type: 'error' });
//     }
//   };

//   useEffect(() => {
//     fetchCursos();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     const accessToken = localStorage.getItem('accessToken');

//     const url = editingCurso ? `http://127.0.0.1:8000/api/cursos/${editingCurso.id}/` : 'http://127.0.0.1:8000/api/cursos/';
//     const method = editingCurso ? 'PUT' : 'POST';

//     const formData = new FormData();
//     formData.append('titulo', titulo);
//     formData.append('descripcion', descripcion);
    
//     if (imagen) {
//       formData.append('imagen', imagen);
//     } else if (eliminarImagen) {
//       formData.append('eliminarImagen', 'true'); // Indica al servidor que elimine la imagen actual
//     }

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: formData,
//       });

//       if (response.ok) {
//         setMessage({ text: editingCurso ? 'Curso actualizado con éxito.' : 'Curso creado con éxito.', type: 'success' });
//         setTitulo('');
//         setDescripcion('');
//         setImagen(null);
//         setImagenActual(null);
//         setEliminarImagen(false); // Restablece el estado de eliminación de imagen
//         setEditingCurso(null);
//         fetchCursos();
//       } else {
//         const errorData = await response.json();
//         setMessage({ text: `Error: ${errorData.detail || 'Problema desconocido'}`, type: 'error' });
//       }
//     } catch (error) {
//       console.error('Error al conectar con el servidor:', error);
//       setMessage({ text: 'Hubo un problema al intentar crear o actualizar el curso.', type: 'error' });
//     }
//   };

//   const handleEdit = (curso) => {
//     setTitulo(curso.titulo);
//     setDescripcion(curso.descripcion);
//     setImagenActual(curso.imagen);
//     setImagen(null);
//     setEliminarImagen(false); // Restablece el estado de eliminación de imagen
//     setEditingCurso(curso);
//   };

//   const handleDeleteImage = () => {
//     setImagenActual(null);
//     setEliminarImagen(true);
//   };

//   const handleDelete = async (id) => {
//     const accessToken = localStorage.getItem('accessToken');
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/cursos/${id}/`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });
//       if (response.ok) {
//         setMessage({ text: 'Curso eliminado con éxito.', type: 'success' });
//         fetchCursos();
//       } else {
//         setMessage({ text: 'Error al eliminar el curso.', type: 'error' });
//       }
//     } catch (error) {
//       console.error('Error al eliminar el curso:', error);
//       setMessage({ text: 'Hubo un problema al intentar eliminar el curso.', type: 'error' });
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>{editingCurso ? 'Editar Curso' : 'Crear Curso'}</h2>
//       <form className="crear-curso-form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="titulo">Título:</label>
//           <input
//             type="text"
//             id="titulo"
//             value={titulo}
//             onChange={(e) => setTitulo(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="descripcion">Descripción:</label>
//           <textarea
//             id="descripcion"
//             value={descripcion}
//             onChange={(e) => setDescripcion(e.target.value)}
//             required
//           ></textarea>
//         </div>
//         <div className="form-group">
//           <label htmlFor="imagen">Imagen:</label>
//           {imagenActual && (
//             <div className="imagen-preview">
//               <p>Imagen actual:</p>
//               <img src={imagenActual} alt="Imagen actual" style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }} />
//               <button type="button" onClick={handleDeleteImage}>Eliminar imagen</button>
//             </div>
//           )}
//           <input
//             type="file"
//             id="imagen"
//             onChange={(e) => {
//               setImagen(e.target.files[0]);
//               setEliminarImagen(false); // No elimina la imagen si se selecciona una nueva
//             }}
//           />
//         </div>
//         <button type="submit" className="create-button">{editingCurso ? 'Actualizar' : 'Crear'}</button>
//       </form>

//       <h2>Lista de Cursos</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Imagen</th>
//             <th>Título</th>
//             <th>Descripción</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {cursos.map((curso) => (
//             <tr key={curso.id}>
//               <td>
//                 {curso.imagen ? (
//                   <img src={curso.imagen} alt="Imagen del curso" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
//                 ) : (
//                   'No disponible'
//                 )}
//               </td>
//               <td>{curso.titulo}</td>
//               <td>{curso.descripcion}</td>
//               <td>
//                 <button onClick={() => handleEdit(curso)}>Editar</button>
//                 <button onClick={() => handleDelete(curso.id)}>Eliminar</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CrearCurso;
import React, { useState, useEffect } from 'react';
import '../styles/CrearCurso.css';

const CrearCurso = ({}) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null); // Estado para la nueva imagen
  const [imagenPreview, setImagenPreview] = useState(null); // Estado para la previsualización de la imagen
  const [cursos, setCursos] = useState([]); 
  const [editingCurso, setEditingCurso] = useState(null); 

  const fetchCursos = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/cursos/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setMessage({ text: 'Error al cargar cursos', type: 'error' });
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setImagenPreview(URL.createObjectURL(file)); // Actualiza la previsualización con la nueva imagen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const accessToken = localStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    const url = editingCurso ? `http://127.0.0.1:8000/api/cursos/${editingCurso.id}/` : 'http://127.0.0.1:8000/api/cursos/';
    const method = editingCurso ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        setMessage({ text: editingCurso ? 'Curso actualizado con éxito.' : 'Curso creado con éxito.', type: 'success' });
        setTitulo('');
        setDescripcion('');
        setImagen(null);
        setImagenPreview(null);
        setEditingCurso(null);
        fetchCursos();
      } else {
        const errorData = await response.json();
        setMessage({ text: `Error: ${errorData.detail || 'Problema desconocido'}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMessage({ text: 'Hubo un problema al intentar crear o actualizar el curso.', type: 'error' });
    }
  };

  const handleEdit = (curso) => {
    setTitulo(curso.titulo);
    setDescripcion(curso.descripcion);
    setImagenPreview(curso.imagen); // Muestra la imagen actual en previsualización
    setEditingCurso(curso);
  };

  const handleDelete = async (id) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cursos/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        setMessage({ text: 'Curso eliminado con éxito.', type: 'success' });
        fetchCursos();
      } else {
        setMessage({ text: 'Error al eliminar el curso.', type: 'error' });
      }
    } catch (error) {
      console.error('Error al eliminar el curso:', error);
      setMessage({ text: 'Hubo un problema al intentar eliminar el curso.', type: 'error' });
    }
  };

  return (
    <div className="form-container">
      <h2>{editingCurso ? 'Editar Curso' : 'Crear Curso'}</h2>
      <form className="crear-curso-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="imagen">Imagen:</label>
          <input type="file" id="imagen" onChange={handleImageChange} />
          {imagenPreview && (
            <div className="image-preview">
              <img src={imagenPreview} alt="Previsualización" />
            </div>
          )}
        </div>
        <button type="submit" className="create-button">{editingCurso ? 'Actualizar' : 'Crear'}</button>
      </form>

      <h2>Lista de Cursos</h2>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.id}>
              <td>{curso.titulo}</td>
              <td>{curso.descripcion}</td>
              <td>
                {curso.imagen && <img src={curso.imagen} alt={curso.titulo} className="image-preview-small" />}
              </td>
              <td>
                <button onClick={() => handleEdit(curso)} className='edit-button'>Editar</button>
                <button onClick={() => handleDelete(curso.id)} className='delete-button'>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrearCurso;
