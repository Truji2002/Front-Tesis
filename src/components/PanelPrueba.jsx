import React, { useState } from 'react';
import ListaPruebas from './ListaPruebas';
import PruebaForm from './PruebaForm';

const PanelPrueba = () => {
  const [view, setView] = useState('list'); // 'list' para lista, 'create' para crear

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="panel-prueba">
      <h2>Panel de Pruebas</h2>
      {view === 'list' && (
        <div>
          <button onClick={() => handleViewChange('create')}>
            Crear Nueva Prueba
          </button>
          <ListaPruebas onEdit={(id) => handleViewChange('edit', id)} />
        </div>
      )}
      {view === 'create' && (
        <PruebaForm
          onCancel={() => handleViewChange('list')}
          onSave={() => handleViewChange('list')}
        />
      )}
    </div>
  );
};

export default PanelPrueba;
