import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/exams?roll=XXXX
// Returns exam schedule for a student
export async function GET(request: NextRequest) {
  const roll = request.nextUrl.searchParams.get('roll');

  if (!roll) {
    return NextResponse.json(
      { error: 'Roll number is required. Use ?roll=23P-0001' },
      { status: 400 }
    );
  }

  try {
    // Fetch student
    const studentResult = await pool.query(
      `SELECT student_id, roll_number, name FROM public.students WHERE roll_number = $1`,
      [roll]
    );

    if (studentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const student = studentResult.rows[0];

    // Fetch exams for enrolled courses
    const examsResult = await pool.query(
      `SELECT 
         es.exam_id, es.exam_type, es.exam_date, es.start_time, es.end_time,
         es.section AS exam_section, es.semester,
         c.course_id, c.course_code, c.course_name, c.credit_hours,
         r.room_code, r.room_name
       FROM public.course_enrollment ce
       JOIN public.exam_schedule es ON es.course_id = ce.course_id AND es.semester = ce.semester
       JOIN public.courses c ON c.course_id = ce.course_id
       LEFT JOIN public.rooms r ON r.room_id = es.room_id
       WHERE ce.student_id = $1 AND ce.status = 'ENROLLED'
       ORDER BY es.exam_date, es.start_time`,
      [student.student_id]
    );

    return NextResponse.json({
      student,
      exams: examsResult.rows,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
