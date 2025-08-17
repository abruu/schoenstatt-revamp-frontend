"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Listen for route changes
    const originalPush = window.history.pushState
    const originalReplace = window.history.replaceState

    window.history.pushState = function(...args) {
      handleStart()
      originalPush.apply(window.history, args)
      // Complete loading after a short delay to show the loader
      setTimeout(handleComplete, 500)
    }

    window.history.replaceState = function(...args) {
      handleStart()
      originalReplace.apply(window.history, args)
      setTimeout(handleComplete, 500)
    }

    // Handle popstate (back/forward buttons)
    const handlePopState = () => {
      handleStart()
      setTimeout(handleComplete, 500)
    }

    window.addEventListener('popstate', handlePopState)

    // Cleanup
    return () => {
      window.history.pushState = originalPush
      window.history.replaceState = originalReplace
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // Reset loading state when pathname changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  return { isLoading }
}
