'use server'

import pool from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) {
    return { error: 'Email is required' }
  }

  // Extract the part before @
  const prefix = email.split('@')[0].toLowerCase()
  
  // Extract all letters and digits from the prefix
  const letters = prefix.replace(/[^a-z]/g, '')
  const digits = prefix.replace(/[^0-9]/g, '')
  
  if (digits.length < 6 || letters.length === 0) {
    return { error: 'Invalid academic email. Must contain batch year, campus letter, and ID.' }
  }

  // Assuming batch is first 2 digits, id is last 4 digits, letter is the first letter found
  const batch = digits.substring(0, 2)
  const id = digits.substring(digits.length - 4)
  const letter = letters[0].toUpperCase()
  
  const rollWithHyphen = `${batch}${letter}-${id}`
  const rollWithoutHyphen = `${batch}${letter}${id}`

  try {
    const res = await pool.query(
      'SELECT * FROM students WHERE UPPER(roll_number) = $1 OR UPPER(roll_number) = $2 OR REPLACE(UPPER(roll_number), \'-\', \'\') = $2', 
      [rollWithHyphen, rollWithoutHyphen]
    )
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
