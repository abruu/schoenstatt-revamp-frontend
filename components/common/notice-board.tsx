"use client"

import { useState, useEffect } from "react"
import { X, Bell, Calendar, ChevronRight, BellRing, Loader2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getEventsForNoticeBoard, UnifiedEvent } from "@/lib/unified-events-data"
import { DateDisplay } from "./date-display"
import { useApiStore } from "@/lib/stores/api-store"

// Using UnifiedEvent interface from unified-events-data
export function NoticeBoard() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentNotice, setCurrentNotice] = useState(0)
  const [showBellIcon, setShowBellIcon] = useState(false)
  const [hasNewNotices, setHasNewNotices] = useState(true)

  const {
    events,
    eventsLoading,
    eventsError,
    fetchEvents,
    clearError
  } = useApiStore();


  const notices: UnifiedEvent[] = getEventsForNoticeBoard()

  useEffect(() => {
    // Check if notice board was previously closed
    const noticeBoardClosed = localStorage.getItem("noticeBoardClosed")
    const lastClosedTime = localStorage.getItem("noticeBoardClosedTime")

    // Show notice board after page loads if not recently closed and we have notices
    const timer = setTimeout(() => {
      if (
        notices.length > 0 &&
        (!noticeBoardClosed ||
        (lastClosedTime && Date.now() - Number.parseInt(lastClosedTime) > 24 * 60 * 60 * 1000))
      ) {
        setIsVisible(true)
      } else if (notices.length > 0) {
        setShowBellIcon(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [notices.length])

  useEffect(() => {
    if (isVisible && notices.length > 0) {
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

  // Make sure we have notices before accessing them
  const currentNoticeData = notices.length > 0 ? notices[currentNotice] : null

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

  // Loading state
  // if (eventsLoading) {
  //   return (
  //     <div className="fixed top-20 right-2 left-2 sm:top-24 sm:right-6 sm:left-auto z-40 max-w-sm sm:max-w-sm mx-auto sm:mx-0 animate-slide-in-right">
  //       <div className="relative">
  //         <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
  //         <div className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-center py-8 space-y-4">
  //           <Loader2 className="h-8 w-8 text-yellow-400 animate-spin" />
  //           <div className="text-gray-400 font-medium">Loading notices...</div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Error state
  if (eventsError && showBellIcon) {
    return (
      <div className="fixed top-20 right-2 left-2 sm:top-24 sm:right-6 sm:left-auto z-40 max-w-sm sm:max-w-sm mx-auto sm:mx-0 animate-slide-in-right">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-red-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
          <div className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-semibold text-sm sm:text-base">Notice Board</span>
              </div>
              <Button onClick={() => setShowBellIcon(false)} size="icon" className="w-6 h-6 bg-white hover:bg-white/20 border-none">
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
              <div className="p-4 rounded-full bg-white/5 border border-white/10">
                <Zap className="h-8 w-8 text-red-400" />
              </div>
              <div className="text-red-400 font-medium">Error loading notices</div>
              <p className="text-gray-500 text-sm">{eventsError}</p>
              <Button
                size="sm"
                onClick={() => {
                  clearError();
                  fetchEvents();
                }}
                className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 h-auto mt-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no notices available and bell icon is not showing, don't render anything
  if (notices.length === 0 && !showBellIcon) return null

  // If no notices but bell icon is showing, show empty state
  if (notices.length === 0 && showBellIcon) {
    return (
      <div className="fixed top-20 right-2 left-2 sm:top-24 sm:right-6 sm:left-auto z-40 max-w-sm sm:max-w-sm mx-auto sm:mx-0 animate-slide-in-right">
        <div className="relative">
          {/* Glowing background */}
          <div
            className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-30 animate-pulse"
          ></div>

          {/* Empty notice board */}
          <div className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"
                >
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-semibold text-sm sm:text-base">Notice Board</span>
              </div>
              <Button onClick={() => setShowBellIcon(false)} size="icon" className="w-6 h-6 bg-white hover:bg-white/20 border-none">
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>

            {/* Empty state content */}
            <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
              <div className="p-4 rounded-full bg-white/5 border border-white/10">
                <BellRing className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-gray-400 font-medium">No notices available</div>
              <p className="text-gray-500 text-sm">There are no new notices or announcements at the moment. Please check back later.</p>
              <Link href="/events">
                <Button
                  size="sm"
                  className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 h-auto mt-2"
                >
                  View All Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-20 right-2 left-2 sm:top-24 sm:right-6 sm:left-auto z-40 max-w-sm sm:max-w-sm mx-auto sm:mx-0 animate-slide-in-right">
      <div className="relative">
        {/* Glowing background */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${typeof currentNoticeData?.gradient === 'string' ? currentNoticeData?.gradient : currentNoticeData?.gradient?.className || 'from-yellow-400 to-yellow-600'} rounded-2xl blur-lg opacity-30 animate-pulse`}
        ></div>

        {/* Main notice board */}
        <div className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 bg-gradient-to-r ${typeof currentNoticeData?.gradient === 'string' ? currentNoticeData?.gradient : currentNoticeData?.gradient?.className || 'from-yellow-400 to-yellow-600'} rounded-full flex items-center justify-center`}
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
              <Button onClick={handleClose} size="icon" className="w-6 h-6 bg-white hover:bg-white/20 border-none">
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Notice Content */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`bg-gradient-to-r ${typeof currentNoticeData?.gradient === 'string' ? currentNoticeData?.gradient : currentNoticeData?.gradient?.className || 'from-yellow-400 to-yellow-600'} text-white text-xs`}>
                    {currentNoticeData?.type || 'Notice'}
                  </Badge>
                  {currentNoticeData?.isNew && (
                    <Badge className="bg-red-500 text-white text-xs animate-pulse">New</Badge>
                  )}
                </div>
                <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight mb-2 line-clamp-2">{currentNoticeData?.title}</h4>
                <p className="text-gray-300 text-xs leading-relaxed mb-3 line-clamp-3">{currentNoticeData?.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <DateDisplay date={currentNoticeData?.date} />
                  </div>
                  <Link href={`/events/${currentNoticeData?.documentId}`}>
                    <Button
                      size="sm"
                      className={`bg-gradient-to-r ${typeof currentNoticeData?.gradient === 'string' ? currentNoticeData?.gradient : currentNoticeData?.gradient?.className || 'from-yellow-400 to-yellow-600'} text-white text-xs px-2 sm:px-3 py-1 h-auto`}
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
                    ? `bg-gradient-to-r ${typeof currentNoticeData?.gradient === 'string' ? currentNoticeData?.gradient : currentNoticeData?.gradient?.className || 'from-yellow-400 to-yellow-600'}`
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
