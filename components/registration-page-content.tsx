"use client"

import { useState, useRef, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import { User, Send, ArrowLeft, Home, Upload, Calendar, Mail, Phone, MapPin, Users, CreditCard, Building, BookOpen, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { useCenters } from "@/hooks/use-centers"
import Link from "next/link"

// Form values interface
interface FormValues {
  photo: File | null
  firstName: string
  lastName: string
  dateOfBirth: string
  email: string
  phone: string
  address: string
  parentName: string
  parentContact: string
  aadhaarNumber: string
  center: string
  courseLevel: string
}


// Aadhaar checksum validation using Verhoeff algorithm
const verhoeffTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
]

const permutationTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
]

const validateAadhaar = (aadhaar: string): boolean => {
  if (!/^\d{12}$/.test(aadhaar)) return false
  if (/^(\d)\1{11}$/.test(aadhaar)) return false // No repeated digits
  
  let checksum = 0
  for (let i = 0; i < 12; i++) {
    checksum = verhoeffTable[checksum][permutationTable[i % 8][parseInt(aadhaar[i])]]
  }
  return checksum === 0
}

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

// Validation schema
const validationSchema = Yup.object({
  photo: Yup.mixed()
    .required("Photo is required")
    .test("fileType", "Please upload a valid image (JPG, PNG, WebP)", (value) => {
      if (!value) return false
      const file = value as File
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
    })
    .test("fileSize", "File size must be 5MB or less", (value) => {
      if (!value) return false
      const file = value as File
      return file.size <= 5 * 1024 * 1024
    }),
  firstName: Yup.string()
    .transform((value) => sanitizeInput(value))
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .transform((value) => sanitizeInput(value))
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),
  dateOfBirth: Yup.string()
    .required("Date of birth is required")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Please enter date in DD/MM/YYYY format")
    .test("valid-date", "Please enter a valid date", (value) => {
      if (!value) return false
      const [day, month, year] = value.split('/').map(Number)
      const date = new Date(year, month - 1, day)
      return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year
    })
    .test("age", "You must be at least 5 years old", (value) => {
      if (!value) return false
      const [day, month, year] = value.split('/').map(Number)
      const birthDate = new Date(year, month - 1, day)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 5
      }
      return age >= 5
    })
    .test("not-future", "Date of birth cannot be in the future", (value) => {
      if (!value) return false
      const [day, month, year] = value.split('/').map(Number)
      const birthDate = new Date(year, month - 1, day)
      return birthDate <= new Date()
    }),
  email: Yup.string()
    .transform((value) => value ? value.toLowerCase().trim() : value)
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .transform((value) => value ? value.replace(/\D/g, '') : value)
    .matches(/^(\+91)?[6-9]\d{9}$/, "Please enter a valid Indian phone number (10 digits, starting with 6-9, optionally with +91)")
    .test("no-leading-zero", "Phone number cannot start with 0", (value) => {
      if (!value) return true
      const cleanNumber = value.replace(/^\+91/, '')
      return !cleanNumber.startsWith('0')
    })
    .required("Phone number is required"),
  address: Yup.string()
    .transform((value) => sanitizeInput(value))
    .min(10, "Address must be at least 10 characters")
    .max(250, "Address cannot exceed 250 characters")
    .required("Address is required"),
  parentName: Yup.string()
    .transform((value) => sanitizeInput(value))
    .matches(/^[a-zA-Z\s]+$/, "Parent name can only contain letters and spaces")
    .min(2, "Parent name must be at least 2 characters")
    .max(50, "Parent name cannot exceed 50 characters")
    .required("Parent/Guardian name is required"),
  parentContact: Yup.string()
    .transform((value) => value ? value.replace(/\D/g, '') : value)
    .matches(/^(\+91)?[6-9]\d{9}$/, "Please enter a valid Indian phone number (10 digits, starting with 6-9, optionally with +91)")
    .test("no-leading-zero", "Phone number cannot start with 0", (value) => {
      if (!value) return true
      const cleanNumber = value.replace(/^\+91/, '')
      return !cleanNumber.startsWith('0')
    })
    .required("Parent contact number is required"),
  aadhaarNumber: Yup.string()
    .transform((value) => value ? value.replace(/\D/g, '') : value)
    .matches(/^\d{12}$/, "Aadhaar number must be exactly 12 digits")
    // .test("valid-aadhaar", "Please enter a valid Aadhaar number", (value) => {
    //   if (!value) return true
    //   return validateAadhaar(value)
    // })
    .required("Aadhaar number is required"),
  center: Yup.string()
    .required("Please select a training center"),
  courseLevel: Yup.string()
    .required("Please select a course level")
})

// Initial form values
const initialValues: FormValues = {
  photo: null,
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  address: "",
  parentName: "",
  parentContact: "",
  aadhaarNumber: "",
  center: "",
  courseLevel: ""
}

