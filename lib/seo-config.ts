import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  title: {
    template: '%s | Schoenstatt Language Academy',
    default: 'German Language Courses Kerala | Schoenstatt Language Academy'
  },
  description: 'Learn German in Kerala with certified instructors. A1-B2 courses, Telc certification, 95% success rate. Join 500+ students at SLA Thrissur, Chalakudy, Peravoor.',
  keywords: 'German language courses Kerala, German classes Thrissur, Telc certification India, German language academy, B2 German course',
  authors: [{ name: 'Schoenstatt Language Academy' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sla.schoenstatt-fathers.in',
    siteName: 'Schoenstatt Language Academy',
    title: 'German Language Courses Kerala | Schoenstatt Language Academy',
    description: 'Premier German language institute in Kerala offering A1-B2 courses with Telc certification. Expert faculty, modern facilities, proven results.',
    images: [
      {
        url: '/og/sla-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Schoenstatt Language Academy - German Language Courses Kerala',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}
