import React from 'react';

export const PageHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold gradient-text mb-2 animate-fade-in-up">{title}</h1>
      {subtitle && <p className="text-zinc-400 text-lg animate-fade-in-up" style={{ animationDelay: '60ms' }}>{subtitle}</p>}
    </div>
  );
};
