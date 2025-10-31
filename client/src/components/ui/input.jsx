// src/components/ui/Input.jsx

import React from 'react';

const Input = React.forwardRef(({ type = 'text', className = '', ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
      {...props}
    />
  );
});

export default Input;