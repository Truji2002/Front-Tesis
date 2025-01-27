// src/components/ui/label/Label.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './label.css';

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="custom-label">
    {children}
  </label>
);

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Label;
