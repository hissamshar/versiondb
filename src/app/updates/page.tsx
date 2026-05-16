'use client';

import { useState, useEffect, useCallback } from 'react';

interface Update {
  update_id: number;
  title: string;
  message: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formCategory, setFormCategory] = useState('general');
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
    setFormMessage('');
    setFormCategory('general');
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
            message: formMessage,
            category: formCategory,
          }),
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
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
            message: formMessage,
            category: formCategory,
          }),
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          fetchUpdates();
          resetForm();
        }
      }
    } catch {
      setError('Failed to save update');
    }
    setSubmitting(false);
  };

  const handleEdit = (update: Update) => {
    setFormTitle(update.title);
    setFormMessage(update.message);
    setFormCategory(update.category);
    setEditingId(update.update_id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this update?')) return;

    try {
      const res = await fetch(`/api/updates/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        fetchUpdates();
      }
    } catch {
      setError('Failed to delete update');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const categoryIcons: Record<string, string> = {
    academic: '📚',
    schedule: '📅',
    exam: '📝',
    general: '📢',
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Live Updates</h1>
        <p>University announcements and schedule changes</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <button
          className="btn-primary"
          onClick={() => { resetForm(); setShowForm(true); }}
          id="create-update-btn"
        >
          + New Update
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Update' : 'Create Update'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="update-title">Title</label>
                <input
                  id="update-title"
                  className="form-input"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Update title"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="update-message">Message</label>
                <textarea
                  id="update-message"
                  className="form-textarea"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Update message"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="update-category">Category</label>
                <select
                  id="update-category"
                  className="form-select"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="schedule">Schedule</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="loading-spinner" />
          <p>Loading updates...</p>
        </div>
      )}

      {!loading && updates.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📢</div>
          <p>No updates yet. Create one to get started!</p>
        </div>
      )}

      <div className="updates-grid">
        {updates.map((update) => (
          <div key={update.update_id} className="update-card" id={`update-${update.update_id}`}>
            <div className="update-card-header">
              <div>
                <span style={{ marginRight: '0.5rem' }}>
                  {categoryIcons[update.category] || '📢'}
                </span>
                <span className="update-card-title">{update.title}</span>
              </div>
              <span className="update-card-time">{formatDate(update.created_at)}</span>
            </div>
            <p className="update-card-message">{update.message}</p>
            <div className="update-card-actions">
              <button
                className="btn-sm btn-edit"
                onClick={() => handleEdit(update)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn-sm btn-delete"
                onClick={() => handleDelete(update.update_id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
