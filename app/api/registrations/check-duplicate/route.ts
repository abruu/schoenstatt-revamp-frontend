import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json()

    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Email and phone are required' },
        { status: 400 }
      )
    }

    // Check for existing registration with same email
    const { data: emailExists, error: emailError } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .limit(1)

    if (emailError && emailError.code !== 'PGRST116') {
      console.error('Email check error:', emailError)
      return NextResponse.json(
        { error: 'Failed to check email duplicates' },
        { status: 500 }
      )
    }

    if (emailExists && emailExists.length > 0) {
      return NextResponse.json({
        exists: true,
        field: 'email address'
      })
    }

    // Check for existing registration with same phone
    const { data: phoneExists, error: phoneError } = await supabase
      .from('registrations')
      .select('id')
      .eq('phone', phone.trim())
      .limit(1)

    if (phoneError && phoneError.code !== 'PGRST116') {
      console.error('Phone check error:', phoneError)
      return NextResponse.json(
        { error: 'Failed to check phone duplicates' },
        { status: 500 }
      )
    }

    if (phoneExists && phoneExists.length > 0) {
      return NextResponse.json({
        exists: true,
        field: 'phone number'
      })
    }

    return NextResponse.json({
      exists: false
    })

  } catch (error) {
    console.error('Duplicate check error:', error)
    return NextResponse.json(
      { error: 'Failed to check for duplicates' },
      { status: 500 }
    )
  }
}
