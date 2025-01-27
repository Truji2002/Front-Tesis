import React from 'react';
import FormInstructor from './FormInstructor';
import { useNavigate } from 'react-router-dom';

const CrearInstructor = () => {
  const navigate = useNavigate();
  // Define la función onSubmit
  const handleInstructorSubmit = () => {
    
    navigate('/instructors');
  };

  return (
    <div className="crear-instructor-container">
      {/* Pasa la función handleInstructorSubmit como onSubmit */}
      <FormInstructor isEdit={false} onSubmit={handleInstructorSubmit} />
    </div>
  );
};

export default CrearInstructor;
