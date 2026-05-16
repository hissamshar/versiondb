import React from 'react';

export function PageHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-[22px] font-bold text-text-dark font-heading">{title}</h1>
      <p className="text-[13px] text-text-muted mt-1">{subtitle}</p>
    </div>
  );
}
