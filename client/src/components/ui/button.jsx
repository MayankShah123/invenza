// src/components/ui/Button.jsx

import React from 'react';

const baseStyles = "inline-flex items-center justify-center px-4 py-2 border rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50";

const variants = {
  primary: "border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
  secondary: "border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500",
  danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
  outline: "border-gray-300 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-indigo-500",
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;