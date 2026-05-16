import React, { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`w-full bg-bg-white border border-border rounded-lg py-2.5 px-3 text-[13px] text-text-primary placeholder-text-subdued focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${className}`}
      {...props}
    />
  );
}
