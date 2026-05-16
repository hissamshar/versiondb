'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formType, setFormType] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  const fetchUpdates = useCallback(() => {
    fetch('/api/updates')
      .then((res) => res.json())
      .then((data) => {
        if (data.updates) setUpdates(data.updates);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load updates');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormType('general');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingId ? `/api/updates/${editingId}` : '/api/updates';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle, content: formContent, type: formType }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        fetchUpdates();
        resetForm();
      }
    } catch {
      setError('Failed to save update');
    }
    setSubmitting(false);
  };

  const handleEdit = (update: any) => {
    setFormTitle(update.title);
    setFormContent(update.message);
    setFormType(update.category);
    setEditingId(update.update_id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this update?')) return;
    try {
      const res = await fetch(`/api/updates/${id}`, { method: 'DELETE' });
      if (res.status === 204) {
        fetchUpdates();
      } else {
        const data = await res.json();
        if (data.error) setError(data.error);
      }
    } catch {
      setError('Failed to delete update');
    }
  };

  const getBadgeVariant = (type: string) => {
    const map: Record<string, string> = {
      academic: 'default',
      schedule: 'cancelled',
      exam: 'exam',
      general: 'event',
    };
    return map[type] || 'event';
  };

  return (
    <>
      <PageHeader 
        title="Live Updates" 
        subtitle="University announcements and schedule changes" 
      />

      <div className="mb-10 flex justify-between items-center">
        <h2 className="font-headline-md text-[20px] text-on-surface">All Updates</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="primary">+ New Update</Button>
        )}
      </div>

      {error && (
        <div role="alert" className="mb-8 bg-error-container/10 border border-error/20 text-error p-4 rounded-lg font-body-md">
          {error}
        </div>
      )}

      {showForm && (
        <Card className="mb-12 animate-fade-in-up">
          <h3 className="font-headline-md text-[20px] text-on-surface mb-4">
            {editingId ? 'Edit Update' : 'Create New Update'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block font-label-md text-on-surface-variant mb-1">Title</label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter title"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block font-label-md text-on-surface-variant mb-1">Content</label>
              <textarea
                id="content"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded py-2 px-3 font-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-tertiary-container focus:ring-1 focus:ring-tertiary-container/50 min-h-[120px]"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Enter update content"
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block font-label-md text-on-surface-variant mb-1">Type</label>
              <select
                id="type"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded py-2 px-3 font-body-md text-on-surface focus:outline-none focus:border-tertiary-container focus:ring-1 focus:ring-tertiary-container/50 appearance-none"
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              >
                <option value="general" className="bg-surface">General</option>
                <option value="academic" className="bg-surface">Academic</option>
                <option value="schedule" className="bg-surface">Schedule</option>
                <option value="exam" className="bg-surface">Exam</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Publish'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading && (
        <div aria-busy="true" className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && updates.length === 0 && (
        <Card className="text-center py-12 flex flex-col items-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4">notifications_off</span>
          <p className="text-on-surface-variant font-body-md">No updates yet. Create one to get started!</p>
        </Card>
      )}

      <div className="space-y-6 stagger">
        {updates.map((update) => (
          <Card key={update.update_id} className="animate-fade-in-up relative border-l-4" style={{
            borderLeftColor: update.category === 'exam' ? 'var(--color-tertiary)' : 
                             update.category === 'schedule' ? 'var(--color-error)' : 
                             update.category === 'academic' ? 'var(--color-primary)' : 'var(--color-outline-variant)'
          }}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <Badge variant={getBadgeVariant(update.category) as any}>{update.category}</Badge>
                <h3 className="font-headline-md text-[18px] text-on-surface leading-tight">{update.title}</h3>
              </div>
              <span className="font-label-sm text-outline">
                {new Date(update.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
            <p className="text-on-surface-variant font-body-md mb-6">{update.message}</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleEdit(update)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(update.update_id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
