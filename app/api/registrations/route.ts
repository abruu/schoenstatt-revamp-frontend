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
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Student Registration</title>
          </head>
          <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              
              <!-- Header with Logo and Gradient -->
              <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 30px 20px; text-align: center; position: relative;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="80" cy="80" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="40" cy="60" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); "></div>
                <img src="https://schoenstatt-six.vercel.app/images/logo/sla_logo.webp" alt="Schoenstatt Language Academy" style="height: 60px; margin-bottom: 15px; position: relative; z-index: 1;" />
                <h1 style="color: #000; margin: 0; font-size: 24px; font-weight: 700; position: relative; z-index: 1;">New Student Registration</h1>
                <p style="color: #000; margin: 8px 0 0 0; font-size: 14px; opacity: 0.8; position: relative; z-index: 1;">Schoenstatt Language Academy</p>
              </div>

              <!-- Content -->
              <div style="padding: 30px 20px;">
                
                <!-- Student Information -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, #fbbf24 0%, transparent 70%); opacity: 0.05;"></div>
                  <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; position: relative; z-index: 1;">👤 Student Information</h3>
                  <table style="width: 100%; border-collapse: collapse; position: relative; z-index: 1;">
                    <tr><td style="padding: 6px 0; font-weight: 600; color: #475569; width: 35%;">Name:</td><td style="padding: 6px 0; color: #1e293b;">${firstName} ${lastName}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Date of Birth:</td><td style="padding: 6px 0; color: #1e293b;">${dateOfBirthRaw}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Email:</td><td style="padding: 6px 0; color: #1e293b;">${email}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Phone:</td><td style="padding: 6px 0; color: #1e293b;">${phone}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Address:</td><td style="padding: 6px 0; color: #1e293b;">${address}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Aadhaar:</td><td style="padding: 6px 0; color: #1e293b;">${aadhaarNumber}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Course Level:</td><td style="padding: 6px 0; color: #1e293b;">${courseLevel.toUpperCase()}</td></tr>
                  </table>
                </div>

                <!-- Parent Information -->
                <div style="background: linear-gradient(135deg, #fef7ff 0%, #faf5ff 100%); border: 1px solid #e9d5ff; border-radius: 12px; padding: 20px; margin-bottom: 20px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, #a855f7 0%, transparent 70%); opacity: 0.05;"></div>
                  <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; position: relative; z-index: 1;">👨‍👩‍👧‍👦 Parent/Guardian Information</h3>
                  <table style="width: 100%; border-collapse: collapse; position: relative; z-index: 1;">
                    <tr><td style="padding: 6px 0; font-weight: 600; color: #475569; width: 35%;">Name:</td><td style="padding: 6px 0; color: #1e293b;">${parentName}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Contact:</td><td style="padding: 6px 0; color: #1e293b;">${parentContact}</td></tr>
                  </table>
                </div>

                <!-- Training Center -->
                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 20px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, #22c55e 0%, transparent 70%); opacity: 0.05;"></div>
                  <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; position: relative; z-index: 1;">🏢 Training Center</h3>
                  <p style="margin: 0; color: #1e293b; font-weight: 600; position: relative; z-index: 1;">${centerData?.name || center}</p>
                </div>

                <!-- Student Photo -->
                <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #93c5fd; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, #3b82f6 0%, transparent 70%); opacity: 0.05;"></div>
                  <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; position: relative; z-index: 1;">📸 Student Photo</h3>
                  <a href="${signedUrlData.signedUrl}" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; position: relative; z-index: 1; transition: all 0.3s ease;">View Photo</a>
                </div>

                <!-- Registration Details -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #fbbf24;">
                  <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">📋 Registration Details</h3>
                  <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong>Registration ID:</strong> ${registrationData.id}</p>
                  <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong>Submitted on:</strong> ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

              </div>

              <!-- Footer -->
              <div style="background: #1e293b; padding: 20px; text-align: center;">
                <p style="color: #94a3b8; margin: 0; font-size: 12px;">This is an automated notification from Schoenstatt Language Academy</p>
                <p style="color: #64748b; margin: 8px 0 0 0; font-size: 11px;">Please do not reply to this email</p>
              </div>

            </div>
          </body>
          </html>
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
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              
              <!-- Header with Logo and Success Animation -->
              <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center; position: relative;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="success" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="2" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23success)"/></svg>'); "></div>
                <img src="https://schoenstatt-six.vercel.app/images/logo/sla_logo.webp" alt="Schoenstatt Language Academy" style="height: 60px; margin-bottom: 20px; position: relative; z-index: 1;" />
                <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;">
                  <div style="font-size: 40px;">✅</div>
                </div>
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; position: relative; z-index: 1;">Registration Confirmed!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; position: relative; z-index: 1;">Thank you for joining Schoenstatt Language Academy</p>
              </div>

              <!-- Content -->
              <div style="padding: 30px 20px;">
                
                <!-- Welcome Message -->
                <div style="text-align: center; margin-bottom: 30px;">
                  <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 22px; font-weight: 600;">Welcome to Our Community! 🎉</h2>
                  <p style="color: #64748b; margin: 0; font-size: 16px;">Your registration has been successfully submitted and is being processed.</p>
                </div>

                <!-- Registration Details -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 25px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, #fbbf24 0%, transparent 70%); opacity: 0.05;"></div>
                  <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; position: relative; z-index: 1;">📋 Your Registration Details</h3>
                  <table style="width: 100%; border-collapse: collapse; position: relative; z-index: 1;">
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px 0; font-weight: 600; color: #475569; width: 40%;">Name:</td>
                      <td style="padding: 12px 0; color: #1e293b; font-weight: 500;">${firstName} ${lastName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px 0; font-weight: 600; color: #475569;">Date of Birth:</td>
                      <td style="padding: 12px 0; color: #1e293b; font-weight: 500;">${dateOfBirthRaw}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px 0; font-weight: 600; color: #475569;">Email:</td>
                      <td style="padding: 12px 0; color: #1e293b; font-weight: 500;">${email}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px 0; font-weight: 600; color: #475569;">Phone:</td>
                      <td style="padding: 12px 0; color: #1e293b; font-weight: 500;">${phone}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px 0; font-weight: 600; color: #475569;">Course Level:</td>
                      <td style="padding: 12px 0; color: #1e293b; font-weight: 500;">${courseLevel.toUpperCase()}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px 0; font-weight: 600; color: #475569;">Training Center:</td>
                      <td style="padding: 12px 0; color: #1e293b; font-weight: 500;">${centerData?.name || center}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; font-weight: 600; color: #475569;">Registration ID:</td>
                      <td style="padding: 12px 0; color: #1e293b; font-weight: 500; font-family: monospace; background: #f1f5f9; padding: 8px 12px; border-radius: 6px; display: inline-block;">${registrationData.id}</td>
                    </tr>
                  </table>
                </div>

                <!-- Next Steps -->
                <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; border-radius: 12px; padding: 25px; margin-bottom: 25px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, #22c55e 0%, transparent 70%); opacity: 0.05;"></div>
                  <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; position: relative; z-index: 1;">🚀 What Happens Next?</h3>
                  <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                      <div style="width: 24px; height: 24px; background: #22c55e; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px;">1</div>
                      <p style="margin: 0; color: #1e293b; font-weight: 500;">Our team will review your application</p>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                      <div style="width: 24px; height: 24px; background: #22c55e; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px;">2</div>
                      <p style="margin: 0; color: #1e293b; font-weight: 500;">You will be contacted within 2-3 business days</p>
                    </div>
                    <div style="display: flex; align-items: center;">
                      <div style="width: 24px; height: 24px; background: #22c55e; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px;">3</div>
                      <p style="margin: 0; color: #1e293b; font-weight: 500;">Please keep this email for your records</p>
                    </div>
                  </div>
                </div>

                <!-- Contact Information -->
                <div style="background: linear-gradient(135deg, #fef7ff 0%, #faf5ff 100%); border: 1px solid #e9d5ff; border-radius: 12px; padding: 20px; text-align: center;">
                  <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">📞 Need Help?</h3>
                  <p style="color: #64748b; margin: 0; font-size: 14px;">If you have any questions, please contact us at your selected training center.</p>
                </div>

              </div>

              <!-- Footer -->
              <div style="background: #1e293b; padding: 25px 20px; text-align: center;">
                <p style="color: #94a3b8; margin: 0 0 5px 0; font-size: 13px; font-weight: 500;">Schoenstatt Language Academy</p>
                <p style="color: #64748b; margin: 0; font-size: 11px;">This is an automated confirmation email • Please do not reply</p>
              </div>

            </div>
          </body>
          </html>
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
