import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "bg-brand-green text-white hover:opacity-90 shadow-md hover:shadow-lg",
    secondary: "bg-white text-brand-dark border border-gray-200 hover:bg-gray-50",
    outline: "border-2 border-brand-green text-brand-green hover:bg-brand-light-green",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

export default Button;