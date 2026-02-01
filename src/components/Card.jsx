import React from 'react';

const Card = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`
      bg-white rounded-2xl border border-gray-100 overflow-hidden
      ${hoverEffect ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : 'shadow-sm'}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;