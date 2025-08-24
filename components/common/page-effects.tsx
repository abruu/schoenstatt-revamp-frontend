"use client"

import { useEffect } from "react"

interface PageEffectsProps {
  scrollToTop?: boolean
  handleHashNavigation?: boolean
}

export function PageEffects({ 
  scrollToTop = false, 
  handleHashNavigation = false 
}: PageEffectsProps) {
  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (handleHashNavigation) {
      const handleHashScroll = () => {
        const hash = window.location.hash.substring(1)
        if (hash) {
          // Wait for components to render
          setTimeout(() => {
            const element = document.getElementById(hash)
            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          }, 500) // Increased delay to ensure all components are rendered
        }
      }

      // Handle initial load
      handleHashScroll()

      // Handle hash changes
      window.addEventListener("hashchange", handleHashScroll)

      return () => {
        window.removeEventListener("hashchange", handleHashScroll)
      }
    }
  }, [scrollToTop, handleHashNavigation])

  return null
}
