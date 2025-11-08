'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStrapiAuth } from '@/contexts/strapi-auth-context'
import { LoadingScreen } from '@/components/common/loading-screen'

interface StrapiProtectedRouteProps {
  children: React.ReactNode
  requireSuperAdmin?: boolean
}

export function StrapiProtectedRoute({ 
  children, 
  requireSuperAdmin = false 
}: StrapiProtectedRouteProps) {
  const { user, loading, isSuperAdmin } = useStrapiAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login')
        return
      }

      if (requireSuperAdmin && !isSuperAdmin) {
        router.push('/admin/dashboard')
        return
      }
    }
  }, [user, loading, router, requireSuperAdmin, isSuperAdmin])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return null
  }

  return <>{children}</>
}
