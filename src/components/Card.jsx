// src/components/Card.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ img, alt, title, description }) => (
  <div className="max-w-sm bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <img className="w-full h-48 object-cover rounded-t-lg" src={img} alt={alt} />
    <div className="p-6">
      <h2 className="text-xl font-semibold text-primary mb-2">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  </div>
);

Card.propTypes = {
  img: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Card;
