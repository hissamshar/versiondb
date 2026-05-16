import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean;
};

export function Card({ className = '', children, hoverable = false, ...props }: CardProps) {
  const baseStyle = "bg-surface-container rounded-lg border border-outline-variant/20 p-5 flex flex-col h-full";
  const hoverStyle = hoverable ? "transition-all duration-300 hover:border-outline-variant/50 hover:shadow-[0_0_15px_rgba(173,198,255,0.05)] hover:-translate-y-0.5" : "";
  
  return (
    <div className={`${baseStyle} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
}
