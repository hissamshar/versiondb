import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'live' | 'cancelled' | 'exam' | 'event' | 'default' | 'info';
};

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const baseStyle = "px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1.5 w-fit font-semibold";
  
  const variants = {
    live: "bg-green-light text-green",
    cancelled: "bg-red-light text-red",
    exam: "bg-orange-light text-orange",
    event: "bg-bg-slate text-text-slate",
    default: "bg-primary-light text-primary",
    info: "bg-bg-light-blue text-primary",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {variant === 'live' && <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse"></span>}
      {children}
    </span>
  );
}
