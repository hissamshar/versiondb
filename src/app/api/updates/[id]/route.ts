import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updateId = parseInt(id, 10);

  if (isNaN(updateId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, content, type } = body;

    if (!title || !content || !type) {
      return NextResponse.json({ error: 'Title, content, and type are required' }, { status: 400 });
    }

    const res = await pool.query(
      'UPDATE live_updates SET title=$1, content=$2, type=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [title, content, type, updateId]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    return NextResponse.json({ update: res.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updateId = parseInt(id, 10);

  if (isNaN(updateId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const res = await pool.query('DELETE FROM live_updates WHERE id=$1', [updateId]);

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
