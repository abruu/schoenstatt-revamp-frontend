"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAVIGATION_ITEMS, SITE_CONFIG } from "@/lib/constants"
import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const scrolled = useScroll()
  const router = useRouter()
  const pathname = usePathname()

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Track active section on homepage
  useEffect(() => {
    if (pathname !== "/") return

    const handleScroll = () => {
      const sections = ["home", "courses", "about", "centers", "gallery", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // Handle hash navigation and update active section
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      if (hash && pathname === "/") {
        setActiveSection(hash)
      }
    }

    // Set initial active section from hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [pathname])

  const handleNavigation = (href: string, itemName: string) => {
    setIsOpen(false) // Close mobile menu immediately

    if (href.startsWith("#")) {
      const sectionId = href.substring(1)

      if (pathname === "/") {
        // We're on homepage, smooth scroll to section WITHOUT page refresh
        setActiveSection(sectionId)
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
        // Update URL hash without triggering navigation or page refresh
        if (window.location.hash !== href) {
          window.history.replaceState(null, "", href)
        }
      } else {
        // We're on a different page, use Next.js router to navigate
        setActiveSection(sectionId)
        router.push(`/${href}`)
      }
    } else {
      // External page navigation
      router.push(href)
      // Reset active section when navigating to other pages
      setActiveSection("")
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 100)
    }
  }

  const isActiveItem = (item: (typeof NAVIGATION_ITEMS)[0]) => {
    if (item.href.startsWith("#")) {
      // For anchor links
      const sectionId = item.href.substring(1)

      if (pathname === "/") {
        // On homepage, check scroll-based active section
        return activeSection === sectionId
      } else {
        // On other pages, no section is active
        return false
      }
    } else {
      // For page links, check pathname
      return pathname === item.href
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/20 backdrop-blur-xl border-b border-white/10" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" })
              } else {
                router.push("/")
              }
            }}
            className="flex items-center space-x-2 sm:space-x-3 group hover:scale-105 transition-transform duration-300"
          >
            <div className="relative">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/50 group-hover:shadow-yellow-400/70 transition-shadow duration-300">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {SITE_CONFIG.shortName}
              </span>
              <span className="text-xs sm:text-sm text-yellow-400 font-medium tracking-wider">LANGUAGE ACADEMY</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = isActiveItem(item)
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.name)}
                  className={cn(
                    "relative transition-all duration-300 group py-2 px-1",
                    isActive ? "text-yellow-400" : "text-white/80 hover:text-white",
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  ></span>
                </button>
              )
            })}
          </nav>

          {/* CTA Button */}
          <Link href="/register">
            <Button className="hidden lg:flex bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-8 py-3 rounded-full shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105">
              Register Now
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/95 backdrop-blur-xl transition-all duration-500 z-[60]",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        style={{
          top: "80px",
          backgroundColor: "rgba(0, 0, 0, 0.98)",
          backgroundImage: "none"
        }}
      >
        <div className="container mx-auto px-4  bg-black/95 sm:px-6 py-6 sm:py-8">
          <nav className="space-y-4 sm:space-y-6">
            {NAVIGATION_ITEMS.map((item, index) => {
              const isActive = isActiveItem(item)
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.name)}
                  className={cn(
                    "block text-xl sm:text-2xl font-medium transition-all duration-300 hover:translate-x-2 sm:hover:translate-x-4 text-left w-full",
                    isActive ? "text-yellow-400" : "text-white/80 hover:text-white",
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isOpen ? "slideInLeft 0.5s ease-out forwards" : "none",
                  }}
                >
                  {item.name}
                </button>
              )
            })}
            <Link href="/register" className="block mt-8">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-8 py-3 rounded-full w-full">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
