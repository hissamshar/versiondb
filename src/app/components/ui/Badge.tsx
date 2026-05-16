import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'lecture' | 'lab' | 'exam' | 'holiday' | 'cancelled';
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'lecture', children, ...props }, ref) => {
    const baseStyles = 'text-xs px-2 py-0.5 rounded-md border border-opacity-30 inline-flex items-center justify-center font-medium';
    const variants = {
      lecture: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      lab: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      exam: 'bg-red-500/15 text-red-400 border-red-500/30',
      holiday: 'bg-green-500/15 text-green-400 border-green-500/30',
      cancelled: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
