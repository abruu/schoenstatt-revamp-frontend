import { NextRequest, NextResponse } from 'next/server'
import { checkStudentExists } from '@/lib/strapi-api'

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json()

    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Email and phone are required' },
        { status: 400 }
      )
    }

    // Check for existing student with same email or phone
    const result = await checkStudentExists(email.toLowerCase().trim(), phone.trim())

    return NextResponse.json(result)

  } catch (error) {
    console.error('Duplicate check error:', error)
    return NextResponse.json(
      { error: 'Failed to check for duplicates' },
      { status: 500 }
    )
  }
}
