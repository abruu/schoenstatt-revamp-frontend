'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, School } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signIn, user, adminUser, loading } = useAdminAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user && adminUser) {
      router.push('/admin/dashboard')
    }
  }, [user, adminUser, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn(email, password)
      if (result.error) {
        setError(result.error)
        setIsLoading(false)
      } else if (result.success) {
        // Success - the useEffect will handle the redirect
        // Don't set isLoading to false here, let the redirect happen
        console.log('Login successful, redirecting...')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setIsLoading(false)
    }
  }

  // Show loading if auth is initializing or if we're already logged in
  if (loading || (user && adminUser)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin text-yellow-400" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/images/Gallery/header_pic.jpg')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/90 to-black/80"></div>

      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-6">
          {/* Logo matching website */}
          <div className="mx-auto mb-6 relative">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/50">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20"></div>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              SCHOENSTATT
            </h1>
            <p className="text-sm text-yellow-600 font-medium tracking-wider">LANGUAGE ACADEMY</p>
          </div>

          <CardTitle className="text-xl font-bold text-slate-800">Admin Portal</CardTitle>
          <CardDescription className="text-slate-600">
            Sign in to manage student registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your-center@sla.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                 placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 rounded-full shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* <div className="mt-6 text-center text-sm text-gray-600">
            <p className="font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs">
              <p>thrissur@sla.com</p>
              <p>chalakudy@sla.com</p>
              <p>peravoor@sla.com</p>
              <p>superadmin@sla.com</p>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
