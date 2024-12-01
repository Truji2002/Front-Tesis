
// import React, { useState, useEffect, useRef } from 'react';
// import '../styles/AdministrarModulos.css';

// const AdministrarModulos = ({ setMessage }) => {
//   const [subcursos, setSubcursos] = useState([]);
//   const [selectedSubcurso, setSelectedSubcurso] = useState('');
//   const accessToken = localStorage.getItem('accessToken');
//   const [moduloData, setModuloData] = useState({
//     nombre: '',
//     descripcion: '',
//     enlace: '',
//     archivo: null,
//   });
//   const [filePreview, setFilePreview] = useState(null); // Para almacenar la vista previa del archivo
//   const [linkPreview, setLinkPreview] = useState(null); // Para almacenar la vista previa del enlace
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchSubcursos = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/api/subcursos/', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         const data = await response.json();
//         setSubcursos(data);
//       } catch (error) {
//         console.error('Error al cargar subcursos:', error);
//       }
//     };
//     fetchSubcursos();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setModuloData({
//       ...moduloData,
//       [name]: value,
//     });

//     if (name === 'enlace') {
//       if (value.match(/\.(jpeg|jpg|gif|png)$/)) {
//         setLinkPreview(<img src={value} alt="Vista previa de imagen" style={{ maxWidth: '100%', marginTop: '10px' }} />);
//       } else if (value.includes('youtube.com/watch?v=')) {
//         const videoId = value.split('v=')[1];
//         const embedUrl = `https://www.youtube.com/embed/${videoId}`;
//         setLinkPreview(
//           <iframe
//             src={embedUrl}
//             width="100%"
//             height="315"
//             style={{ border: 'none', marginTop: '10px' }}
//             title="Vista previa de video"
//             allowFullScreen
//           ></iframe>
//         );
//       } else {
//         setLinkPreview(<p style={{ marginTop: '10px' }}>Enlace no compatible para vista previa.</p>);
//       }
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setModuloData({
//       ...moduloData,
//       archivo: file,
//     });

//     if (file) {
//       const fileUrl = URL.createObjectURL(file);
//       if (file.type === 'application/pdf') {
//         setFilePreview(
//           <iframe src={fileUrl} width="100%" height="500px" style={{ border: 'none', marginTop: '10px' }} title="Vista previa PDF"></iframe>
//         );
//       } else if (file.type.startsWith('image/')) {
//         setFilePreview(
//           <img src={fileUrl} alt="Vista previa de imagen" style={{ maxWidth: '200px', marginTop: '10px' }} />
//         );
//       } else {
//         setFilePreview(<p style={{ marginTop: '10px' }}>Archivo no compatible para vista previa.</p>);
//       }
//     } else {
//       setFilePreview(null);
//     }
//   };

//   const handleAddModulo = async (e) => {
//     e.preventDefault();
//     if (!selectedSubcurso || !moduloData.nombre) {
//       setMessage({ text: 'Por favor, selecciona un subcurso y proporciona un nombre para el módulo.', type: 'error' });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('subcurso', selectedSubcurso);
//     formData.append('nombre', moduloData.nombre);
//     formData.append('descripcion', moduloData.descripcion);
//     formData.append('enlace', moduloData.enlace);
//     if (moduloData.archivo) {
//       formData.append('archivo', moduloData.archivo);
//     }

//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/modulos/', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: formData,
//       });

//       if (response.ok) {
//         setMessage({ text: 'Módulo creado con éxito.', type: 'success' });
//         setModuloData({
//           nombre: '',
//           descripcion: '',
//           enlace: '',
//           archivo: null,
//         });
//         setFilePreview(null);
//         setLinkPreview(null);
//         if (fileInputRef.current) {
//           fileInputRef.current.value = '';
//         }
//       } else {
//         setMessage({ text: 'Error al crear módulo.', type: 'error' });
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setMessage({ text: 'Hubo un problema al conectar con el servidor.', type: 'error' });
//     }
//   };

//   return (
//     <div>
//       <h2>Administrar Módulos</h2>
//       <form onSubmit={handleAddModulo}>
//         <div>
//           <label>Subcurso:</label>
//           <select value={selectedSubcurso} onChange={(e) => setSelectedSubcurso(e.target.value)}>
//             <option value="">Selecciona un subcurso</option>
//             {subcursos.map((subcurso) => (
//               <option key={subcurso.id} value={subcurso.id}>{subcurso.nombre}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label>Nombre del Módulo:</label>
//           <input
//             type="text"
//             name="nombre"
//             value={moduloData.nombre}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Descripción:</label>
//           <textarea
//             name="descripcion"
//             value={moduloData.descripcion}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Enlace:</label>
//           <input
//             type="url"
//             name="enlace"
//             value={moduloData.enlace}
//             onChange={handleInputChange}
//           />
//           {linkPreview && (
//             <div style={{ marginTop: '10px' }}>
//               <strong>Vista previa del enlace:</strong>
//               {linkPreview}
//             </div>
//           )}
//         </div>
//         <div>
//           <label>Archivo:</label>
//           <input type="file" onChange={handleFileChange} ref={fileInputRef} />
//           {filePreview && (
//             <div style={{ marginTop: '10px' }}>
//               <strong>Vista previa del archivo:</strong>
//               {filePreview}
//             </div>
//           )}
//         </div>
//         <button type="submit" className="create-button">Crear Módulo</button>
//       </form>
//     </div>
//   );
// };

// export default AdministrarModulos;
import React, { useState, useEffect, useRef } from 'react';
import '../styles/AdministrarModulos.css';

const AdministrarModulos = ({  }) => {
  const [subcursos, setSubcursos] = useState([]);
  const [selectedSubcurso, setSelectedSubcurso] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const [moduloData, setModuloData] = useState({
    nombre: '',
    descripcion: '',
    enlace: '',
    archivo: null,
  });
  const [filePreview, setFilePreview] = useState(null);
  const [linkPreview, setLinkPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchSubcursos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/subcursos/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setSubcursos(data);
      } catch (error) {
        console.error('Error al cargar subcursos:', error);
      }
    };
    fetchSubcursos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModuloData({
      ...moduloData,
      [name]: value,
    });

    if (name === 'enlace') {
      if (value.match(/\.(jpeg|jpg|gif|png)$/)) {
        setLinkPreview(<img src={value} alt="Vista previa de imagen" style={{ maxWidth: '100%', marginTop: '10px' }} />);
      } else if (value.includes('youtube.com/watch?v=')) {
        const videoId = value.split('v=')[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        setLinkPreview(
          <iframe
            src={embedUrl}
            width="100%"
            height="315"
            style={{ border: 'none', marginTop: '10px' }}
            title="Vista previa de video"
            allowFullScreen
          ></iframe>
        );
      } else {
        setLinkPreview(<p style={{ marginTop: '10px' }}>Enlace no compatible para vista previa.</p>);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setModuloData({
      ...moduloData,
      archivo: file,
    });

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      if (file.type === 'application/pdf') {
        setFilePreview(
          <iframe src={fileUrl} width="100%" height="500px" style={{ border: 'none', marginTop: '10px' }} title="Vista previa PDF"></iframe>
        );
      } else if (file.type.startsWith('image/')) {
        setFilePreview(
          <img src={fileUrl} alt="Vista previa de imagen" style={{ maxWidth: '200px', marginTop: '10px' }} />
        );
      } else {
        setFilePreview(<p style={{ marginTop: '10px' }}>Archivo no compatible para vista previa.</p>);
      }
    } else {
      setFilePreview(null);
    }
  };

  const handleAddModulo = async (e) => {
    e.preventDefault();
    if (!selectedSubcurso || !moduloData.nombre) {
      setMessage({ text: 'Por favor, selecciona un subcurso y proporciona un nombre para el módulo.', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('subcurso', selectedSubcurso);
    formData.append('nombre', moduloData.nombre);
    formData.append('descripcion', moduloData.descripcion);
    formData.append('enlace', moduloData.enlace);
    if (moduloData.archivo) {
      formData.append('archivo', moduloData.archivo);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/modulos/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        setMessage({ text: 'Módulo creado con éxito.', type: 'success' });
        setModuloData({
          nombre: '',
          descripcion: '',
          enlace: '',
          archivo: null,
        });
        setFilePreview(null);
        setLinkPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setMessage({ text: 'Error al crear módulo.', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Hubo un problema al conectar con el servidor.', type: 'error' });
    }
  };

  return (
    <div className="form-container">
      <h2>Administrar Módulos</h2>
      <form onSubmit={handleAddModulo} className="admin-form">
        <div className="form-group">
          <label>Subcurso:</label>
          <select value={selectedSubcurso} onChange={(e) => setSelectedSubcurso(e.target.value)} required>
            <option value="">Selecciona un subcurso</option>
            {subcursos.map((subcurso) => (
              <option key={subcurso.id} value={subcurso.id}>{subcurso.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Nombre del Módulo:</label>
          <input
            type="text"
            name="nombre"
            value={moduloData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={moduloData.descripcion}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Enlace:</label>
          <input
            type="url"
            name="enlace"
            value={moduloData.enlace}
            onChange={handleInputChange}
          />
          {linkPreview && <div className="preview">{linkPreview}</div>}
        </div>
        <div className="form-group">
          <label>Archivo:</label>
          <input type="file" onChange={handleFileChange} ref={fileInputRef} />
          {filePreview && <div className="preview">{filePreview}</div>}
        </div>
        <button type="submit" className="create-button">Crear Módulo</button>
      </form>
    </div>
  );
};

export default AdministrarModulos;
