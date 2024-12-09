import React from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = ({ id, name, type = 'text', value, onChange, className, ...props }) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    className={`input ${className}`}
    {...props}
  />
);

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Input;
