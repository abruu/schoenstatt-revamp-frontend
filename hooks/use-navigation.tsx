"use client"

import { useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"

export function useNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (pathname === "/") {
        // Already on homepage, just scroll
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      } else {
        // Navigate to homepage with hash
        router.push(`/#${sectionId}`)
      }
    },
    [router, pathname],
  )

  const navigateToPage = useCallback(
    (path: string) => {
      router.push(path)
    },
    [router],
  )

  return {
    navigateToSection,
    navigateToPage,
    currentPath: pathname,
  }
}
