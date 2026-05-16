import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/updates
// Returns all live updates ordered by most recent
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT update_id, title, message, category, created_at, updated_at
       FROM public.live_updates
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ updates: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/updates
// Create a new live update
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, category } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO public.live_updates (title, message, category)
       VALUES ($1, $2, $3)
       RETURNING update_id, title, message, category, created_at, updated_at`,
      [title, message, category || 'general']
    );

    return NextResponse.json(
      { update: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
