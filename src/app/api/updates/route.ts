import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const res = await pool.query('SELECT * FROM live_updates ORDER BY created_at DESC LIMIT 20');
    return NextResponse.json({ updates: res.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, type } = body;

    if (!title || !content || !type) {
      return NextResponse.json({ error: 'Title, content, and type are required' }, { status: 400 });
    }

    const res = await pool.query(
      'INSERT INTO live_updates (title, content, type) VALUES ($1, $2, $3) RETURNING *',
      [title, content, type]
    );

    return NextResponse.json({ update: res.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
