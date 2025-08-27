'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, AdminUser, getCurrentAdmin } from '@/lib/supabase'

interface AdminAuthContextType {
  user: User | null
  adminUser: AdminUser | null
  loading: boolean
  signingOut: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string; success?: boolean; user?: User; admin?: AdminUser | null }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  // Load admin user from localStorage
  const loadAdminFromStorage = () => {
    try {
      const storedAdmin = localStorage.getItem('admin_user')
      if (storedAdmin) {
        return JSON.parse(storedAdmin) as AdminUser
      }
    } catch (error) {
      console.error('Error loading admin from storage:', error)
    }
    return null
  }

  // Save admin user to localStorage
  const saveAdminToStorage = (admin: AdminUser | null) => {
    try {
      if (admin) {
        localStorage.setItem('admin_user', JSON.stringify(admin))
      } else {
        localStorage.removeItem('admin_user')
      }
    } catch (error) {
      console.error('Error saving admin to storage:', error)
    }
  }

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }

        if (session?.user) {
          setUser(session.user)
          // Try to get admin user from API first, fallback to localStorage
          try {
            const admin = await getCurrentAdmin()
            setAdminUser(admin)
            saveAdminToStorage(admin)
          } catch (error) {
            console.error('Error getting current admin:', error)
            // Fallback to localStorage
            const storedAdmin = loadAdminFromStorage()
            setAdminUser(storedAdmin)
          }
        } else {
          // No session, check localStorage for admin data
          const storedAdmin = loadAdminFromStorage()
          if (storedAdmin) {
            // Clear stale data if no session
            saveAdminToStorage(null)
            setAdminUser(null)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            const admin = await getCurrentAdmin()
            setAdminUser(admin)
            saveAdminToStorage(admin)
          } catch (error) {
            console.error('Error getting admin user:', error)
            setAdminUser(null)
            saveAdminToStorage(null)
          }
        } else {
          setAdminUser(null)
          saveAdminToStorage(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        // Get admin user data immediately after successful login
        try {
          const admin = await getCurrentAdmin()
          setAdminUser(admin)
          saveAdminToStorage(admin)
          return { success: true, user: data.user, admin }
        } catch (adminError) {
          console.error('Error getting admin data:', adminError)
          return { error: 'Failed to load admin profile' }
        }
      }

      return { success: true }
    } catch (error: any) {
      return { error: error.message || 'Login failed' }
    }
  }

  const signOut = async () => {
    setSigningOut(true)
    try {
      // Clear all session data
      await supabase.auth.signOut({ scope: 'global' })
      
      // Clear local state
      setUser(null)
      setAdminUser(null)
      saveAdminToStorage(null)
      
      // Clear any other localStorage items
      localStorage.removeItem('admin_user')
      
      // Force redirect to login page
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Error signing out:', error)
      // Even if there's an error, still redirect to login
      window.location.href = '/admin/login'
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <AdminAuthContext.Provider value={{
      user,
      adminUser,
      loading,
      signingOut,
      signIn,
      signOut,
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
