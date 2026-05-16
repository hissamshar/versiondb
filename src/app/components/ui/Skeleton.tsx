import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-5 w-full h-[180px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div className="w-24 h-5 skeleton"></div>
        <div className="w-16 h-4 skeleton"></div>
      </div>
      <div className="space-y-3">
        <div className="w-3/4 h-6 skeleton"></div>
        <div className="w-1/2 h-4 skeleton"></div>
      </div>
      <div className="mt-auto flex gap-3">
        <div className="w-20 h-8 skeleton"></div>
        <div className="w-20 h-8 skeleton"></div>
      </div>
    </div>
  );
}
