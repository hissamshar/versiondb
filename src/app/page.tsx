import Link from 'next/link';
import LiveUpdatesBanner from './components/LiveUpdatesBanner';

export default function Home() {
  return (
    <div className="page-container">
      <LiveUpdatesBanner />

      <section className="hero">
        <h1>EasyTimetable</h1>
        <p>
          Your one-stop hub for class schedules, exam datesheets, academic
          calendar, and live university updates — built for FAST-NUCES Peshawar.
        </p>
      </section>

      <div className="feature-grid">
        <Link href="/timetable" className="feature-card" id="feature-timetable">
          <div className="feature-icon">📅</div>
          <h3>Class Timetable</h3>
          <p>
            Look up your weekly class schedule by roll number. See rooms,
            faculty, and timings at a glance.
          </p>
        </Link>

        <Link href="/exams" className="feature-card" id="feature-exams">
          <div className="feature-icon">📝</div>
          <h3>Exam Schedule</h3>
          <p>
            View your personalized exam datesheet — sessionals, finals, and lab
            exams with rooms and timings.
          </p>
        </Link>

        <Link href="/calendar" className="feature-card" id="feature-calendar">
          <div className="feature-icon">🗓️</div>
          <h3>Academic Calendar</h3>
          <p>
            Stay on top of deadlines, holidays, exam weeks, and key academic
            events for the semester.
          </p>
        </Link>

        <Link href="/updates" className="feature-card" id="feature-updates">
          <div className="feature-icon">📢</div>
          <h3>Live Updates</h3>
          <p>
            Real-time announcements about schedule changes, exam notices, and
            important university news.
          </p>
        </Link>
      </div>
    </div>
  );
}
