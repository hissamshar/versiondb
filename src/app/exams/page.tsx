'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RollLookup from '../components/RollLookup';
import ExamCard from '../components/ExamCard';

interface Exam {
  exam_id: number;
  course_code: string;
  course_name: string;
  exam_type: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_code: string | null;
  exam_section: string | null;
}

interface Student {
  student_id: number;
  roll_number: string;
  name: string;
}

export default function ExamsPage() {
  return (
    <Suspense fallback={<div className="loading"><div className="loading-spinner" /><p>Loading...</p></div>}>
      <ExamsContent />
    </Suspense>
  );
}

function ExamsContent() {
  const searchParams = useSearchParams();
  const roll = searchParams.get('roll');
  const [student, setStudent] = useState<Student | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!roll) return;
    setLoading(true);
    setError('');

    fetch(`/api/exams?roll=${encodeURIComponent(roll)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setStudent(null);
          setExams([]);
        } else {
          setStudent(data.student);
          setExams(data.exams || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch exam schedule');
        setLoading(false);
      });
  }, [roll]);

  const examTypes = ['all', ...new Set(exams.map((e) => e.exam_type))];
  const filtered = filter === 'all' ? exams : exams.filter((e) => e.exam_type === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Exam Schedule</h1>
        <p>Enter your roll number to view your exam datesheet</p>
      </div>

      <div style={{ maxWidth: 600, marginBottom: '2rem' }}>
        <RollLookup targetPage="exams" />
      </div>

      {loading && (
        <div className="loading">
          <div className="loading-spinner" />
          <p>Loading exam schedule...</p>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {student && !loading && (
        <div className="student-card">
          <div className="student-avatar">📝</div>
          <div className="student-info">
            <h2>{student.roll_number}</h2>
            <div className="student-details">
              <span className="student-detail">
                Total exams: <strong>{exams.length}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {exams.length > 0 && (
        <>
          <div className="filter-bar">
            {examTypes.map((type) => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type === 'all' ? 'All Exams' : type}
              </button>
            ))}
          </div>

          <div className="exam-grid">
            {filtered.map((exam) => (
              <ExamCard
                key={exam.exam_id}
                courseCode={exam.course_code}
                courseName={exam.course_name}
                examType={exam.exam_type}
                examDate={exam.exam_date}
                startTime={exam.start_time}
                endTime={exam.end_time}
                roomCode={exam.room_code || undefined}
                section={exam.exam_section || undefined}
              />
            ))}
          </div>
        </>
      )}

      {student && !loading && exams.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No exams found for this student.</p>
        </div>
      )}
    </div>
  );
}
