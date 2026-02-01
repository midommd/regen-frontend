import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 ml-1">
          {label}
        </label>
      )}
      <input
        className={`px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 
          ${error 
            ? 'border-red-500 focus:ring-red-100' 
            : 'border-gray-200 focus:border-[--color-brand-green] focus:ring-green-50'
          } bg-gray-50/50`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 ml-1 font-medium">{error}</span>}
    </div>
  );
};

export default Input;