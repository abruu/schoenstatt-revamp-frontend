'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminProtectedRoute } from '@/components/admin-protected-route'
import { supabase, Student, logAuditAction } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  User
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import Image from 'next/image'

export default function EditStudentPage() {
  return (
    <AdminProtectedRoute>
      <EditStudentContent />
    </AdminProtectedRoute>
  )
}

function EditStudentContent() {
  const params = useParams()
  const router = useRouter()
  const { adminUser } = useAdminAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)

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
    center: '',
    course_level: '',
    photo_path: ''
  })

  const courseLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  const centers = ['thrissur', 'chalakudy', 'peravoor']

  useEffect(() => {
    if (params.id) {
      fetchStudent(params.id as string)
    }
  }, [params.id])

  const fetchStudent = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        email: data.email,
        phone: data.phone,
        address: data.address,
        parent_name: data.parent_name,
        parent_contact: data.parent_contact,
        aadhaar_number: data.aadhaar_number,
        center: data.center,
        course_level: data.course_level,
        photo_path: data.photo_path
      })

      // Get current photo URL
      if (data.photo_path) {
        const { data: photoData } = await supabase.storage
          .from('photos')
          .createSignedUrl(data.photo_path, 3600)

        if (photoData?.signedUrl) {
          setCurrentPhotoUrl(photoData.signedUrl)
        }
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      setError('Failed to load student data')
    } finally {
      setLoading(false)
    }
  }

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
    if (!photoFile) return formData.photo_path

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
        throw new Error('You can only edit students from your center')
      }

      // Upload photo if changed
      const photoPath = await uploadPhoto()

      const updatedData = {
        ...formData,
        photo_path: photoPath || formData.photo_path
      }

      // Get original data for audit log
      const { data: originalData } = await supabase
        .from('registrations')
        .select('*')
        .eq('id', params.id)
        .single()

      // Update student
      const { error } = await supabase
        .from('registrations')
        .update(updatedData)
        .eq('id', params.id)

      if (error) throw error

      // Log audit action
      await logAuditAction(
        'registrations',
        params.id as string,
        'UPDATE',
        originalData,
        updatedData
      )

      setSuccess('Student updated successfully!')

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/admin/students/${params.id}`)
      }, 1500)

    } catch (error: any) {
      setError(error.message || 'Failed to update student')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href={`/admin/students/${params.id}`}>
                <Button variant="ghost" size="sm" className="mr-4 text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/50">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Edit Student
                  </h1>
                  <p className="text-sm text-blue-300 font-medium">
                    {formData.first_name} {formData.last_name}
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
          <Card>
            <CardHeader>
              <CardTitle>Student Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Photo preview"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : currentPhotoUrl ? (
                    <Image
                      src={currentPhotoUrl}
                      alt="Current photo"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-500 mb-2">
                    Upload a new photo (JPG, PNG, WebP - Max 5MB)
                  </p>
                  {(photoPreview || currentPhotoUrl) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removePhoto}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
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
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
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
                          key={center}
                          value={center}
                          disabled={adminUser?.role !== 'super_admin' && adminUser?.center_id !== center}
                        >
                          {center.charAt(0).toUpperCase() + center.slice(1)}
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
                        <SelectItem key={level} value={level}>
                          {level}
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
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Student
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
