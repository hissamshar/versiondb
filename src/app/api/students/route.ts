import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let roll = searchParams.get('roll');

  // If roll=self, resolve from auth cookie
  if (roll === 'self') {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    if (authCookie) {
      try {
        const parsed = JSON.parse(authCookie.value);
        roll = parsed.roll;
      } catch { /* fallback */ }
    }
  }

  if (!roll) {
    return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
  }

  try {
    // Get student info
    const studentRes = await pool.query(
      `SELECT s.student_id, s.roll_number, s.name, s.batch_year as batch, s.program as department, 
              e.semester, e.section
       FROM students s
       LEFT JOIN course_enrollment e ON s.student_id = e.student_id
       WHERE s.roll_number = $1
       LIMIT 1`,
      [roll]
    );

    if (studentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = studentRes.rows[0];

    // Get weekly schedule
    const scheduleRes = await pool.query(
      `SELECT cs.schedule_id, c.course_code, c.course_name, cs.day_of_week, 
              cs.start_time, cs.end_time, cs.section, f.name as faculty_name, r.room_code
       FROM course_enrollment ce
       JOIN class_schedule cs ON ce.course_id = cs.course_id AND ce.section = cs.section
       JOIN courses c ON cs.course_id = c.course_id
       LEFT JOIN faculty f ON cs.faculty_id = f.faculty_id
       LEFT JOIN rooms r ON cs.room_id = r.room_id
       WHERE ce.student_id = $1`,
      [student.student_id]
    );

    // Get enrolled courses (distinct)
    const coursesRes = await pool.query(
      `SELECT DISTINCT c.course_id, c.course_code, c.course_name
       FROM course_enrollment ce
       JOIN courses c ON ce.course_id = c.course_id
       WHERE ce.student_id = $1
       ORDER BY c.course_name ASC`,
      [student.student_id]
    );

    return NextResponse.json({
      student,
      schedule: scheduleRes.rows,
      courses: coursesRes.rows,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
