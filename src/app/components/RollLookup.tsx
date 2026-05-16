'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SkeletonCard } from './ui/Skeleton';

export const RollLookup = ({ targetPage }: { targetPage: 'timetable' | 'exams' }) => {
  const [roll, setRoll] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [student, setStudent] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/students?roll=${encodeURIComponent(roll.trim())}`);
      const data = await res.json();
      
      if (data.error) {
        setStatus('error');
        setErrorMsg(data.error);
        return;
      }
      
      setStudent(data.student);
      setStatus('success');
      
      // Navigate to the target page with roll parameter
      router.push(`/${targetPage}?roll=${encodeURIComponent(roll.trim())}`);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="roll-input" className="sr-only">Roll Number</label>
        <Input
          id="roll-input"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          placeholder="Enter roll number (e.g. 21i-1234)"
          disabled={status === 'loading'}
        />
        <Button type="submit" disabled={status === 'loading'} aria-label="Lookup Roll Number">
          Lookup
        </Button>
      </form>

      <div className="mt-6" aria-live="polite">
        {status === 'loading' && (
          <div aria-busy="true">
            <SkeletonCard />
          </div>
        )}

        {status === 'error' && (
          <div role="alert" className="bg-error/10 border border-error/20 text-error p-4 rounded-lg flex justify-between items-center">
            <span>{errorMsg}</span>
            <button onClick={() => setStatus('idle')} className="text-sm underline hover:text-white transition-colors">
              Retry
            </button>
          </div>
        )}

        {status === 'success' && student && (
          <Card className="stagger animate-fade-in-up">
            <h3 className="text-xl font-bold text-white">{student.name}</h3>
            <p className="font-mono text-zinc-400 mt-1">{student.roll_number}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-300">
              <span className="bg-white/5 px-2 py-1 rounded-md">Sem: {student.semester}</span>
              <span className="bg-white/5 px-2 py-1 rounded-md">Sec: {student.section}</span>
              <span className="bg-white/5 px-2 py-1 rounded-md">{student.department}</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
