import React from 'react';
import PropTypes from 'prop-types';
import './input.css';

const Input = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  className = '',
  placeholder = '',
  required = false,
  ...props
}) => (
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default Input;
