// src/components/ui/input/Input.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = ({ id, name, type = 'text', value, onChange, className, placeholder, required, ...props }) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    className={`custom-input ${className}`}
    placeholder={placeholder}
    required={required}
    {...props}
  />
);

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

Input.defaultProps = {
  type: 'text',
  className: '',
  placeholder: '',
  required: false,
};

export default Input;
