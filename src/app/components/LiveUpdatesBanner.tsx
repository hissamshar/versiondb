'use client';

import React, { useEffect, useState } from 'react';

export const LiveUpdatesBanner = () => {
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/updates')
      .then((res) => res.json())
      .then((data) => {
        if (data.updates) setUpdates(data.updates);
      })
      .catch(console.error);
  }, []);

  if (updates.length === 0) return null;

  return (
    <div 
      className="sticky top-16 z-30 h-10 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 overflow-hidden flex items-center"
      aria-live="polite"
    >
      <div className="px-4 shrink-0 font-bold tracking-widest text-xs flex items-center gap-2 border-r border-amber-500/20 h-full bg-black/50 z-10">
        <div className="live-dot" />
        LIVE
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full">
        <div className="ticker-track absolute whitespace-nowrap h-full flex items-center">
          {[...updates, ...updates, ...updates].map((update, i) => (
            <React.Fragment key={`${update.id}-${i}`}>
              <span className="px-4 font-medium">{update.title}:</span>
              <span className="opacity-80 pr-8">{update.content}</span>
              <span className="pr-8 opacity-40">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
