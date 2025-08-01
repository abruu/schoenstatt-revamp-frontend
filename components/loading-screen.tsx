"use client"

import { useState, useEffect } from "react"
import { GraduationCap, Users, Award, Globe } from "lucide-react"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const loadingSteps = [
    { icon: GraduationCap, text: "Loading German Courses...", color: "text-blue-400" },
    { icon: Users, text: "Connecting Students...", color: "text-green-400" },
    { icon: Award, text: "Preparing Certificates...", color: "text-yellow-400" },
    { icon: Globe, text: "Welcome to SLA!", color: "text-purple-400" },
  ]

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem("sla-has-visited")

    if (!hasVisited) {
      // First time visitor - show loading screen
      setIsLoading(true)

      const stepTimer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1
          }
          return prev
        })
      }, 800)

      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + 2
          }
          return prev
        })
      }, 50)

      const loadTimer = setTimeout(() => {
        setIsLoading(false)
        // Mark as visited
        localStorage.setItem("sla-has-visited", "true")
      }, 4000)

      return () => {
        clearInterval(stepTimer)
        clearInterval(progressTimer)
        clearTimeout(loadTimer)
      }
    }
    // If user has visited before, don't show loading screen
  }, [loadingSteps.length])

  if (!isLoading) return null

  const currentStepData = loadingSteps[currentStep]

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-400/5 to-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-4">
        {/* Logo Animation */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/50 animate-bounce mx-auto">
            <div className="w-18 h-18 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 animate-ping"></div>
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            SCHOENSTATT
          </h1>
          <p className="text-yellow-400 font-medium tracking-wider">LANGUAGE ACADEMY</p>
        </div>

        {/* Loading Steps */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            {currentStepData && (
              <>
                <currentStepData.icon className={`h-6 w-6 ${currentStepData.color} animate-spin`} />
                <span className={`${currentStepData.color} font-medium animate-pulse`}>{currentStepData.text}</span>
              </>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mx-auto">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-gray-400 text-sm">{progress}%</div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
