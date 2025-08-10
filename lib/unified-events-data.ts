// Icons are now stored as strings and mapped to components in client components
// This avoids serialization issues with React components

export interface GalleryItem {
  id: number
  src: string
  alt: string
  title: string
  description: string
}

export interface UnifiedEvent {
  id: number
  title: string
  description: string
  excerpt?: string // Short version for news cards
  date: string
  category: string
  type: string
  location: string
  image: string
  icon: string
  gradient: string
  priority: "high" | "medium" | "low"
  isNew: boolean
  
  // Gallery related
  gallery: string[] // Simple array for backward compatibility
  galleryItems?: GalleryItem[] // Detailed gallery objects for detail pages
  hasGallery: boolean
  galleryCount: number
  
  // News/Article specific
  author: string
  readTime: string
  
  // Detail page specific
  fullContent?: string // HTML content for detail pages
  tags?: string[] // Tags for categorization
  
  // Component visibility flags
  showInEventsPage: boolean
  showInNewsSection: boolean
  showInNoticeBoard: boolean
  showInRelatedArticles: boolean
}

export const unifiedEventsData: UnifiedEvent[] = [
  {
    id: 1,
    title: "New SLA Building at Kuttur, Thrissur",
    description: "Grand opening of our new state-of-the-art facility at Kuttur, Thrissur with modern classrooms, advanced language labs, and comfortable student facilities.",
    excerpt: "We are excited to announce the opening of our new state-of-the-art facility at Kuttur, Thrissur with modern classrooms and advanced learning equipment.",
    date: "January 15, 2025",
    category: "Infrastructure",
    type: "New Building",
    location: "Kuttur, Thrissur",
    image: "/images/events/sla_newbulding.webp",
    icon: "Building",
    gradient: "from-blue-400 to-blue-600",
    priority: "high",
    isNew: true,
    gallery: [
      "/images/events/sla_newbulding.webp",
      "/images/events/buliding-support.webp",
    ],
    galleryItems: [
      {
        id: 1,
        src: "/images/events/sla_newbulding.webp",
        alt: "New SLA Building Exterior",
        title: "Modern Building Exterior",
        description: "The impressive facade of our new Kuttur facility",
      },
      {
        id: 2,
        src: "/images/events/buliding-support.webp",
        alt: "Smart Classroom Interior",
        title: "Smart Classroom Setup",
        description: "Interactive learning environment with modern technology",
      },
      
    ],
    hasGallery: true,
    galleryCount: 5,
    author: "SLA Administration",
    readTime: "3 min read",
    fullContent: `
      <p>We are thrilled to announce the grand opening of our brand new, state-of-the-art facility at Kuttur, Thrissur. This milestone represents a significant step forward in our mission to provide world-class German language education in Kerala.</p>
      
      <h3>Modern Infrastructure</h3>
      <p>The new building features cutting-edge amenities designed specifically for language learning:</p>
      <ul>
        <li>Smart classrooms equipped with interactive whiteboards and audio-visual systems</li>
        <li>Advanced language laboratory with individual workstations</li>
        <li>Comfortable student lounge and study areas</li>
        <li>Modern library with extensive German literature collection</li>
        <li>High-speed internet connectivity throughout the building</li>
      </ul>
      
      <h3>Enhanced Learning Experience</h3>
      <p>Our new facility is designed to create an immersive German learning environment. The classrooms are acoustically optimized for language instruction, and the technology integration allows for interactive lessons that engage students in new and exciting ways.</p>
      
      <h3>Community Impact</h3>
      <p>This expansion allows us to accommodate more students and offer additional programs, furthering our commitment to making quality German language education accessible to everyone in Kerala.</p>
    `,
    tags: ["Infrastructure", "Expansion", "Thrissur", "Modern Facilities"],
    showInEventsPage: true,
    showInNewsSection: true,
    showInNoticeBoard: true,
    showInRelatedArticles: true,
  },
  {
    id: 2,
    title: "B2 Level Graduates - December 2024",
    description: "Celebrating the outstanding achievements of our B2 level graduates including Zahra Thasneem and Liya Sanju who successfully completed their Telc certification with excellent scores.",
    excerpt: "Celebrating the outstanding achievements of our B2 level graduates including Zahra Thasneem and Liya Sanju who successfully completed their Telc certification.",
    date: "December 20, 2024",
    category: "Graduation",
    type: "Certificate Ceremony",
    location: "All Centers",
    image: "/images/graduates-cert1.jpg",
    icon: "Award",
    gradient: "from-yellow-400 to-yellow-600",
    priority: "high",
    isNew: true,
    gallery: [
      "/images/graduates-cert1.jpg",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    hasGallery: true,
    galleryCount: 3,
    author: "Academic Department",
    readTime: "4 min read",
    showInEventsPage: true,
    showInNewsSection: true,
    showInNoticeBoard: true,
    showInRelatedArticles: true,
  },
  {
    id: 3,
    title: "SLA Connects - Students in Germany",
    description: "Our successful students including Theresa Davis, Meera Xavier, Sabitha Jose, Calvin Vinesh, Joel Biju, and Amal K Sujit have secured excellent opportunities in Germany.",
    excerpt: "Our students including Theresa Davis, Meera Xavier, Sabitha Jose, and others have successfully secured positions in Germany.",
    date: "December 15, 2024",
    category: "Success Story",
    type: "Achievement",
    location: "Germany",
    image: "/placeholder.svg?height=300&width=400",
    icon: "Users",
    gradient: "from-green-400 to-green-600",
    priority: "medium",
    isNew: false,
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    hasGallery: true,
    galleryCount: 3,
    author: "Student Relations",
    readTime: "4 min read",
    showInEventsPage: true,
    showInNewsSection: false,
    showInNoticeBoard: true,
    showInRelatedArticles: true,
  },
  {
    id: 4,
    title: "SLA Cares - Community Outreach Program",
    description: "Our faculty and students participated in various community service activities, strengthening bonds with the local community and giving back to society through meaningful initiatives.",
    excerpt: "Our faculty and students participated in various community service activities, strengthening bonds with the local community.",
    date: "December 10, 2024",
    category: "Community",
    type: "Social Service",
    location: "All Centers",
    image: "/placeholder.svg?height=300&width=400",
    icon: "Users",
    gradient: "from-purple-400 to-purple-600",
    priority: "medium",
    isNew: false,
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    hasGallery: true,
    galleryCount: 3,
    author: "Community Relations",
    readTime: "3 min read",
    showInEventsPage: true,
    showInNewsSection: true,
    showInNoticeBoard: true,
    showInRelatedArticles: true,
  },
  {
    id: 5,
    title: "Digital Learning Initiative Launch",
    description: "SLA introduces cutting-edge digital learning platforms and AI-powered language tools to enhance the German learning experience for all students.",
    excerpt: "SLA introduces cutting-edge digital learning platforms and AI-powered language tools to enhance the German learning experience.",
    date: "January 8, 2025",
    category: "Technology",
    type: "Innovation",
    location: "All Centers",
    image: "/placeholder.svg?height=250&width=350",
    icon: "BookOpen",
    gradient: "from-purple-400 to-pink-500",
    priority: "medium",
    isNew: true,
    gallery: [],
    hasGallery: false,
    galleryCount: 0,
    author: "Technology Team",
    readTime: "5 min read",
    showInEventsPage: true,
    showInNewsSection: true,
    showInNoticeBoard: false,
    showInRelatedArticles: true,
  },
  {
    id: 6,
    title: "A2 Level Graduation Ceremony",
    description: "Proud celebration of our A2 level course completers who have successfully mastered the elementary level of German language with dedication and hard work.",
    excerpt: "Celebrating our A2 level graduates who have successfully completed their elementary German language certification.",
    date: "November 25, 2024",
    category: "Graduation",
    type: "Certificate Ceremony",
    location: "All Centers",
    image: "/placeholder.svg?height=300&width=400",
    icon: "Award",
    gradient: "from-orange-400 to-red-500",
    priority: "low",
    isNew: false,
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    hasGallery: true,
    galleryCount: 2,
    author: "Academic Department",
    readTime: "3 min read",
    showInEventsPage: true,
    showInNewsSection: false,
    showInNoticeBoard: false,
    showInRelatedArticles: true,
  },
]

// Helper functions to filter events for specific components
export const getEventsForEventsPage = () => 
  unifiedEventsData.filter(event => event.showInEventsPage)

export const getEventsForNewsSection = () => 
  unifiedEventsData.filter(event => event.showInNewsSection)

export const getEventsForNoticeBoard = () => 
  unifiedEventsData.filter(event => event.showInNoticeBoard)

// Get events by priority
export const getEventsByPriority = (priority: "high" | "medium" | "low") =>
  unifiedEventsData.filter(event => event.priority === priority)

// Get new events
export const getNewEvents = () =>
  unifiedEventsData.filter(event => event.isNew)

// Get events by category
export const getEventsByCategory = (category: string) =>
  unifiedEventsData.filter(event => event.category === category)

// Get event by ID for detail pages
export const getEventById = (id: number): UnifiedEvent | undefined => {
  return unifiedEventsData.find(event => event.id === id)
}

// Get related articles for an event (excludes the current event)
export const getRelatedArticles = (currentEventId: number, limit: number = 3): UnifiedEvent[] => {
  return unifiedEventsData
    .filter(event => event.showInRelatedArticles && event.id !== currentEventId)
    .sort((a, b) => {
      // Sort by priority first (high > medium > low), then by date (newest first)
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, limit)
}
