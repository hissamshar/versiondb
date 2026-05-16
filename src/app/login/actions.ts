'use server'

import pool from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) {
    return { error: 'Email is required' }
  }

  // Expect format: i230001@nu.edu.pk or similar
  const match = email.match(/^([a-z])(\d{2})(\d{4})@.*?nu\.edu\.pk$/i)
  if (!match) {
    return { error: 'Invalid academic email. Must be in format i230001@nu.edu.pk' }
  }

  // Construct roll number: 23I-0001
  const batch = match[2]
  const letter = match[1].toUpperCase()
  const id = match[3]
  const rollNumber = `${batch}${letter}-${id}`

  try {
    const res = await pool.query('SELECT * FROM students WHERE roll_number = $1', [rollNumber])
    if (res.rows.length === 0) {
      return { error: 'No student found with this academic email' }
    }

    const student = res.rows[0]
    
    // Set a simple cookie session (In production, use JWT or NextAuth)
    const cookieStore = await cookies()
    cookieStore.set('auth', JSON.stringify({
      id: student.student_id,
      roll: student.roll_number,
      name: student.name
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    })

  } catch (err) {
    console.error(err)
    return { error: 'Database error occurred' }
  }

  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('auth')
  redirect('/login')
}
