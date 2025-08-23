'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminProtectedRoute } from '@/components/admin-protected-route'
import { supabase, Student } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Download, 
  Printer,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  GraduationCap,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import Image from 'next/image'

export default function StudentDetailPage() {
  return (
    <AdminProtectedRoute>
      <StudentDetailContent />
    </AdminProtectedRoute>
  )
}

function StudentDetailContent() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

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

      setStudent(data)

      // Get photo URL if photo_path exists and is not a default path
      if (data.photo_path && data.photo_path !== '/default-avatar.jpg') {
        // Use public URL format since bucket is now public
        const publicUrl = `${supabase.supabaseUrl}/storage/v1/object/public/photos/${data.photo_path}`
        setPhotoUrl(publicUrl)
        console.log('Photo public URL:', publicUrl)
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      router.push('/admin/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async () => {
    if (!student) return
    
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', student.id)

      if (error) throw error

      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student')
    }
  }

  const downloadPhoto = async () => {
    if (!student?.photo_path || student.photo_path === '/default-avatar.jpg') {
      alert('No photo available to download')
      return
    }

    try {
      // Use public URL for download since bucket is now public
      const publicUrl = `${supabase.supabaseUrl}/storage/v1/object/public/photos/${student.photo_path}`
      
      // Create download link
      const a = document.createElement('a')
      a.href = publicUrl
      a.download = `${student.first_name}_${student.last_name}_photo.jpg`
      a.target = '_blank'
      a.click()
    } catch (error) {
      console.error('Error downloading photo:', error)
      alert('Failed to download photo')
    }
  }

  const printStudentForm = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-blue-300">Loading student details...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-300">Student not found</p>
          <Link href="/admin/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl border-b border-blue-800/30 print:hidden">
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
                      <User className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Student Profile
                  </h1>
                  <p className="text-sm text-blue-300 font-medium">
                    {student.first_name} {student.last_name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={printStudentForm} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              {student.photo_path && (
                <Button onClick={downloadPhoto} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Download className="h-4 w-4 mr-2" />
                  Download Photo
                </Button>
              )}
              {/* <Link href={`/admin/students/${student.id}/edit`}>
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link> */}
              <Button 
                variant="destructive" 
                onClick={handleDeleteStudent}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Print Header */}
        <div className="hidden print:block mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Schoenstatt Language Academy
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Student Registration Form
          </h2>
          <div className="text-sm text-gray-600">
            Generated on: {format(new Date(), 'MMMM dd, yyyy')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-slate-800/95 via-blue-900/95 to-slate-800/95 border border-blue-600/30 shadow-xl shadow-blue-900/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={`${student.first_name} ${student.last_name}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {student.photo_path && (
                  <Button 
                    onClick={downloadPhoto} 
                    className="w-full mt-4 print:hidden"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Photo
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Details Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-gradient-to-br from-slate-800/95 via-blue-900/95 to-slate-800/95 border border-blue-600/30 shadow-xl shadow-blue-900/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-blue-300">First Name</label>
                      <p className="text-lg font-semibold text-white">{student.first_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-blue-300 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Date of Birth
                      </label>
                      <p className="text-lg text-blue-100">
                        {student.date_of_birth ? format(new Date(student.date_of_birth), 'PPP') : 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-blue-300">Last Name</label>
                      <p className="text-lg font-semibold text-white">{student.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-blue-300 flex items-center">
                        <CreditCard className="w-4 h-4 mr-1" />
                        Aadhaar Number
                      </label>
                      <p className="text-lg text-blue-100">{student.aadhaar_number || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-slate-800/95 via-green-900/95 to-emerald-900/95 border border-green-600/30 shadow-xl shadow-green-900/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-green-300 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </label>
                      <p className="text-lg text-white">{student.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-green-300 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Address
                      </label>
                      <p className="text-lg text-green-100">{student.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-green-300 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Phone
                      </label>
                      <p className="text-lg text-white">{student.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parent Information */}
            <Card className="bg-gradient-to-br from-slate-800/95 via-purple-900/95 to-violet-900/95 border border-purple-600/30 shadow-xl shadow-purple-900/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Parent/Guardian Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-purple-300">Parent/Guardian Name</label>
                    <p className="text-lg text-white">{student.parent_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-purple-300 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Parent Contact
                    </label>
                    <p className="text-lg text-purple-100">{student.parent_contact || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="bg-gradient-to-br from-slate-800/95 via-yellow-900/95 to-orange-900/95 border border-yellow-600/30 shadow-xl shadow-yellow-900/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-yellow-300">Center</label>
                    <p className="text-lg text-white capitalize">{student.center}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-yellow-300">Course Level</label><br></br>
                    <Badge variant="secondary" className="text-lg px-3 py-1 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                      {student.course_level}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-yellow-300">Registration Date</label>
                    <p className="text-lg text-yellow-100">
                      {format(new Date(student.created_at), 'PPP')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
