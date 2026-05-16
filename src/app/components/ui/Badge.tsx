import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'live' | 'cancelled' | 'exam' | 'event' | 'default';
};

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const baseStyle = "px-2 py-0.5 rounded font-label-sm text-[10px] inline-flex items-center gap-1.5 w-fit uppercase font-bold tracking-wider";
  
  const variants = {
    live: "bg-secondary/20 text-secondary border border-secondary/30 shadow-[0_0_10px_rgba(78,222,163,0.2)]",
    cancelled: "bg-error-container/10 text-error border border-error/50",
    exam: "bg-tertiary-container/20 text-tertiary border border-tertiary/30",
    event: "bg-surface-variant text-on-surface-variant border border-outline-variant/30",
    default: "bg-primary-container/20 text-primary border border-primary/30",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {variant === 'live' && <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>}
      {children}
    </span>
  );
}
