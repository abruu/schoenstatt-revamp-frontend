"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    // If pathname changed, we're navigating
    if (previousPathname.current !== pathname) {
      setIsLoading(true)
      
      // Complete loading after a short delay to show the loader
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)

      previousPathname.current = pathname

      return () => clearTimeout(timer)
    }
  }, [pathname])

  return { isLoading }
}
