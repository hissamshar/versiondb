interface ExamCardProps {
  courseCode: string;
  courseName: string;
  examType: string;
  examDate: string;
  startTime: string;
  endTime: string;
  roomCode?: string;
  section?: string;
}

export default function ExamCard({
  courseCode,
  courseName,
  examType,
  examDate,
  startTime,
  endTime,
  roomCode,
  section,
}: ExamCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const isUpcoming = new Date(examDate) >= new Date(new Date().toDateString());

  const typeColors: Record<string, string> = {
    Final: 'exam-badge-final',
    Sessional: 'exam-badge-sessional',
    Lab: 'exam-badge-lab',
    Quiz: 'exam-badge-quiz',
  };

  const badgeClass = typeColors[examType] || 'exam-badge-default';

  return (
    <div className={`exam-card ${isUpcoming ? 'exam-card-upcoming' : 'exam-card-past'}`} id={`exam-${courseCode}`}>
      <div className="exam-card-header">
        <div className="exam-card-course">
          <span className="exam-card-code">{courseCode}</span>
          <span className={`exam-badge ${badgeClass}`}>{examType}</span>
        </div>
        <h3 className="exam-card-name">{courseName}</h3>
      </div>
      <div className="exam-card-details">
        <div className="exam-card-detail">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formatDate(examDate)}</span>
        </div>
        <div className="exam-card-detail">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{formatTime(startTime)} — {formatTime(endTime)}</span>
        </div>
        {roomCode && (
          <div className="exam-card-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{roomCode}</span>
          </div>
        )}
        {section && (
          <div className="exam-card-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{section}</span>
          </div>
        )}
      </div>
      {isUpcoming && (
        <div className="exam-card-countdown">
          <span className="exam-card-upcoming-dot"></span>
          Upcoming
        </div>
      )}
    </div>
  );
}
