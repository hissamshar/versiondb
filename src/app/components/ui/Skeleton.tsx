import React from 'react';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: string;
  height?: string;
};

export const Skeleton = ({ className = '', width, height, ...props }: SkeletonProps) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
};

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height="1rem"
        className={i === lines - 1 ? 'w-2/3' : 'w-full'}
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className="rounded-xl glass p-6 space-y-4">
    <Skeleton className="h-6 w-1/3" />
    <SkeletonText lines={2} />
    <Skeleton className="h-10 w-full mt-4 rounded-lg" />
  </div>
);
