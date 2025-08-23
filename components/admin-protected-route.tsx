'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { LoadingScreen } from '@/components/common/loading-screen'

interface AdminProtectedRouteProps {
  children: React.ReactNode
  requireSuperAdmin?: boolean
}

export function AdminProtectedRoute({ 
  children, 
  requireSuperAdmin = false 
}: AdminProtectedRouteProps) {
  const { user, adminUser, loading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user || !adminUser) {
        router.push('/admin/login')
        return
      }

      if (requireSuperAdmin && adminUser.role !== 'super_admin') {
        router.push('/admin/dashboard')
        return
      }
    }
  }, [user, adminUser, loading, router, requireSuperAdmin])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user || !adminUser) {
    return null
  }

  if (requireSuperAdmin && adminUser.role !== 'super_admin') {
    return null
  }

  return <>{children}</>
}
