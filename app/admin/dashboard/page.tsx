'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { AdminProtectedRoute } from '@/components/admin-protected-route'
import { supabase, Student } from '@/lib/supabase'
import { useCourseLevels } from '@/hooks/use-course-levels'
import { useCenters } from '@/hooks/use-centers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight, 
  Download, 
  Plus,
  LogOut,
  Users,
  GraduationCap,
  RefreshCw,
  Mail,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function AdminDashboard() {
  return (
    <AdminProtectedRoute>
      <DashboardContent />
    </AdminProtectedRoute>
  )
}

function DashboardContent() {
  const { adminUser, signOut } = useAdminAuth()
  const { courseLevels, loading: courseLevelsLoading } = useCourseLevels()
  const { centers, loading: centersLoading } = useCenters()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [institutionFilter, setInstitutionFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const studentsPerPage = 10

  // Debounce search term with 3 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchStudents()
  }, [currentPage, debouncedSearchTerm, courseFilter, institutionFilter])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('registrations')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Apply search filter
      if (debouncedSearchTerm) {
        query = query.or(`first_name.ilike.%${debouncedSearchTerm}%,last_name.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%,aadhaar_number.ilike.%${debouncedSearchTerm}%`)
      }

      // Apply course filter
      if (courseFilter !== 'all') {
        query = query.eq('course_level', courseFilter)
      }

      // Apply institution filter for super admin
      if (institutionFilter !== 'all') {
        query = query.eq('center', institutionFilter)
      }

      // For regular admin, filter by their center only (not super admin)
      if (adminUser?.role !== 'super_admin' && adminUser?.center_id) {
        query = query.eq('center', adminUser.center_id)
      }

      // Apply pagination
      const from = (currentPage - 1) * studentsPerPage
      const to = from + studentsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setStudents(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', studentId)

      if (error) throw error

      fetchStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student')
    }
  }

  const exportToCSV = () => {
    const headers = [
      'First Name', 'Last Name', 'Email', 'Phone', 'Date of Birth',
      'Address', 'Parent Name', 'Parent Contact', 'Aadhaar Number',
      'Center', 'Course Level', 'Registration Date'
    ]

    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.first_name,
        student.last_name,
        student.email,
        student.phone,
        student.date_of_birth,
        `"${student.address}"`,
        student.parent_name,
        student.parent_contact,
        student.aadhaar_number,
        student.center,
        student.course_level,
        format(new Date(student.created_at), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${adminUser?.center_id}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totalPages = Math.ceil(totalCount / studentsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              {/* Logo matching website */}
              <div className="relative mr-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20"></div>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    SCHOENSTATT ADMIN
                  </h1>
                  <span className="px-3 py-1 text-xs font-medium bg-yellow-400/20 text-yellow-400 rounded-full border border-yellow-400/30">
                    {adminUser?.role === 'super_admin' ? 'Super Admin' : 'SLA - ' + adminUser?.center_id?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-blue-300 font-medium tracking-wider">
                  STUDENT MANAGEMENT PORTAL
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={signOut}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-slate-800/90 via-blue-800/90 to-slate-700/90 border border-blue-600/30 shadow-xl shadow-blue-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-300">Total Students</p>
                    <p className="text-2xl font-bold text-white">{totalCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/30">
                    <Users className="h-6 w-6 text-black" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Admin User Info Card - Visible to all admins */}
            <Card className="bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-700/90 border border-purple-600/30 shadow-xl shadow-purple-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-300">Admin User</p>
                    <p className="text-lg font-bold text-white truncate">{adminUser?.email}</p>
                    <p className="text-xs text-purple-200 capitalize">{adminUser?.role?.replace('_', ' ')}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-400/30">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Center Card - Only for regular admins, not super_admin */}
            {adminUser?.role !== 'super_admin' && (
              <Card className="bg-gradient-to-br from-slate-800/90 via-yellow-900/90 to-orange-900/90 border border-yellow-600/30 shadow-xl shadow-yellow-900/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-300">Your Center</p>
                      <p className="text-2xl font-bold text-white capitalize">SLA - {adminUser?.center_id}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/30">
                      <MapPin className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Search and Filters */}
          <Card className="mb-6 bg-gradient-to-r from-slate-800/95 via-blue-900/95 to-slate-800/95 border border-blue-700/50 shadow-xl backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, email, or Aadhaar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-blue-600/30 text-white placeholder-blue-300 focus:border-yellow-400 focus:ring-yellow-400/20"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  {/* Institution Filter - Only for Super Admin */}
                  {adminUser?.role === 'super_admin' && (
                    <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by institution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Institutions</SelectItem>
                        {centers.map(center => (
                          <SelectItem key={center.id} value={center.id}>{center.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courseLevels.map(level => (
                        <SelectItem key={level.id} value={level.name}>{level.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card className="bg-gradient-to-br from-slate-800/95 via-blue-900/95 to-slate-800/95 border border-blue-600/30 shadow-xl shadow-blue-900/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Students ({totalCount})
                </div>
                <Button
                  onClick={fetchStudents}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="text-yellow-400 hover:text-black hover:bg-yellow-400 border-yellow-400/50 hover:border-yellow-400"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-700/80 to-blue-800/80 border-b border-blue-600/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Course Level</th>
                      {adminUser?.role === 'super_admin' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Institution</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Registration Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800/50 divide-y divide-blue-700/30">
                    {loading ? (
                      <tr>
                        <td colSpan={adminUser?.role === 'super_admin' ? 8 : 7} className="px-6 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-yellow-400 mr-2" />
                            <span className="text-blue-300">Loading students...</span>
                          </div>
                        </td>
                      </tr>
                    ) : students.length === 0 ? (
                      <tr>
                        <td colSpan={adminUser?.role === 'super_admin' ? 8 : 7} className="px-6 py-8 text-center text-blue-300">
                          No students found
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="hover:bg-blue-800/30 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {student.first_name} {student.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-blue-300">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-blue-300">{student.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                              {student.course_level}
                            </span>
                          </td>
                          {adminUser?.role === 'super_admin' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-blue-300 capitalize">SLA - {student.center}</div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-blue-300">
                              {format(new Date(student.created_at), 'MMM dd, yyyy')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link href={`/admin/students/${student.id}`}>
                              <Button variant="outline" size="sm" className="text-yellow-400 hover:text-black hover:bg-yellow-400 border-yellow-400/50 hover:border-yellow-400 mr-2">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-blue-300">
                Showing {((currentPage - 1) * studentsPerPage) + 1} to {Math.min(currentPage * studentsPerPage, totalCount)} of {totalCount} students
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="text-yellow-400 hover:text-black hover:bg-yellow-400 border-yellow-400/50 hover:border-yellow-400 disabled:opacity-50 disabled:hover:text-yellow-400 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-blue-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="text-yellow-400 hover:text-black hover:bg-yellow-400 border-yellow-400/50 hover:border-yellow-400 disabled:opacity-50 disabled:hover:text-yellow-400 disabled:hover:bg-transparent"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
