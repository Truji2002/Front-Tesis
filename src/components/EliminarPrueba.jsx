const eliminarPrueba = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/pruebas/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (response.ok) {
        // Eliminar la prueba de la lista local
        setPruebas(pruebas.filter(p => p.id !== id));
      } else {
        setError('No se pudo eliminar la prueba.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    }
  };
  