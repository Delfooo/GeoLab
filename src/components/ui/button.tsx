// src/components/ui/button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button 
      className={`btn-gold w-full flex gap-2 items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};