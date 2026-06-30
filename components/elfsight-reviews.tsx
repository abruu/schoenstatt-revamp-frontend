"use client"

import { useEffect } from "react"

export function ElfsightReviews({ className = "" }: { className?: string }) {
  useEffect(() => {
    const scriptId = "elfsight-google-reviews-platform"
    if (document.getElementById(scriptId)) return
    const script = document.createElement("script")
    script.id = scriptId
    script.src = "https://elfsightcdn.com/platform.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      // Do not remove on unmount to avoid duplicate reloads across re-renders
    }
  }, [])

  const appId = process.env.NEXT_PUBLIC_ELFSIGHT_APP_ID
  if (!appId) return null

  return (
    <div
      className={`elfsight-app-${appId} ${className}`}
      data-elfsight-app-lazy
    />
  )
}
