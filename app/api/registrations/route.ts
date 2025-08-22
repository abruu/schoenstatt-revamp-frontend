import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY!)

// Helper function to mask Aadhaar number
function maskAadhaar(aadhaar: string): string {
  return `XXXX-XXXX-${aadhaar.slice(-4)}`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const photo = formData.get('photo') as File
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const dateOfBirthRaw = formData.get('dateOfBirth') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    
    // Convert DD/MM/YYYY to YYYY-MM-DD for database storage
    const convertDateFormat = (ddmmyyyy: string): string => {
      const [day, month, year] = ddmmyyyy.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    
    const dateOfBirth = convertDateFormat(dateOfBirthRaw)
    const address = formData.get('address') as string
    const parentName = formData.get('parentName') as string
    const parentContact = formData.get('parentContact') as string
    const aadhaarNumber = formData.get('aadhaarNumber') as string
    const center = formData.get('center') as string
    const courseLevel = formData.get('courseLevel') as string

    // Validate required fields
    if (!photo || !firstName || !lastName || !dateOfBirth || !email || !phone || 
        !address || !parentName || !parentContact || !aadhaarNumber || !center || !courseLevel) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(photo.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.' },
        { status: 400 }
      )
    }

    if (photo.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json(
        { error: 'File size too large. Please upload an image smaller than 5MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename for photo
    const fileExtension = photo.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`
    
    // Convert file to buffer
    const buffer = Buffer.from(await photo.arrayBuffer())

    // Upload photo to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, buffer, {
        contentType: photo.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload photo' },
        { status: 500 }
      )
    }

    // Insert registration data into database
    const { data: registrationData, error: insertError } = await supabase
      .from('registrations')
      .insert({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        email: email,
        phone: phone,
        address: address,
        parent_name: parentName,
        parent_contact: parentContact,
        aadhaar_number: aadhaarNumber,
        center: center,
        course_level: courseLevel,
        photo_path: uploadData.path,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Detailed insert error:', {
        error: insertError,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      })
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('photos').remove([fileName])
      return NextResponse.json(
        { 
          error: 'Failed to save registration data',
          details: insertError.message,
          hint: insertError.hint,
          code: insertError.code
        },
        { status: 500 }
      )
    }

    // Get center email from centers table
    const { data: centerData, error: centerError } = await supabase
      .from('centers')
      .select('email, name')
      .eq('id', center)
      .single()

    if (centerError) {
      console.error('Center lookup error:', centerError)
      // Registration is saved, but we'll continue without sending email
    }

    // Generate signed URL for photo (7 days expiry)
    const { data: signedUrlData } = await supabase.storage
      .from('photos')
      .createSignedUrl(uploadData.path, 7 * 24 * 60 * 60) // 7 days in seconds

    // Debug email sending conditions
    console.log('Email sending debug:', {
      hasCenterData: !!centerData,
      centerEmail: centerData?.email,
      hasSignedUrl: !!signedUrlData?.signedUrl,
      resendFrom: process.env.RESEND_FROM,
      resendApiKey: process.env.RESEND_API_KEY ? 'Set' : 'Missing'
    })

    // Send email notification if center email is found
    if (centerData?.email && signedUrlData?.signedUrl) {
      try {
        // Clean and validate the email address
        const cleanEmail = centerData.email.trim().toLowerCase()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if (!emailRegex.test(cleanEmail)) {
          console.error('Invalid email format:', cleanEmail)
          throw new Error(`Invalid email format: ${cleanEmail}`)
        }
        
        console.log('Attempting to send email to:', cleanEmail)
        const emailResult = await resend.emails.send({
          from: process.env.RESEND_FROM!,
          to: cleanEmail,
          subject: `New Registration - ${firstName} ${lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Student Registration</h2>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Student Information</h3>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Date of Birth:</strong> ${dateOfBirth}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Aadhaar:</strong> ${aadhaarNumber}</p>
                <p><strong>Course Level:</strong> ${courseLevel}</p>
              </div>

              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Parent/Guardian Information</h3>
                <p><strong>Name:</strong> ${parentName}</p>
                <p><strong>Contact:</strong> ${parentContact}</p>
              </div>

              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Training Center</h3>
                <p><strong>Center:</strong> ${centerData.name || center}</p>
              </div>

              <div style="margin: 20px 0;">
                <p><strong>Student Photo:</strong></p>
                <p><a href="${signedUrlData.signedUrl}" style="color: #007bff; text-decoration: none;">View Photo</a></p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p>This is an automated notification from the Schoenstatt Language Academy registration system.</p>
                <p>Registration ID: ${registrationData.id}</p>
                <p>Submitted on: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `
        })
        console.log('Institution email sent successfully:', emailResult)
      } catch (emailError) {
        console.error('Institution email sending error:', emailError)
        // Log the full error details for debugging
        if (emailError instanceof Error) {
          console.error('Error message:', emailError.message)
          console.error('Error stack:', emailError.stack)
        }
      }
    } else {
      console.log('Institution email not sent because:', {
        noCenterEmail: !centerData?.email,
        noSignedUrl: !signedUrlData?.signedUrl,
        centerData,
        signedUrlData
      })
    }

    // Send confirmation email to candidate
    try {
      console.log('Sending confirmation email to candidate:', email)
      const confirmationResult = await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: email,
        subject: 'Registration Confirmation - Schoenstatt Language Academy',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">Registration Confirmed!</h1>
              <p style="color: #666; font-size: 16px;">Thank you for registering with Schoenstatt Language Academy</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">Your Registration Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${firstName} ${lastName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">${email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">${phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Course Level:</td>
                  <td style="padding: 8px 0; color: #333;">${courseLevel.toUpperCase()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Training Center:</td>
                  <td style="padding: 8px 0; color: #333;">${centerData?.name || center}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Registration ID:</td>
                  <td style="padding: 8px 0; color: #333;">${registrationData.id}</td>
                </tr>
              </table>
            </div>

            <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">What's Next?</h3>
              <ul style="color: #155724; margin: 10px 0; padding-left: 20px;">
                <li>Our team will review your application</li>
                <li>You will be contacted within 2-3 business days</li>
                <li>Please keep this email for your records</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                If you have any questions, please contact us at the training center.
              </p>
              <p style="color: #666; font-size: 12px; margin: 10px 0 0 0;">
                This is an automated confirmation email from Schoenstatt Language Academy.
              </p>
            </div>
          </div>
        `
      })
      
      console.log('Confirmation email sent successfully:', confirmationResult)
    } catch (confirmationError) {
      console.error('Confirmation email sending error:', confirmationError)
      // Don't fail the registration if confirmation email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully!',
      registrationId: registrationData.id
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
