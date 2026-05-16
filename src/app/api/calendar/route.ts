import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/calendar
// Returns the full academic calendar
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT event_id, week, description, event_date, event_day, event_type, semester
       FROM public.academic_calendar
       ORDER BY event_date`
    );

    return NextResponse.json({ events: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
