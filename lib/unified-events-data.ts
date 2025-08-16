// Icons are now stored as strings and mapped to components in client components
// This avoids serialization issues with React components

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title?: string | any;
  description?: string | any;
}

export interface UnifiedEvent {
  id: number;
  title: string;
  description: string;
  excerpt?: string; // Short version for news cards
  date: string;
  endDate?: string; // End date for notice board visibility
  category: string;
  type: string;
  location: string;
  image: string;
  icon: string;
  gradient: string;
  priority: "high" | "medium" | "low";
  isNew: boolean;

  // Gallery related
  gallery: string[]; // Simple array for backward compatibility
  galleryItems?: GalleryItem[]; // Detailed gallery objects for detail pages
  hasGallery: boolean;
  galleryCount: number;

  // News/Article specific
  author: string;
  readTime: string;

  // Detail page specific
  fullContent?: string; // HTML content for detail pages
  tags?: string[]; // Tags for categorization

  // Component visibility flags
  showInEventsPage: boolean;
  showInNewsSection: boolean;
  showInNoticeBoard: boolean;
  showInRelatedArticles: boolean;
}

export const unifiedEventsData: UnifiedEvent[] = [
  {
    id: 1,
    title: "New SLA Building at Kuttur, Thrissur",
    description:
      "Grand opening of our new state-of-the-art facility at Kuttur, Thrissur with modern classrooms, advanced language labs, and comfortable student facilities.",
    excerpt:
      "We are excited to announce the opening of our new state-of-the-art facility at Kuttur, Thrissur with modern classrooms and advanced learning equipment.",
    date: "January 15, 2025",
    // endDate: "March 15, 2025",
    category: "Updates",
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
    title: "SLA Updated",
    description:
      "Stay informed with SLA Updates! Here you’ll find the latest news, announcements, and important information about our programs and events. Keep up-to-date with everything happening at SLA.",
    excerpt: "Latest News and Announcements",
    date: "December 20, 2024",
    // endDate: "January 20, 2025",
    category: "Updates",
    type: "Updates",
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
    fullContent:
      "Stay informed with SLA Updates! Here you’ll find the latest news, announcements, and important information about our programs and events. Keep up-to-date with everything happening at SLA.",
    galleryItems: [
      {
        id: 3,
        src: "/images/SLA updated/welcome-SLA.webp",
        alt: "Welcome to SLA",
        title: "Welcome to SLA",
        description: "Official welcome message from SLA",
      },
      {
        id: 4,
        src: "/images/SLA updated/Fr-Babu-1-insta-1.webp",
        alt: "Fr. Babu Instagram Post",
        title: "Fr. Babu Update",
        description: "Latest update from Fr. Babu",
      },
      {
        id: 5,
        src: "/images/SLA updated/Insta-post-for-Fr.-Babu-2-2.webp",
        alt: "Fr. Babu Instagram Post 2",
        title: "Fr. Babu Update 2",
        description: "Additional update from Fr. Babu",
      },
      {
        id: 6,
        src: "/images/SLA updated/Insta-post-for-Fr.-Babu-3-1.webp",
        alt: "Fr. Babu Instagram Post 3",
        title: "Fr. Babu Update 3",
        description: "Latest announcement from Fr. Babu",
      },
      {
        id: 7,
        src: "/images/SLA updated/ONLINE-CLASS-scaled.webp",
        alt: "Online Class Session",
        title: "Online Classes",
        description: "SLA online learning platform in action",
      },
      {
        id: 8,
        src: "/images/SLA updated/Telc-exam-result.webp",
        alt: "Telc Exam Results",
        title: "Telc Exam Results",
        description: "Latest Telc examination results announcement",
      },
      {
        id: 9,
        src: "/images/SLA updated/b2-exam-preparation.webp",
        alt: "B2 Exam Preparation",
        title: "B2 Level Preparation",
        description: "B2 level German exam preparation materials",
      },
      {
        id: 10,
        src: "/images/SLA updated/6.webp",
        alt: "SLA Update Image",
        title: "SLA News Update",
        description: "Latest news and updates from SLA",
      },
    ],
    hasGallery: true,
    galleryCount: 10,
    author: "Academic Department",
    readTime: "4 min read",
    showInEventsPage: true,
    showInNewsSection: true,
    showInNoticeBoard: true,
    showInRelatedArticles: true,
  },
  {
    id: 3,
    title: "SLA Connect",
    description:
      "Explore our photo gallery capturing the joyful moments of our students in Germany. See how they are thriving and enjoying their time abroad, making memories that last a lifetime.",
    excerpt: "Latest News and Announcements",
    date: "July 20, 2025",
    // endDate: "September 20, 2025",
    category: "Connect",
    type: "Connect",
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
    fullContent:
      "Explore our photo gallery capturing the joyful moments of our students in Germany. See how they are thriving and enjoying their time abroad, making memories that last a lifetime.",
    galleryItems: [
      {
        id: 1,
        src: "/images/SLA connects/SLA connects 1.jpg",
        alt: "SLA Students in Germany",
        title: "Students in Germany",
        description: "Our successful students enjoying their time in Germany",
      },
      {
        id: 2,
        src: "/images/SLA connects/SLA connects 2.jpg",
        alt: "SLA Connect Group Photo",
        title: "Group Celebration",
        description: "Students celebrating their achievements together",
      },
      {
        id: 3,
        src: "/images/SLA connects/SLA connects 3.jpg",
        alt: "SLA Students Achievement",
        title: "Achievement Moment",
        description: "Proud moment of our students' success",
      },
      {
        id: 4,
        src: "/images/SLA connects/SLA connects4.jpg",
        alt: "SLA Connect Experience",
        title: "Germany Experience",
        description: "Students sharing their Germany experience",
      },
      {
        id: 5,
        src: "/images/SLA connects/SLA connects5.jpg",
        alt: "SLA Students Together",
        title: "Students Together",
        description: "SLA students bonding in Germany",
      },
      {
        id: 6,
        src: "/images/SLA connects/SLA connects6.jpg",
        alt: "SLA Connect Journey",
        title: "Success Journey",
        description: "Journey of success with SLA Connect",
      },
      {
        id: 7,
        src: "/images/SLA connects/SLA connects8.jpg",
        alt: "SLA Students Life",
        title: "Life in Germany",
        description: "Students enjoying their new life in Germany",
      },
      {
        id: 8,
        src: "/images/SLA connects/SLA connects9.jpg",
        alt: "SLA Connect Community",
        title: "SLA Community",
        description: "Strong community of SLA students abroad",
      },
      {
        id: 9,
        src: "/images/SLA connects/SLA connects10.jpg",
        alt: "SLA Success Story",
        title: "Success Stories",
        description: "Inspiring success stories from our students",
      },
      {
        id: 10,
        src: "/images/SLA connects/SLA connects11.jpg",
        alt: "SLA Connect Network",
        title: "Global Network",
        description: "Building a global network of SLA alumni",
      },
    ],
    hasGallery: true,
    galleryCount: 10,
    author: "Academic Department",
    readTime: "4 min read",
    showInEventsPage: true,
    showInNewsSection: true,
    showInNoticeBoard: true,
    showInRelatedArticles: true,
  },
  {
    id: 4,
    title: "SLA Care",
    description:
      "Explore our photo gallery capturing the joyful moments of our students in Germany. See how they are thriving and enjoying their time abroad, making memories that last a lifetime.",
    excerpt: "Latest News and Announcements",
    date: "January 10, 2025",
    // endDate: "January 31, 2025",
    category: "Care",
    type: "Care",
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
    fullContent:
      "SLA Cares showcases our commitment to community service and social responsibility. Through various outreach programs and charitable initiatives, we give back to society and make a positive impact in our communities.",
    galleryItems: [
      {
        id: 1,
        src: "/images/SLA cares/sla cares 1.png",
        alt: "SLA Community Service",
        title: "Community Service",
        description: "SLA team engaging in community service activities",
      },
      {
        id: 2,
        src: "/images/SLA cares/sla cares2.png",
        alt: "SLA Cares Initiative",
        title: "Caring Initiative",
        description: "Our caring initiatives making a difference in the community",
      },
      {
        id: 3,
        src: "/images/SLA cares/sla cares3.png",
        alt: "SLA Social Responsibility",
        title: "Social Responsibility",
        description: "Demonstrating our commitment to social responsibility",
      },
      {
        id: 4,
        src: "/images/SLA cares/sla cares 4.png",
        alt: "SLA Community Outreach",
        title: "Community Outreach",
        description: "Reaching out to help those in need",
      },
      {
        id: 5,
        src: "/images/SLA cares/sla cares 5.png",
        alt: "SLA Charitable Work",
        title: "Charitable Activities",
        description: "Engaging in meaningful charitable work",
      },
      {
        id: 6,
        src: "/images/SLA cares/sla cares 6.png",
        alt: "SLA Community Support",
        title: "Community Support",
        description: "Supporting our local community through various programs",
      },
      {
        id: 7,
        src: "/images/SLA cares/sla cares 7.png",
        alt: "SLA Volunteer Work",
        title: "Volunteer Activities",
        description: "Our volunteers making a positive impact",
      },
      {
        id: 8,
        src: "/images/SLA cares/sla cares 8.png",
        alt: "SLA Community Engagement",
        title: "Community Engagement",
        description: "Actively engaging with the community",
      },
      {
        id: 9,
        src: "/images/SLA cares/sla cares 9.png",
        alt: "SLA Social Impact",
        title: "Social Impact",
        description: "Creating meaningful social impact through our initiatives",
      },
      {
        id: 10,
        src: "/images/SLA cares/sla cares 10.png",
        alt: "SLA Care Programs",
        title: "Care Programs",
        description: "Various care programs helping the community",
      },
    ],
    hasGallery: true,
    galleryCount: 10,
    author: "Academic Department",
    readTime: "4 min read",
    showInEventsPage: true,
    showInNewsSection: true,
    showInNoticeBoard: true,
    showInRelatedArticles: true,
  },
  // {
  //   id: 5,
  //   title: "Digital Learning Initiative Launch",
  //   description:
  //     "SLA introduces cutting-edge digital learning platforms and AI-powered language tools to enhance the German learning experience for all students.",
  //   excerpt:
  //     "SLA introduces cutting-edge digital learning platforms and AI-powered language tools to enhance the German learning experience.",
  //   date: "January 8, 2025",
  //   category: "Technology",
  //   type: "Innovation",
  //   location: "All Centers",
  //   image: "/placeholder.svg?height=250&width=350",
  //   icon: "BookOpen",
  //   gradient: "from-purple-400 to-pink-500",
  //   priority: "medium",
  //   isNew: true,
  //   gallery: [],
  //   hasGallery: false,
  //   galleryCount: 0,
  //   author: "Technology Team",
  //   readTime: "5 min read",
  //   showInEventsPage: true,
  //   showInNewsSection: true,
  //   showInNoticeBoard: false,
  //   showInRelatedArticles: true,
  // },
  // {
  //   id: 6,
  //   title: "A2 Level Graduation Ceremony",
  //   description:
  //     "Proud celebration of our A2 level course completers who have successfully mastered the elementary level of German language with dedication and hard work.",
  //   excerpt:
  //     "Celebrating our A2 level graduates who have successfully completed their elementary German language certification.",
  //   date: "November 25, 2024",
  //   category: "Graduation",
  //   type: "Certificate Ceremony",
  //   location: "All Centers",
  //   image: "/placeholder.svg?height=300&width=400",
  //   icon: "Award",
  //   gradient: "from-orange-400 to-red-500",
  //   priority: "low",
  //   isNew: false,
  //   gallery: [
  //     "/placeholder.svg?height=400&width=600",
  //     "/placeholder.svg?height=400&width=600",
  //   ],
  //   hasGallery: true,
  //   galleryCount: 2,
  //   author: "Academic Department",
  //   readTime: "3 min read",
  //   showInEventsPage: true,
  //   showInNewsSection: false,
  //   showInNoticeBoard: false,
  //   showInRelatedArticles: true,
  // },
];

