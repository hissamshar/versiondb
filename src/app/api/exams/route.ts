import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roll = searchParams.get('roll');

  if (!roll) {
    return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
  }

  try {
    // Get student info first
    const studentRes = await pool.query(
      'SELECT student_id, roll_number, name FROM students WHERE roll_number = $1',
      [roll]
    );

    if (studentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = studentRes.rows[0];

    // Get exam schedule
    const examsRes = await pool.query(
      `SELECT es.exam_id, c.course_code, c.course_name, es.exam_type, 
              es.exam_date, es.start_time, es.end_time, r.room_code, es.exam_section as section
       FROM course_enrollment ce
       JOIN exam_schedule es ON ce.course_id = es.course_id
       JOIN courses c ON es.course_id = c.course_id
       LEFT JOIN rooms r ON es.room_id = r.room_id
       WHERE ce.student_id = $1 AND (es.exam_section IS NULL OR es.exam_section = ce.section)
       ORDER BY es.exam_date ASC, es.start_time ASC`,
      [student.student_id]
    );

    return NextResponse.json({
      student,
      exams: examsRes.rows,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
