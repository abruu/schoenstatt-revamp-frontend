export interface NavigationItem {
  name: string
  href: string
}

export interface Center {
  id: string
  name: string
  address: string
  phone: string
  email: string
  timings: string
  students: string
  established: string
  gradient: string
  features: string[]
}

export interface ContactInfo {
  type: string
  title: string
  details: string[]
  gradient: string
}

export interface GalleryImage {
  id: number
  src: string
  alt: string
  category: string
  title: string
  description: string
}

export interface Event {
  id: number | string
  title: string
  description: string
  date: string
  category: string
  type: string
  location: string
  image?: string
  icon: any
  gradient: string
  priority: string
  isNew: boolean
  gallery?: GalleryImage[]
}

export interface Graduate {
  title: string
  date: string
  type: string
  description: string
  studentCount: number
  successRate: string
  level: string
  gradient: string
  icon: any
}

export interface Testimonial {
  name: string
  course: string
  location: string
  image: string
  rating: number
  feedback: string
  achievement: string
  gradient: string
}

export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  date: string
  location: string
  type: string
  author: string
  readTime: string
  isNew: boolean
  hasGallery: boolean
  galleryCount: number
  icon: any
  gradient: string
  category: string
  image: string
}

export interface Notice {
  id: number
  type: string
  title: string
  description: string
  date: string
  icon: any
  gradient: string
  priority: string
}