export function RegistrationPageContent() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const { centers, loading: centersLoading } = useCenters()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        // Clear the file input and show error
        event.target.value = ''
        setSubmitStatus('error')
        setSubmitMessage('File size must be 5MB or less. Please choose a smaller image.')
        return
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        // Clear the file input and show error
        event.target.value = ''
        setSubmitStatus('error')
        setSubmitMessage('Please upload a valid image (JPG, PNG, WebP).')
        return
      }

      // Clear any previous error messages
      setSubmitStatus('idle')
      setSubmitMessage('')
      
      setFieldValue('photo', file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = (setFieldValue: any) => {
    setFieldValue('photo', null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const clearPhotoPreview = () => {
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }


  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
    try {
      setSubmitStatus('idle')
      
      
      // Check for duplicates first
      const duplicateCheck = await fetch('/api/registrations/check-duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          phone: values.phone
        })
      })
      
      const duplicateResult = await duplicateCheck.json()
      
      if (duplicateResult.exists) {
        setSubmitStatus('error')
        setSubmitMessage(`A registration already exists with this ${duplicateResult.field}. Please contact the institution if you need assistance.`)
        setSubmitting(false)
        return
      }
      
      // Create FormData for file upload
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | File)
        }
      })

      const response = await fetch('/api/registrations', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage('Registration successful! You will be contacted by the institution.')
        setRegistrationComplete(true)
        resetForm()
        clearPhotoPreview()
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.error || 'Failed to submit registration')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
      setSubmitMessage('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen component
  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        
        <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-400">Registration Successful!</h1>
            <p className="text-white/80 text-lg">A confirmation email has been sent to your registered email address.</p>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
                <div className="text-center space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white">What happens next?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    <div className="space-y-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold text-xs sm:text-sm">1</span>
                      </div>
                      <p>We'll review your registration</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold text-xs sm:text-sm">2</span>
                      </div>
                      <p>Contact you with course details</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold text-xs sm:text-sm">3</span>
                      </div>
                      <p>Begin your German journey</p>
                    </div>
                  </div>
                </div>
              </div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div> 
      </div>
      //  <Footer />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <section className="relative z-10 py-8 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Enhanced Back to Home Button - Always Visible */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white/90 hover:text-white transition-all duration-300 group shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-300" />
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            <div className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 backdrop-blur-sm">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-medium text-xs sm:text-sm">STUDENT REGISTRATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold px-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Register Now
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Complete your registration for our German language courses. Please fill in all required information accurately to process your enrollment.
            </p>
          </div>

          

          {/* Registration Form */}
          <div className="relative mx-4 sm:mx-0">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20"></div>
            
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, values, isSubmitting, errors, touched, isValid }) => (
                  <Form className="space-y-6 sm:space-y-8">
                    {/* Photo Upload with Preview */}
                    <div className="space-y-2 sm:space-y-3">
                      <label htmlFor="photo" className="text-sm font-medium text-white flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Photo *
                      </label>
                      <div className="relative">
                        {photoPreview ? (
                          <div className="space-y-3">
                            <div className="relative w-32 h-32 mx-auto">
                              <img
                                src={photoPreview}
                                alt="Photo preview"
                                className="w-full h-full object-cover rounded-lg border-2 border-white/20"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(setFieldValue)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                              >
                                ×
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Change Photo
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/30 transition-colors">
                            <Upload className="h-8 w-8 text-white/50 mx-auto mb-2" />
                            <p className="text-white/70 mb-2">Click to upload photo</p>
                            <p className="text-xs text-gray-500">JPG, PNG, WebP - Max 5MB</p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          id="photo"
                          name="photo"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(event) => handlePhotoChange(event, setFieldValue)}
                          className={photoPreview ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                        />
                        <ErrorMessage name="photo" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                      
                      {/* File validation error messages */}
                      {submitStatus === 'error' && submitMessage && (
                        <div className="mt-3 p-3 rounded-lg border bg-red-500/10 border-red-500/30 text-red-400">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm">{submitMessage}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* First Name */}
                      <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="firstName" className="text-sm font-medium text-white">
                          First Name *
                        </label>
                        <Field
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                        />
                        <ErrorMessage name="firstName" component="div" className="text-red-400 text-xs mt-1" />
                      </div>

                      {/* Last Name */}
                      <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="lastName" className="text-sm font-medium text-white">
                          Last Name *
                        </label>
                        <Field
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Enter your last name"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                        />
                        <ErrorMessage name="lastName" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Date of Birth */}
                      <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="dateOfBirth" className="text-sm font-medium text-white flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date of Birth *
                        </label>
                        <Field
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="text"
                          placeholder="DD/MM/YYYY"
                          maxLength={10}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let value = e.target.value.replace(/\D/g, '') // Remove non-digits
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2)
                            }
                            if (value.length >= 5) {
                              value = value.substring(0, 5) + '/' + value.substring(5, 9)
                            }
                            setFieldValue('dateOfBirth', value)
                          }}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                        />
                        <ErrorMessage name="dateOfBirth" component="div" className="text-red-400 text-xs mt-1" />
                      </div>

                      {/* Email */}
                      <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address *
                        </label>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email (e.g. name@example.com)"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Phone Number */}
                      <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="phone" className="text-sm font-medium text-white flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number *
                        </label>
                        <Field
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                        />
                        <ErrorMessage name="phone" component="div" className="text-red-400 text-xs mt-1" />
                      </div>

                      {/* Aadhaar Number */}
                      <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="aadhaarNumber" className="text-sm font-medium text-white flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Aadhaar Card Number *
                        </label>
                        <Field
                          id="aadhaarNumber"
                          name="aadhaarNumber"
                          type="text"
                          placeholder="Enter your Aadhaar card number"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                        />
                        <ErrorMessage name="aadhaarNumber" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2 sm:space-y-3">
                      <label htmlFor="address" className="text-sm font-medium text-white flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Residential Address *
                      </label>
                      <Field
                        as="textarea"
                        id="address"
                        name="address"
                        placeholder="Enter your complete address"
                        rows={3}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base resize-none"
                      />
                      <ErrorMessage name="address" component="div" className="text-red-400 text-xs mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Parent's Name */}
                      <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="parentName" className="text-sm font-medium text-white flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Parent's Name *
                        </label>
                        <Field
                          id="parentName"
                          name="parentName"
                          type="text"
                          placeholder="Enter parent/guardian's full name"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                        />
                        <ErrorMessage name="parentName" component="div" className="text-red-400 text-xs mt-1" />
                      </div>

                      {/* Parent's Contact */}
                      <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="parentContact" className="text-sm font-medium text-white flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Parent's Contact Number *
                        </label>
                        <Field
                          id="parentContact"
                          name="parentContact"
                          type="tel"
                          placeholder="Enter parent/guardian's phone number"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                        />
                        <ErrorMessage name="parentContact" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Training Center */}
                      <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="center" className="text-sm font-medium text-white flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Training Center *
                        </label>
                        <Field name="center">
                          {({ field, form }: any) => (
                            <select
                              {...field}
                              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                            >
                              <option value="" disabled className="bg-black text-gray-400">
                                Select your training center
                              </option>
                              {centersLoading ? (
                                <option value="" disabled className="bg-black">Loading centers...</option>
                              ) : (
                                centers.map((center) => (
                                  <option key={center.id} value={center.id} className="bg-black text-white">
                                    {center.name}
                                  </option>
                                ))
                              )}
                            </select>
                          )}
                        </Field>
                        <ErrorMessage name="center" component="div" className="text-red-400 text-xs mt-1" />
                      </div>

                      {/* Course Level */}
                      <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="courseLevel" className="text-sm font-medium text-white flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Course Level *
                        </label>
                        <Field
                          as="select"
                          id="courseLevel"
                          name="courseLevel"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                        >
                          <option value="" disabled className="bg-black text-gray-400">
                            Select your level (A1, A2, B1, B2)
                          </option>
                          <option value="a1" className="bg-black text-white">A1 - Beginner</option>
                          <option value="a2" className="bg-black text-white">A2 - Elementary</option>
                          <option value="b1" className="bg-black text-white">B1 - Intermediate</option>
                          <option value="b2" className="bg-black text-white">B2 - Upper Intermediate</option>
                        </Field>
                        <ErrorMessage name="courseLevel" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                    </div>


                    {/* Submit Button */}
                    {submitStatus !== 'idle' && (
            <div className={`mx-4 sm:mx-0 mb-6 p-4 rounded-xl border ${
              submitStatus === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center gap-2">
                {submitStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span>{submitMessage}</span>
              </div>
            </div>
          )}
                    <div className="pt-2 sm:pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Send className="h-4 w-4" />
                            <span>Submit Registration</span>
                          </div>
                        )}
                      </Button>
                    </div>
                    {/* Success/Error Messages */}
          
                  </Form>
                )}
              </Formik>

              {/* Additional Information */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
                <div className="text-center space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white">What happens next?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    <div className="space-y-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold text-xs sm:text-sm">1</span>
                      </div>
                      <p>We'll review your registration</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold text-xs sm:text-sm">2</span>
                      </div>
                      <p>Contact you with course details</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold text-xs sm:text-sm">3</span>
                      </div>
                      <p>Begin your German journey</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <p className="text-xs text-gray-500 text-center mt-6 sm:mt-8 px-2">
                By registering, you agree to our terms and conditions. We'll contact you with course details and enrollment information.
                Your personal information will be handled according to our privacy policy.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
