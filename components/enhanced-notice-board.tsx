"use client"

import { useState, useEffect } from "react"
import { X, Bell, Calendar, Users, Award, MapPin, ChevronRight, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function EnhancedNoticeBoard() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentNotice, setCurrentNotice] = useState(0)
  const [showBellIcon, setShowBellIcon] = useState(false)
  const [hasNewNotices, setHasNewNotices] = useState(true)

  const notices = [
    {
      id: 1,
      type: "New Building",
      title: "New SLA Building at Kuttur, Thrissur",
      description:
        "We are excited to announce the opening of our new state-of-the-art facility at Kuttur, Thrissur with modern classrooms and advanced learning equipment.",
      date: "January 15, 2025",
      icon: MapPin,
      gradient: "from-blue-400 to-blue-600",
      priority: "high",
      isNew: true,
    },
    {
      id: 2,
      type: "Graduation",
      title: "B2 Level Graduates - Congratulations!",
      description:
        "Congratulations to Zahra Thasneem and Liya Sanju for successfully completing their B2 level German certification with excellent scores.",
      date: "January 10, 2025",
      icon: Award,
      gradient: "from-yellow-400 to-yellow-600",
      priority: "medium",
      isNew: true,
    },
    {
      id: 3,
      type: "Success Story",
      title: "Students Successfully Placed in Germany",
      description:
        "Our students including Theresa Davis, Meera Xavier, Sabitha Jose, and others have successfully secured positions in Germany.",
      date: "December 28, 2024",
      icon: Users,
      gradient: "from-green-400 to-green-600",
      priority: "medium",
      isNew: false,
    },
    {
      id: 4,
      type: "Community",
      title: "SLA Cares - Community Outreach Program",
      description:
        "Our faculty and students participated in community service activities, strengthening bonds and giving back to society.",
      date: "December 20, 2024",
      icon: Users,
      gradient: "from-purple-400 to-purple-600",
      priority: "low",
      isNew: false,
    },
  ]

  useEffect(() => {
    // Check if notice board was previously closed
    const noticeBoardClosed = localStorage.getItem("noticeBoardClosed")
    const lastClosedTime = localStorage.getItem("noticeBoardClosedTime")

    // Show notice board after page loads if not recently closed
    const timer = setTimeout(() => {
      if (
        !noticeBoardClosed ||
        (lastClosedTime && Date.now() - Number.parseInt(lastClosedTime) > 24 * 60 * 60 * 1000)
      ) {
        setIsVisible(true)
      } else {
        setShowBellIcon(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) {
      const noticeTimer = setInterval(() => {
        setCurrentNotice((prev) => (prev + 1) % notices.length)
      }, 4000)

      return () => clearInterval(noticeTimer)
    }
  }, [isVisible, notices.length])

  const handleClose = () => {
    setIsVisible(false)
    setShowBellIcon(true)
    localStorage.setItem("noticeBoardClosed", "true")
    localStorage.setItem("noticeBoardClosedTime", Date.now().toString())
  }

  const handleBellClick = () => {
    setIsVisible(true)
    setShowBellIcon(false)
    setHasNewNotices(false)
    localStorage.removeItem("noticeBoardClosed")
    localStorage.removeItem("noticeBoardClosedTime")
  }

  const currentNoticeData = notices[currentNotice]

  // Bell Icon (shows when notice board is closed)
  if (showBellIcon && !isVisible) {
    return (
      <div className="fixed top-24 right-6 z-40">
        <Button
          onClick={handleBellClick}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-110"
        >
          <BellRing className="h-6 w-6 animate-bounce" />
          {hasNewNotices && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          )}
        </Button>
      </div>
    )
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-24 right-6 z-40 max-w-sm animate-slide-in-right">
      <div className="relative">
        {/* Glowing background */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${currentNoticeData.gradient} rounded-2xl blur-lg opacity-30 animate-pulse`}
        ></div>

        {/* Main notice board */}
        <div className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 bg-gradient-to-r ${currentNoticeData.gradient} rounded-full flex items-center justify-center`}
              >
                <Bell className="h-4 w-4 text-white animate-bounce" />
              </div>
              <span className="text-white font-semibold">Notice Board</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/events">
                <Button
                  size="sm"
                  className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 h-auto"
                >
                  View All
                </Button>
              </Link>
              <Button onClick={handleClose} size="icon" className="w-6 h-6 bg-white/10 hover:bg-white/20 border-none">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notice Content */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${currentNoticeData.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                <currentNoticeData.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`bg-gradient-to-r ${currentNoticeData.gradient} text-white text-xs`}>
                    {currentNoticeData.type}
                  </Badge>
                  {currentNoticeData.isNew && (
                    <Badge className="bg-red-500 text-white text-xs animate-pulse">New</Badge>
                  )}
                </div>
                <h4 className="text-white font-semibold text-sm leading-tight mb-2">{currentNoticeData.title}</h4>
                <p className="text-gray-300 text-xs leading-relaxed mb-3">{currentNoticeData.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar className="h-3 w-3" />
                    {currentNoticeData.date}
                  </div>
                  <Link href={`/events/${currentNoticeData.id}`}>
                    <Button
                      size="sm"
                      className={`bg-gradient-to-r ${currentNoticeData.gradient} text-white text-xs px-3 py-1 h-auto`}
                    >
                      Read More
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Notice Indicators */}
          <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-white/10">
            {notices.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentNotice(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentNotice
                    ? `bg-gradient-to-r ${currentNoticeData.gradient}`
                    : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
