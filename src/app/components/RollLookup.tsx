'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RollLookupProps {
  targetPage: 'timetable' | 'exams';
  placeholder?: string;
}

export default function RollLookup({ targetPage, placeholder }: RollLookupProps) {
  const [roll, setRoll] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = roll.trim().toUpperCase();

    if (!trimmed) {
      setError('Please enter your roll number');
      return;
    }

    // Basic validation for FAST-NU roll format
    if (!/^\d{2}[A-Z]-\d{4}$/.test(trimmed)) {
      setError('Invalid format. Use format like 23P-0001');
      return;
    }

    setError('');
    router.push(`/${targetPage}?roll=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="roll-lookup-form">
      <div className="roll-lookup-input-group">
        <div className="roll-lookup-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <input
          type="text"
          id="roll-input"
          value={roll}
          onChange={(e) => {
            setRoll(e.target.value);
            setError('');
          }}
          placeholder={placeholder || 'Enter roll number (e.g. 23P-0001)'}
          className="roll-lookup-input"
          autoComplete="off"
        />
        <button type="submit" className="roll-lookup-btn" id="roll-lookup-submit">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Look Up</span>
        </button>
      </div>
      {error && <p className="roll-lookup-error">{error}</p>}
    </form>
  );
}
