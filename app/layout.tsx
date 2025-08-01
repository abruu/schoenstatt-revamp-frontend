import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SITE_CONFIG } from "@/lib/constants"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ["German language", "Language learning", "Kerala", "Telc exam", "German courses", "Schoenstatt"],
  authors: [
    {
      name: "Schoenstatt Language Academy",
      url: SITE_CONFIG.url,
    },
  ],
  creator: "Schoenstatt Language Academy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced hash navigation handler - NO PAGE REFRESH
              function scrollToHash(hash, retries = 0) {
                if (!hash) return;
                
                const element = document.getElementById(hash);
                if (element) {
                  // Add a small delay to ensure page is fully loaded
                  setTimeout(() => {
                    element.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start',
                      inline: 'nearest'
                    });
                  }, 100);
                } else if (retries < 10) {
                  // Retry if element not found (page might still be loading)
                  setTimeout(() => scrollToHash(hash, retries + 1), 200);
                }
              }
              
              function handleHashNavigation() {
                const hash = window.location.hash.substring(1);
                if (hash && window.location.pathname === '/') {
                  scrollToHash(hash);
                }
              }
              
              // Handle initial page load
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', handleHashNavigation);
              } else {
                handleHashNavigation();
              }
              
              // Handle route changes (for Next.js navigation) - NO PAGE REFRESH
              let currentUrl = window.location.href;
              const observer = new MutationObserver(() => {
                if (window.location.href !== currentUrl) {
                  currentUrl = window.location.href;
                  // Only handle hash navigation, not full page changes
                  if (window.location.pathname === '/') {
                    setTimeout(handleHashNavigation, 100);
                  }
                }
              });
              
              observer.observe(document.body, { 
                childList: true, 
                subtree: true,
                attributes: true,
                attributeFilter: ['data-nextjs-scroll-focus-boundary']
              });
              
              // Handle popstate events (browser back/forward) - NO PAGE REFRESH
              window.addEventListener('popstate', () => {
                if (window.location.pathname === '/') {
                  setTimeout(handleHashNavigation, 100);
                }
              });
              
              // Handle hashchange events - NO PAGE REFRESH
              window.addEventListener('hashchange', () => {
                if (window.location.pathname === '/') {
                  handleHashNavigation();
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
