import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/students?roll=XXXX
// Returns student info + their enrolled courses + class schedule
export async function GET(request: NextRequest) {
  const roll = request.nextUrl.searchParams.get('roll');

  if (!roll) {
    return NextResponse.json(
      { error: 'Roll number is required. Use ?roll=23P-0001' },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch student by roll number
    const studentResult = await pool.query(
      `SELECT s.student_id, s.roll_number, s.name, s.program, s.batch_year, s.section,
              d.department_name, d.department_code
       FROM public.students s
       LEFT JOIN public.departments d ON d.department_id = 1
       WHERE s.roll_number = $1`,
      [roll]
    );

    if (studentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const student = studentResult.rows[0];

    // 2. Fetch enrolled courses with class schedule
    const scheduleResult = await pool.query(
      `SELECT 
         cs.schedule_id,
         c.course_id, c.course_code, c.course_name, c.credit_hours, c.course_type,
         cs.day_of_week, cs.start_time, cs.end_time, cs.section, cs.semester,
         f.name AS faculty_name, f.designation, f.photo_url,
         r.room_code, r.room_name, r.room_type
       FROM public.course_enrollment ce
       JOIN public.courses c ON c.course_id = ce.course_id
       JOIN public.class_schedule cs ON cs.course_id = ce.course_id AND cs.section = ce.section AND cs.semester = ce.semester
       LEFT JOIN public.faculty f ON f.faculty_id = cs.faculty_id
       LEFT JOIN public.rooms r ON r.room_id = cs.room_id
       WHERE ce.student_id = $1 AND ce.status = 'ENROLLED'
       ORDER BY 
         CASE cs.day_of_week
           WHEN 'Mon' THEN 1
           WHEN 'Tue' THEN 2
           WHEN 'Wed' THEN 3
           WHEN 'Thu' THEN 4
           WHEN 'Fri' THEN 5
           WHEN 'Sat' THEN 6
         END,
         cs.start_time`,
      [student.student_id]
    );

    // 3. Fetch enrolled courses list
    const enrollmentResult = await pool.query(
      `SELECT 
         c.course_id, c.course_code, c.course_name, c.credit_hours, c.course_type,
         ce.section, ce.semester, ce.status
       FROM public.course_enrollment ce
       JOIN public.courses c ON c.course_id = ce.course_id
       WHERE ce.student_id = $1 AND ce.status = 'ENROLLED'
       ORDER BY c.course_code`,
      [student.student_id]
    );

    return NextResponse.json({
      student,
      enrollments: enrollmentResult.rows,
      schedule: scheduleResult.rows,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
