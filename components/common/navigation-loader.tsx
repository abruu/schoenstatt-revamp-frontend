"use client"

import { Loader2 } from "lucide-react"

interface NavigationLoaderProps {
  isLoading: boolean
}

export function NavigationLoader({ isLoading }: NavigationLoaderProps) {
  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-600 animate-pulse"></div>
      
      {/* Loading overlay */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 text-white">
        <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  )
}
