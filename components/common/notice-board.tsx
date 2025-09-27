"use client"

import { useState, useEffect } from "react"
import { X, Bell, Calendar, Users, Award, MapPin, ChevronRight, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getEventsForNoticeBoard, UnifiedEvent } from "@/lib/unified-events-data"
import { getIconComponent } from "@/lib/icon-mapping"

// Using UnifiedEvent interface from unified-events-data

export function NoticeBoard() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentNotice, setCurrentNotice] = useState(0)
  const [showBellIcon, setShowBellIcon] = useState(false)
  const [hasNewNotices, setHasNewNotices] = useState(true)

  const notices: UnifiedEvent[] = getEventsForNoticeBoard()

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
      <div className="fixed top-20 right-4 sm:top-24 sm:right-6 z-40">
        <Button
          onClick={handleBellClick}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-110"
        >
          <BellRing className="h-5 w-5 sm:h-6 sm:w-6 animate-bounce" />
          {hasNewNotices && (
            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          )}
        </Button>
      </div>
    )
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-20 right-2 left-2 sm:top-24 sm:right-6 sm:left-auto z-40 max-w-sm sm:max-w-sm mx-auto sm:mx-0 animate-slide-in-right">
      <div className="relative">
        {/* Glowing background */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${currentNoticeData.gradient} rounded-2xl blur-lg opacity-30 animate-pulse`}
        ></div>

        {/* Main notice board */}
        <div className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 bg-gradient-to-r ${currentNoticeData.gradient} rounded-full flex items-center justify-center`}
              >
                <Bell className="h-4 w-4 text-white animate-bounce" />
              </div>
              <span className="text-white font-semibold text-sm sm:text-base">Notice Board</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/events">
                <Button
                  size="sm"
                  className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-2 sm:px-3 py-1 h-auto"
                >
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                </Button>
              </Link>
              <Button onClick={handleClose} size="icon" className="w-6 h-6 bg-white/10 hover:bg-white/20 border-none">
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Notice Content */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${currentNoticeData.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                {(() => {
                  const IconComponent = getIconComponent(currentNoticeData.icon)
                  return <IconComponent className="h-5 w-5 text-white" />
                })()}
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
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight mb-2 line-clamp-2">{currentNoticeData.title}</h4>
                <p className="text-gray-300 text-xs leading-relaxed mb-3 line-clamp-3">{currentNoticeData.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar className="h-3 w-3" />
                    {currentNoticeData.date}
                  </div>
                  <Link href={`/events/${currentNoticeData.id}`}>
                    <Button
                      size="sm"
                      className={`bg-gradient-to-r ${currentNoticeData.gradient} text-white text-xs px-2 sm:px-3 py-1 h-auto`}
                    >
                      <span className="hidden sm:inline">Read More</span>
                      <span className="sm:hidden">Read</span>
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
