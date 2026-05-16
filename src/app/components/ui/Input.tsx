import React, { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`w-full bg-surface-container-low border border-outline-variant/40 rounded py-2 px-3 font-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-tertiary-container focus:ring-1 focus:ring-tertiary-container/50 transition-all shadow-[0_0_15px_rgba(128,131,255,0.05)] focus:shadow-[0_0_20px_rgba(128,131,255,0.15)] ${className}`}
      {...props}
    />
  );
}
