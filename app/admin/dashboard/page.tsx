'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStrapiAuth } from '@/contexts/strapi-auth-context'
import { StrapiProtectedRoute } from '@/components/strapi-protected-route'
import { studentService, StrapiStudent } from '@/lib/services/student-service'
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
  Shield,
  Check,
  X,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function AdminDashboard() {
  return (
    <StrapiProtectedRoute>
      <DashboardContent />
    </StrapiProtectedRoute>
  )
}

function DashboardContent() {
  const { user, logout, signingOut, isSuperAdmin, centerName } = useStrapiAuth()
  const { courseLevels, loading: courseLevelsLoading } = useCourseLevels()
  const { centers, loading: centersLoading } = useCenters()
  const [students, setStudents] = useState<StrapiStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [institutionFilter, setInstitutionFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
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
  }, [currentPage, debouncedSearchTerm, courseFilter, statusFilter, institutionFilter])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await studentService.getAll({
        page: currentPage,
        pageSize: studentsPerPage,
        search: debouncedSearchTerm || undefined,
        courseLevel: courseFilter !== 'all' ? courseFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        center: institutionFilter !== 'all' ? institutionFilter : undefined,
      })

      setStudents(response.data || [])
      setTotalCount(response.meta.pagination.total || 0)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return
    }

    try {
      await studentService.delete(documentId)
      fetchStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student')
    }
  }

  const handleStatusUpdate = async (documentId: string, newStatus: 'accepted' | 'rejected' | 'enquired') => {
    setUpdatingStatus(documentId)
    try {
      await studentService.updateStatus(documentId, newStatus)

      // Update the local state immediately
      setStudents(prev => prev.map(student =>
        student.documentId === documentId ? { ...student, status: newStatus } : student
      ))
    } catch (error) {
      console.error('Error updating student status:', error)
      alert('Failed to update student status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const exportToCSV = () => {
    const headers = [
      'First Name', 'Last Name', 'Email', 'Phone', 'Date of Birth',
      'Address', 'Parent Name', 'Parent Contact', 'Aadhaar Number',
      'Center', 'Course Level', 'Status', 'Registration Date'
    ]

    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.firstName,
        student.lastName,
        student.email,
        student.phone,
        student.dateOfBirth,
        `"${student.address}"`,
        student.parentName,
        student.parentContact,
        student.aadhaarNumber,
        student.center?.name || '',
        student.courseLevel?.LabelFull || '',
        student.status,
        format(new Date(student.createdAt), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${centerName || 'all'}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx')
      const worksheet = XLSX.utils.json_to_sheet(students.map(student => ({
        'First Name': student.firstName,
        'Last Name': student.lastName,
        'Email': student.email,
        'Phone': student.phone,
        'Date of Birth': student.dateOfBirth,
        'Address': student.address,
        'Parent Name': student.parentName,
        'Parent Contact': student.parentContact,
        'Aadhaar Number': student.aadhaarNumber,
        'Center': student.center?.name || '',
        'Course Level': student.courseLevel?.LabelFull || '',
        'Status': student.status,
        'Registration Date': format(new Date(student.createdAt), 'yyyy-MM-dd')
      })))

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')

      XLSX.writeFile(workbook, `students-${centerName || 'all'}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('Failed to export to Excel. Please try CSV export instead.')
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'enquired': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default: return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30'
    }
  }

  const totalPages = Math.ceil(totalCount / studentsPerPage)

  return (
    <div className="min-h-screen ">
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
                    {isSuperAdmin ? 'Super Admin' : 'SLA - ' + (centerName || '').toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-blue-300 font-medium tracking-wider">
                  STUDENT MANAGEMENT PORTAL
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              disabled={signingOut}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300 disabled:opacity-50"
            >
              {signingOut ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </>
              )}
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
                    <p className="text-lg font-bold text-white truncate">{user?.email}</p>
                    <p className="text-xs text-purple-200 capitalize">{isSuperAdmin ? 'Super Admin' : 'Center Admin'}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-400/30">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Center Card - Only for regular admins, not super_admin */}
            {!isSuperAdmin && centerName && (
              <Card className="bg-gradient-to-br from-slate-800/90 via-yellow-900/90 to-orange-900/90 border border-yellow-600/30 shadow-xl shadow-yellow-900/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-300">Your Center</p>
                      <p className="text-2xl font-bold text-white capitalize">{centerName}</p>
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
                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] bg-slate-700/50 border-blue-600/30 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="enquired">Enquired</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Institution Filter - Only for Super Admin */}
                  {isSuperAdmin && (
                    <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                      <SelectTrigger className="w-[180px] bg-slate-700/50 border-blue-600/30 text-white">
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
                    <SelectTrigger className="w-[180px] bg-slate-700/50 border-blue-600/30 text-white">
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courseLevels.map(level => (
                        <SelectItem key={level.id} value={level.name}>{level.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Download Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={exportToCSV}
                      variant="outline"
                      size="sm"
                      className="text-green-400 hover:text-black hover:bg-green-400 border-green-400/50 hover:border-green-400"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button
                      onClick={exportToExcel}
                      variant="outline"
                      size="sm"
                      className="text-green-400 hover:text-black hover:bg-green-400 border-green-400/50 hover:border-green-400"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Status</th>
                      {isSuperAdmin && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Institution</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Registration Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider sticky right-0 bg-gradient-to-r from-slate-700 to-blue-800 border-l border-blue-600/30">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800/50 divide-y divide-blue-700/30">
                    {loading ? (
                      <tr>
                        <td colSpan={isSuperAdmin ? 9 : 8} className="px-6 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-yellow-400 mr-2" />
                            <span className="text-blue-300">Loading students...</span>
                          </div>
                        </td>
                      </tr>
                    ) : students.length === 0 ? (
                      <tr>
                        <td colSpan={isSuperAdmin ? 9 : 8} className="px-6 py-8 text-center text-blue-300">
                          No students found
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.documentId} className="hover:bg-blue-800/30 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {student.firstName} {student.lastName}
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
                              {student.courseLevel?.LabelFull || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(student.status)}`}>
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </span>
                          </td>
                          {isSuperAdmin && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-blue-300 capitalize">{student.center?.name || 'N/A'}</div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-blue-300">
                              {format(new Date(student.createdAt), 'MMM dd, yyyy')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-slate-800 border-l border-blue-700/30">
                            <div className="flex items-center gap-2">
                              {/* Status Action Buttons */}
                              <div className="flex gap-1">
                                <Button
                                  onClick={() => handleStatusUpdate(student.documentId, 'accepted')}
                                  disabled={updatingStatus === student.documentId || student.status === 'accepted'}
                                  variant="outline"
                                  size="sm"
                                  className={`h-8 w-8 p-0 ${
                                    student.status === 'accepted'
                                      ? 'bg-green-500/20 text-green-300 border-green-500/50'
                                      : 'text-green-400 hover:text-black hover:bg-green-400 border-green-400/50 hover:border-green-400'
                                  }`}
                                  title="Accept Student"
                                >
                                  {updatingStatus === student.documentId ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  onClick={() => handleStatusUpdate(student.documentId, 'rejected')}
                                  disabled={updatingStatus === student.documentId || student.status === 'rejected'}
                                  variant="outline"
                                  size="sm"
                                  className={`h-8 w-8 p-0 ${
                                    student.status === 'rejected'
                                      ? 'bg-red-500/20 text-red-300 border-red-500/50'
                                      : 'text-red-400 hover:text-black hover:bg-red-400 border-red-400/50 hover:border-red-400'
                                  }`}
                                  title="Reject Student"
                                >
                                  {updatingStatus === student.documentId ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <X className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  onClick={() => handleStatusUpdate(student.documentId, 'enquired')}
                                  disabled={updatingStatus === student.documentId}
                                  variant="outline"
                                  size="sm"
                                  className={`h-8 w-8 p-0 ${
                                    student.status === 'enquired'
                                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                                      : 'text-blue-400 hover:text-black hover:bg-blue-400 border-blue-400/50 hover:border-blue-400'
                                  }`}
                                  title="Mark Student as Enquired"
                                >
                                  {updatingStatus === student.documentId ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <HelpCircle className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>

                              {/* View Button */}
                              <Link href={`/admin/students/${student.documentId}`}>
                                <Button variant="outline" size="sm" className="text-yellow-400 hover:text-black hover:bg-yellow-400 border-yellow-400/50 hover:border-yellow-400">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </Link>
                            </div>
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
