'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '../components/layout/Container';
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

  // Form state
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
      if (editingId) {
        // PUT update
        const res = await fetch(`/api/updates/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle,
            content: formContent,
            type: formType,
          }),
        });
        const data = await res.json();
        if (data.error) setError(data.error);
        else {
          fetchUpdates();
          resetForm();
        }
      } else {
        // POST new update
        const res = await fetch('/api/updates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle,
            content: formContent,
            type: formType,
          }),
        });
        const data = await res.json();
        if (data.error) setError(data.error);
        else {
          fetchUpdates();
          resetForm();
        }
      }
    } catch {
      setError('Failed to save update');
    }
    setSubmitting(false);
  };

  const handleEdit = (update: any) => {
    setFormTitle(update.title);
    setFormContent(update.content);
    setFormType(update.type);
    setEditingId(update.id);
    setShowForm(true);
    // Scroll to top where form will appear
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
      academic: 'lecture',
      schedule: 'cancelled',
      exam: 'exam',
      general: 'holiday',
    };
    return map[type] || 'lecture';
  };

  return (
    <Container className="py-16">
      <PageHeader 
        title="Live Updates" 
        subtitle="University announcements and schedule changes" 
      />

      <div className="mb-10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">All Updates</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ New Update</Button>
        )}
      </div>

      {error && (
        <div role="alert" className="mb-8 bg-error/10 border border-error/20 text-error p-4 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <Card className="mb-12 animate-fade-in-up border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingId ? 'Edit Update' : 'Create New Update'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter title"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-zinc-400 mb-1">Content</label>
              <textarea
                id="content"
                className="w-full rounded-lg py-3 px-4 bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-colors min-h-[120px]"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Enter update content"
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-zinc-400 mb-1">Type</label>
              <select
                id="type"
                className="w-full rounded-lg py-3 px-4 bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-colors appearance-none"
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              >
                <option value="general" className="bg-surface-2">General</option>
                <option value="academic" className="bg-surface-2">Academic</option>
                <option value="schedule" className="bg-surface-2">Schedule</option>
                <option value="exam" className="bg-surface-2">Exam</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
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
        <Card className="text-center py-12">
          <span className="text-4xl mb-4 block">📢</span>
          <p className="text-zinc-400 text-lg">No updates yet. Create one to get started!</p>
        </Card>
      )}

      <div className="space-y-6 stagger">
        {updates.map((update) => (
          <Card key={update.id} className="animate-fade-in-up">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <Badge variant={getBadgeVariant(update.type) as any} className="capitalize">
                  {update.type}
                </Badge>
                <h3 className="text-lg font-bold text-white leading-tight">{update.title}</h3>
              </div>
              <span className="text-sm text-zinc-500 font-mono">
                {new Date(update.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
            <p className="text-zinc-400 mb-6">{update.content}</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleEdit(update)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(update.id)} className="hover:text-error hover:bg-error/10">
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
