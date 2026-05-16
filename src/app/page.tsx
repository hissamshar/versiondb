import React from 'react';
import pool from '@/lib/db';
import { RollLookup } from './components/RollLookup';
import { LiveUpdatesBanner } from './components/LiveUpdatesBanner';
import { Container } from './components/layout/Container';
import { Card } from './components/ui/Card';
import Link from 'next/link';

async function getStats() {
  try {
    const studentsRes = await pool.query('SELECT COUNT(*) FROM students');
    const coursesRes = await pool.query('SELECT COUNT(*) FROM courses');
    const facultyRes = await pool.query('SELECT COUNT(*) FROM faculty');
    
    return {
      students: parseInt(studentsRes.rows[0].count, 10),
      courses: parseInt(coursesRes.rows[0].count, 10),
      faculty: parseInt(facultyRes.rows[0].count, 10),
    };
  } catch (err) {
    console.error('Failed to fetch stats', err);
    return { students: 0, courses: 0, faculty: 0 };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <>
      <LiveUpdatesBanner />
      <Container className="py-16 lg:py-24">
        {/* Hero Section */}
        <section className="text-center mb-24 max-w-3xl mx-auto stagger">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight animate-fade-in-up">
            Your Schedule, <br />
            <span className="gradient-text">Simplified.</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
            The all-in-one timetable, exam, and event manager for FAST-NUCES. Look up your schedule instantly.
          </p>
          <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            <RollLookup targetPage="timetable" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            <Card className="text-center animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <div className="text-4xl font-bold text-white mb-2">{stats.students.toLocaleString()}</div>
              <div className="text-zinc-400 font-medium">Active Students</div>
            </Card>
            <Card className="text-center animate-fade-in-up" style={{ animationDelay: '60ms' }}>
              <div className="text-4xl font-bold text-white mb-2">{stats.courses.toLocaleString()}</div>
              <div className="text-zinc-400 font-medium">Courses Offered</div>
            </Card>
            <Card className="text-center animate-fade-in-up" style={{ animationDelay: '120ms' }}>
              <div className="text-4xl font-bold text-white mb-2">{stats.faculty.toLocaleString()}</div>
              <div className="text-zinc-400 font-medium">Faculty Members</div>
            </Card>
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/timetable">
              <Card glow className="h-full flex flex-col justify-center items-center text-center">
                <span className="text-4xl mb-4">📅</span>
                <h3 className="text-lg font-bold text-white mb-2">Class Timetable</h3>
                <p className="text-sm text-zinc-400">View your weekly class schedule, rooms, and faculty.</p>
              </Card>
            </Link>
            <Link href="/exams">
              <Card glow className="h-full flex flex-col justify-center items-center text-center">
                <span className="text-4xl mb-4">📝</span>
                <h3 className="text-lg font-bold text-white mb-2">Exam Schedule</h3>
                <p className="text-sm text-zinc-400">Find your sessionals and final exam datesheets.</p>
              </Card>
            </Link>
            <Link href="/calendar">
              <Card glow className="h-full flex flex-col justify-center items-center text-center">
                <span className="text-4xl mb-4">🗓️</span>
                <h3 className="text-lg font-bold text-white mb-2">Academic Calendar</h3>
                <p className="text-sm text-zinc-400">Stay updated on important semester events and holidays.</p>
              </Card>
            </Link>
            <Link href="/updates">
              <Card glow className="h-full flex flex-col justify-center items-center text-center">
                <span className="text-4xl mb-4">📢</span>
                <h3 className="text-lg font-bold text-white mb-2">Live Updates</h3>
                <p className="text-sm text-zinc-400">Read the latest announcements and schedule changes.</p>
              </Card>
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
