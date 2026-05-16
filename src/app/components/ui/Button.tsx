import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-bold font-label-md transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-fixed rounded",
    secondary: "bg-surface-container text-on-surface hover:bg-surface-variant border border-outline-variant/50 rounded",
    ghost: "bg-transparent text-on-surface-variant hover:bg-surface-variant/50 border border-outline-variant/30 hover:border-outline-variant/50 rounded",
    danger: "bg-error/10 text-error hover:bg-error/20 border border-error/20 rounded",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-4 py-2 text-[12px]",
    lg: "px-6 py-3 text-[14px]",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
