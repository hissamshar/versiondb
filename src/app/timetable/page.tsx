'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import RollLookup from '../components/RollLookup';

interface ScheduleSlot {
  schedule_id: number;
  course_code: string;
  course_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  section: string;
  faculty_name: string | null;
  room_code: string | null;
}

interface Student {
  student_id: number;
  roll_number: string;
  name: string;
  program: string;
  batch_year: number;
}

export default function TimetablePage() {
  const searchParams = useSearchParams();
  const roll = searchParams.get('roll');
  const [student, setStudent] = useState<Student | null>(null);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!roll) return;
    setLoading(true);
    setError('');

    fetch(`/api/students?roll=${encodeURIComponent(roll)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setStudent(null);
          setSchedule([]);
        } else {
          setStudent(data.student);
          setSchedule(data.schedule || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch timetable');
        setLoading(false);
      });
  }, [roll]);

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  // Group schedule by day
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const grouped = days
    .map((day) => ({
      day,
      slots: schedule.filter((s) => s.day_of_week === day),
    }))
    .filter((g) => g.slots.length > 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Class Timetable</h1>
        <p>Enter your roll number to view your weekly schedule</p>
      </div>

      <div style={{ maxWidth: 600, marginBottom: '2rem' }}>
        <RollLookup targetPage="timetable" />
      </div>

      {loading && (
        <div className="loading">
          <div className="loading-spinner" />
          <p>Loading timetable...</p>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {student && !loading && (
        <div className="student-card">
          <div className="student-avatar">🎓</div>
          <div className="student-info">
            <h2>{student.roll_number}</h2>
            <div className="student-details">
              <span className="student-detail">
                Program: <strong>{student.program}</strong>
              </span>
              <span className="student-detail">
                Batch: <strong>{student.batch_year}</strong>
              </span>
              <span className="student-detail">
                Classes: <strong>{schedule.length}</strong> slots/week
              </span>
            </div>
          </div>
        </div>
      )}

      {student && !loading && grouped.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No class schedule found for this student.</p>
        </div>
      )}

      {grouped.length > 0 && (
        <div className="timetable-grid">
          {grouped.map(({ day, slots }) => (
            <div key={day} className="timetable-day">
              <div className="timetable-day-label">{dayFullName(day)}</div>
              {slots.map((slot) => (
                <div key={slot.schedule_id} className="timetable-slot">
                  <div className="timetable-time">
                    {formatTime(slot.start_time)}
                    <br />
                    <span style={{ opacity: 0.5 }}>
                      {formatTime(slot.end_time)}
                    </span>
                  </div>
                  <div className="timetable-course-info">
                    <h4>{slot.course_name}</h4>
                    <div className="timetable-course-code">
                      {slot.course_code} · {slot.section}
                    </div>
                  </div>
                  <div className="timetable-meta">
                    {slot.room_code && (
                      <span className="timetable-room">{slot.room_code}</span>
                    )}
                    {slot.faculty_name && (
                      <span className="timetable-faculty">
                        {slot.faculty_name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function dayFullName(d: string) {
  const map: Record<string, string> = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
  };
  return map[d] || d;
}