// Helper functions to filter events for specific components
export const getEventsForEventsPage = () =>
  unifiedEventsData.filter((event) => event.showInEventsPage);

export const getEventsForNewsSection = () =>
  unifiedEventsData.filter((event) => event.showInNewsSection);

export const getEventsForNoticeBoard = () => {
  const currentDate = new Date();
  return unifiedEventsData.filter((event) => {
    if (!event.showInNoticeBoard) return false;
    
    // If endDate is specified, check if it's still valid
    if (event.endDate) {
      const endDate = new Date(event.endDate);
      return endDate >= currentDate;
    }
    
    // If no endDate specified, show the event
    return true;
  });
};

// Get events by priority
export const getEventsByPriority = (priority: "high" | "medium" | "low") =>
  unifiedEventsData.filter((event) => event.priority === priority);

// Get new events
export const getNewEvents = () =>
  unifiedEventsData.filter((event) => event.isNew);

// Get events by category
export const getEventsByCategory = (category: string) =>
  unifiedEventsData.filter((event) => event.category === category);

// Get event by ID for detail pages
export const getEventById = (id: number): UnifiedEvent | undefined => {
  return unifiedEventsData.find((event) => event.id === id);
};

// Get related articles for an event (excludes the current event)
export const getRelatedArticles = (
  currentEventId: number,
  limit: number = 3
): UnifiedEvent[] => {
  return unifiedEventsData
    .filter(
      (event) => event.showInRelatedArticles && event.id !== currentEventId
    )
    .sort((a, b) => {
      // Sort by priority first (high > medium > low), then by date (newest first)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
};
