'use client';

import { useEffect, useState } from 'react';

interface Update {
  update_id: number;
  title: string;
  message: string;
  category: string;
  created_at: string;
}

export default function LiveUpdatesBanner() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/updates')
      .then((res) => res.json())
      .then((data) => {
        if (data.updates) {
          setUpdates(data.updates.slice(0, 5));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (updates.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % updates.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [updates.length]);

  if (loading) {
    return (
      <div className="live-banner">
        <div className="live-banner-pulse">
          <span className="live-dot"></span>
          <span>Loading updates...</span>
        </div>
      </div>
    );
  }

  if (updates.length === 0) return null;

  const current = updates[currentIndex];

  const categoryIcons: Record<string, string> = {
    academic: '📚',
    schedule: '📅',
    exam: '📝',
    general: '📢',
  };

  return (
    <div className="live-banner" id="live-updates-banner">
      <div className="live-banner-content">
        <div className="live-banner-label">
          <span className="live-dot"></span>
          <span>LIVE</span>
        </div>
        <div className="live-banner-text">
          <span className="live-banner-icon">{categoryIcons[current.category] || '📢'}</span>
          <strong>{current.title}</strong>
          <span className="live-banner-separator">—</span>
          <span>{current.message}</span>
        </div>
        {updates.length > 1 && (
          <div className="live-banner-dots">
            {updates.map((_, i) => (
              <button
                key={i}
                className={`live-banner-dot-btn ${i === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Show update ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
