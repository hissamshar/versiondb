'use client';

import { useState, useEffect } from 'react';

interface CalendarEvent {
  event_id: number;
  week: string;
  description: string;
  event_date: string;
  event_day: string;
  event_type: string;
  semester: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setEvents(data.events || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load calendar');
        setLoading(false);
      });
  }, []);

  const typeList = ['all', ...new Set(events.map((e) => e.event_type))];
  const filtered = filter === 'all' ? events : events.filter((e) => e.event_type === filter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
    };
  };

  const badgeClass = (type: string) => {
    const map: Record<string, string> = {
      event: 'badge-event',
      deadline: 'badge-deadline',
      exam: 'badge-exam',
      holiday: 'badge-holiday',
    };
    return map[type] || 'badge-event';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Academic Calendar</h1>
        <p>Spring 2026 — Key dates, deadlines, exams, and holidays</p>
      </div>

      {loading && (
        <div className="loading">
          <div className="loading-spinner" />
          <p>Loading calendar...</p>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {!loading && events.length > 0 && (
        <>
          <div className="filter-bar">
            {typeList.map((type) => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type === 'all' ? 'All Events' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
              </button>
            ))}
          </div>

          <div className="calendar-grid">
            {filtered.map((evt) => {
              const d = formatDate(evt.event_date);
              return (
                <div key={evt.event_id} className="calendar-event">
                  <div className="calendar-date">
                    <div className="calendar-date-day">{d.day}</div>
                    <div className="calendar-date-month">{d.month}</div>
                  </div>
                  <div className="calendar-event-info">
                    <h3>{evt.description}</h3>
                    <div className="calendar-event-week">
                      Week {evt.week} · {evt.event_day}
                    </div>
                  </div>
                  <span className={`calendar-type-badge ${badgeClass(evt.event_type)}`}>
                    {evt.event_type}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && events.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">🗓️</div>
          <p>No calendar events found.</p>
        </div>
      )}
    </div>
  );
}
