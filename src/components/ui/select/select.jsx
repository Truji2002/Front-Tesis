import React from 'react';
import PropTypes from 'prop-types';
import './Select.css';

const Select = ({ children, id, value, onChange, className }) => (
  <select id={id} value={value} onChange={onChange} className={`select ${className}`}>
    {children}
  </select>
);

Select.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Select;
