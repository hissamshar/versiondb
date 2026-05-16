'use client';

import React, { useState } from 'react';
import { loginWithEmail } from './actions';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await loginWithEmail(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto">
      <div className="bg-bg-white w-full rounded-2xl shadow-sm border border-bg-slate p-8 text-center">
        <div className="w-16 h-16 bg-bg-blue-tint text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl">school</span>
        </div>
        
        <h1 className="font-heading text-3xl font-extrabold text-text-dark mb-2">AcademyNC</h1>
        <p className="text-text-muted text-[14px] mb-8">Sign in with your academic email to access your personalized schedule.</p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-[14px] border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="email" className="block text-[12px] font-semibold text-text-slate mb-1 ml-1">Academic Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. i230001@nu.edu.pk"
              required
              className="w-full bg-bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-text-white font-semibold py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-8 text-[12px] text-text-muted">
          For demo purposes, use <strong className="text-text-slate">i230001@nu.edu.pk</strong> to log in as a seeded student.
        </p>
      </div>
    </div>
  );
}
