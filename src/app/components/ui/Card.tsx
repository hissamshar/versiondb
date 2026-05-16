import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', glow = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-xl glass p-6 transition-all duration-300 hover:border-white/15';
    const glowStyles = glow ? 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]' : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${glowStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
