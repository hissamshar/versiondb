import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// PUT /api/updates/[id]
// Edit an existing live update
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updateId = parseInt(id, 10);

  if (isNaN(updateId)) {
    return NextResponse.json(
      { error: 'Invalid update ID' },
      { status: 400 }
    );
  }

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
      `UPDATE public.live_updates
       SET title = $1, message = $2, category = $3, updated_at = NOW()
       WHERE update_id = $4
       RETURNING update_id, title, message, category, created_at, updated_at`,
      [title, message, category || 'general', updateId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Update not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ update: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/updates/[id]
// Delete a live update
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updateId = parseInt(id, 10);

  if (isNaN(updateId)) {
    return NextResponse.json(
      { error: 'Invalid update ID' },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      `DELETE FROM public.live_updates WHERE update_id = $1 RETURNING update_id`,
      [updateId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Update not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
