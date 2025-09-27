'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Users, CreditCard, BookOpen, Upload, Plus, X, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase, logAuditAction } from '@/lib/supabase'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { useCenters } from '@/hooks/use-centers'
import { useCourseLevels } from '@/hooks/use-course-levels'
import { AdminProtectedRoute } from '@/components/admin-protected-route'

export default function NewStudentPage() {
  return (
    <AdminProtectedRoute>
      <NewStudentContent />
    </AdminProtectedRoute>
  )
}

function NewStudentContent() {
  const router = useRouter()
  const { adminUser } = useAdminAuth()
  const { centers } = useCenters()
  const { courseLevels } = useCourseLevels()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    email: '',
    phone: '',
    address: '',
    parent_name: '',
    parent_contact: '',
    aadhaar_number: '',
    center: adminUser?.center_id || '',
    course_level: '',
  })


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null

    try {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `students/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, photoFile)

      if (uploadError) throw uploadError

      return filePath
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw new Error('Failed to upload photo')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      // Check admin permissions
      if (adminUser?.role !== 'super_admin' && adminUser?.center_id !== formData.center) {
        throw new Error('You can only add students to your center')
      }

      // Upload photo if provided
      const photoPath = await uploadPhoto()

      const studentData = {
        ...formData,
        photo_path: photoPath || '/default-avatar.jpg'
      }

      // Insert student
      const { data, error } = await supabase
        .from('registrations')
        .insert(studentData)
        .select()
        .single()

      if (error) throw error

      // Log audit action
      await logAuditAction(
        'registrations',
        data.id,
        'INSERT',
        null,
        studentData
      )

      setSuccess('Student added successfully!')
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/admin/students/${data.id}`)
      }, 1500)

    } catch (error: any) {
      setError(error.message || 'Failed to add student')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="mr-4 text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/50">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Add New Student
                  </h1>
                  <p className="text-sm text-blue-300 font-medium">
                    Register a new student
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Photo Upload */}
          <Card className="bg-gradient-to-br from-white via-blue-50 to-slate-50 border border-blue-200/50 shadow-lg shadow-blue-100/50">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Student Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="photo" className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-gradient-to-br from-blue-50 to-slate-50 hover:from-blue-100 hover:to-slate-100 transition-all duration-300">
                    {photoPreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={photoPreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoFile(null)
                            setPhotoPreview(null)
                          }}
                          className="absolute top-2 right-2 p-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 shadow-lg transition-all duration-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-blue-500" />
                        <p className="mb-2 text-sm text-gray-700">
                          <span className="font-semibold text-blue-600">Click to upload</span> student photo
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                      </div>
                    )}
                    <input
                      id="photo"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="bg-gradient-to-br from-white via-blue-50 to-slate-50 border border-blue-200/50 shadow-lg shadow-blue-100/50">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="aadhaar_number">Aadhaar Number *</Label>
                  <Input
                    id="aadhaar_number"
                    value={formData.aadhaar_number}
                    onChange={(e) => handleInputChange('aadhaar_number', e.target.value)}
                    placeholder="1234 5678 9012"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-br from-white via-blue-50 to-slate-50 border border-blue-200/50 shadow-lg shadow-blue-100/50">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Parent Information */}
          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parent_name">Parent/Guardian Name *</Label>
                  <Input
                    id="parent_name"
                    value={formData.parent_name}
                    onChange={(e) => handleInputChange('parent_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="parent_contact">Parent Contact *</Label>
                  <Input
                    id="parent_contact"
                    value={formData.parent_contact}
                    onChange={(e) => handleInputChange('parent_contact', e.target.value)}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="center">Center *</Label>
                  <Select
                    value={formData.center}
                    onValueChange={(value) => handleInputChange('center', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select center" />
                    </SelectTrigger>
                    <SelectContent>
                      {centers.map(center => (
                        <SelectItem 
                          key={center.id} 
                          value={center.id}
                          disabled={adminUser?.role !== 'super_admin' && adminUser?.center_id !== center.id}
                        >
                          {center.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="course_level">Course Level *</Label>
                  <Select
                    value={formData.course_level}
                    onValueChange={(value) => handleInputChange('course_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course level" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseLevels.map(level => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name} - {level.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={saving} size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Add Student
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
