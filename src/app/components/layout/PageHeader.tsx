import React from 'react';

export function PageHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="mb-8 border-b border-outline-variant/20 pb-4">
      <h1 className="font-headline-lg text-on-surface">{title}</h1>
      <p className="font-body-md text-on-surface-variant mt-2">{subtitle}</p>
    </div>
  );
}
