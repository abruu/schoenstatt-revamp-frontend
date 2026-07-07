// Icons are now stored as strings and mapped to components in client components
// This avoids serialization issues with React components
import { useApiStore } from "./stores/api-store";
import { getStrapiBaseUrl } from "./constants";

// Helper to prefix relative Strapi URLs
const withStrapiUrl = (url?: string): string => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${getStrapiBaseUrl()}${url}`;
};

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title?: string | any;
  description?: string | any;
}

export interface UnifiedEvent {
  id: number;
  documentId?: string; // Strapi document ID for API calls
  title: string;
  description: string;
  excerpt?: string; // Short version for news cards
  date: string;
  createdAt?: string; // Creation date for sorting
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
  fullContent?: string | any; // HTML content for detail pages (can be Strapi blocks)
  tags?: string[]; // Tags for categorization

  // Related articles
  related_articles?: UnifiedEvent[]; // Related articles from API

  // Component visibility flags
  showInEventsPage: boolean;
  showInNewsSection: boolean;
  showInNoticeBoard: boolean;
  showInRelatedArticles: boolean;
}

// Static fallback data in case API fails
export const staticEventsData: UnifiedEvent[] = [
  //   {
  //     id: 1,
  //     title: "New SLA Building at Kuttur, Thrissur",
  //     description:
  //       "Grand opening of our new state-of-the-art facility at Kuttur, Thrissur with modern classrooms, advanced language labs, and comfortable student facilities.",
  //     excerpt:
  //       "We are excited to announce the opening of our new state-of-the-art facility at Kuttur, Thrissur with modern classrooms and advanced learning equipment.",
  //     date: "January 15, 2025",
  //     // endDate: "March 15, 2025",
  //     category: "Updates",
  //     type: "New Building",
  //     location: "Kuttur, Thrissur",
  //     image: "/images/events/sla_newbulding.webp",
  //     icon: "Building",
  //     gradient: "from-blue-400 to-blue-600",
  //     priority: "high",
  //     isNew: false,
  //     gallery: [
  //       "/images/events/sla_newbulding.webp",
  //       "/images/events/buliding-support.webp",
  //     ],
  //     galleryItems: [
  //       {
  //         id: 1,
  //         src: "/images/events/sla_newbulding.webp",
  //         alt: "New SLA Building Exterior",
  //         title: "Modern Building Exterior",
  //         description: "The impressive facade of our new Kuttur facility",
  //       },
  //       {
  //         id: 2,
  //         src: "/images/events/buliding-support.webp",
  //         alt: "Smart Classroom Interior",
  //         title: "Smart Classroom Setup",
  //         description: "Interactive learning environment with modern technology",
  //       },
  //     ],
  //     hasGallery: true,
  //     galleryCount: 5,
  //     author: "SLA Administration",
  //     readTime: "3 min read",
  //     fullContent: `
  //       <p>We are thrilled to announce the grand opening of our brand new, state-of-the-art facility at Kuttur, Thrissur. This milestone represents a significant step forward in our mission to provide world-class German language education in Kerala.</p>
  //       <h3>Modern Infrastructure</h3>
  //       <p>The new building features cutting-edge amenities designed specifically for language learning:</p>
  //       <ul>
  //         <li>Smart classrooms equipped with interactive whiteboards and audio-visual systems</li>
  //         <li>Advanced language laboratory with individual workstations</li>
  //         <li>Comfortable student lounge and study areas</li>
  //         <li>Modern library with extensive German literature collection</li>
  //         <li>High-speed internet connectivity throughout the building</li>
  //       </ul>
  //       <h3>Enhanced Learning Experience</h3>
  //       <p>Our new facility is designed to create an immersive German learning environment. The classrooms are acoustically optimized for language instruction, and the technology integration allows for interactive lessons that engage students in new and exciting ways.</p>
  //       <h3>Community Impact</h3>
  //       <p>This expansion allows us to accommodate more students and offer additional programs, furthering our commitment to making quality German language education accessible to everyone in Kerala.</p>
  //     `,
  //     tags: ["Infrastructure", "Expansion", "Thrissur", "Modern Facilities"],
  //     showInEventsPage: true,
  //     showInNewsSection: false,
  //     showInNoticeBoard: false,
  //     showInRelatedArticles: true,
  //   },
  //   {
  //     id: 2,
  //     title: "SLA Updated",
  //     description:
  //       "Stay informed with SLA Updates! Here you’ll find the latest news, announcements, and important information about our programs and events. Keep up-to-date with everything happening at SLA.",
  //     excerpt: "Latest News and Announcements",
  //     date: "December 20, 2024",
  //     // endDate: "January 20, 2025",
  //     category: "Updates",
  //     type: "Updates",
  //     location: "All Centers",
  //     image: "/images/graduates-cert1.jpg",
  //     icon: "Award",
  //     gradient: "from-yellow-400 to-yellow-600",
  //     priority: "high",
  //     isNew: true,
  //     gallery: [
  //       "/images/graduates-cert1.jpg",
  //       "/placeholder.svg?height=400&width=600",
  //       "/placeholder.svg?height=400&width=600",
  //     ],
  //     fullContent:
  //       "Stay informed with SLA Updates! Here you’ll find the latest news, announcements, and important information about our programs and events. Keep up-to-date with everything happening at SLA.",
  //     galleryItems: [
  //       {
  //         id: 3,
  //         src: "/images/SLA updated/welcome-SLA.webp",
  //         alt: "Welcome to SLA",
  //         title: "Welcome to SLA",
  //         description: "Official welcome message from SLA",
  //       },
  //       {
  //         id: 4,
  //         src: "/images/SLA updated/Fr-Babu-1-insta-1.webp",
  //         alt: "Fr. Babu Instagram Post",
  //         title: "Fr. Babu Update",
  //         description: "Latest update from Fr. Babu",
  //       },
  //       {
  //         id: 5,
  //         src: "/images/SLA updated/Insta-post-for-Fr.-Babu-2-2.webp",
  //         alt: "Fr. Babu Instagram Post 2",
  //         title: "Fr. Babu Update 2",
  //         description: "Additional update from Fr. Babu",
  //       },
  //       {
  //         id: 6,
  //         src: "/images/SLA updated/Insta-post-for-Fr.-Babu-3-1.webp",
  //         alt: "Fr. Babu Instagram Post 3",
  //         title: "Fr. Babu Update 3",
  //         description: "Latest announcement from Fr. Babu",
  //       },
  //       {
  //         id: 7,
  //         src: "/images/SLA updated/ONLINE-CLASS-scaled.webp",
  //         alt: "Online Class Session",
  //         title: "Online Classes",
  //         description: "SLA online learning platform in action",
  //       },
  //       {
  //         id: 8,
  //         src: "/images/SLA updated/Telc-exam-result.webp",
  //         alt: "Telc Exam Results",
  //         title: "Telc Exam Results",
  //         description: "Latest Telc examination results announcement",
  //       },
  //       {
  //         id: 9,
  //         src: "/images/SLA updated/b2-exam-preparation.webp",
  //         alt: "B2 Exam Preparation",
  //         title: "B2 Level Preparation",
  //         description: "B2 level German exam preparation materials",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA updated/6.webp",
  //         alt: "SLA Update Image",
  //         title: "SLA News Update",
  //         description: "Latest news and updates from SLA",
  //       },
  //     ],
  //     hasGallery: true,
  //     galleryCount: 10,
  //     author: "Academic Department",
  //     readTime: "4 min read",
  //     showInEventsPage: true,
  //     showInNewsSection: true,
  //     showInNoticeBoard: true,
  //     showInRelatedArticles: true,
  //   },
  //   {
  //     id: 3,
  //     title: "SLA Connect",
  //     description:
  //       "Explore our photo gallery capturing the joyful moments of our students in Germany. See how they are thriving and enjoying their time abroad, making memories that last a lifetime.",
  //     excerpt: "Latest News and Announcements",
  //     date: "July 20, 2025",
  //     // endDate: "September 20, 2025",
  //     category: "Connect",
  //     type: "Connect",
  //     location: "All Centers",
  //     image: "/images/graduates-cert1.jpg",
  //     icon: "Award",
  //     gradient: "from-yellow-400 to-yellow-600",
  //     priority: "high",
  //     isNew: true,
  //     gallery: [
  //       "/images/graduates-cert1.jpg",
  //       "/placeholder.svg?height=400&width=600",
  //       "/placeholder.svg?height=400&width=600",
  //     ],
  //     fullContent:
  //       "Explore our photo gallery capturing the joyful moments of our students in Germany. See how they are thriving and enjoying their time abroad, making memories that last a lifetime.",
  //     galleryItems: [
  //       {
  //         id: 1,
  //         src: "/images/SLA connects/SLA connects 1.jpg",
  //         alt: "SLA Students in Germany",
  //         title: "Students in Germany",
  //         description: "Our successful students enjoying their time in Germany",
  //       },
  //       {
  //         id: 2,
  //         src: "/images/SLA connects/SLA connects 2.jpg",
  //         alt: "SLA Connect Group Photo",
  //         title: "Group Celebration",
  //         description: "Students celebrating their achievements together",
  //       },
  //       {
  //         id: 3,
  //         src: "/images/SLA connects/SLA connects 3.jpg",
  //         alt: "SLA Students Achievement",
  //         title: "Achievement Moment",
  //         description: "Proud moment of our students' success",
  //       },
  //       {
  //         id: 4,
  //         src: "/images/SLA connects/SLA connects4.jpg",
  //         alt: "SLA Connect Experience",
  //         title: "Germany Experience",
  //         description: "Students sharing their Germany experience",
  //       },
  //       {
  //         id: 5,
  //         src: "/images/SLA connects/SLA connects5.jpg",
  //         alt: "SLA Students Together",
  //         title: "Students Together",
  //         description: "SLA students bonding in Germany",
  //       },
  //       {
  //         id: 6,
  //         src: "/images/SLA connects/SLA connects6.jpg",
  //         alt: "SLA Connect Journey",
  //         title: "Success Journey",
  //         description: "Journey of success with SLA Connect",
  //       },
  //       {
  //         id: 7,
  //         src: "/images/SLA connects/SLA connects8.jpg",
  //         alt: "SLA Students Life",
  //         title: "Life in Germany",
  //         description: "Students enjoying their new life in Germany",
  //       },
  //       {
  //         id: 8,
  //         src: "/images/SLA connects/SLA connects9.jpg",
  //         alt: "SLA Connect Community",
  //         title: "SLA Community",
  //         description: "Strong community of SLA students abroad",
  //       },
  //       {
  //         id: 9,
  //         src: "/images/SLA connects/SLA connects10.jpg",
  //         alt: "SLA Success Story",
  //         title: "Success Stories",
  //         description: "Inspiring success stories from our students",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA connects/SLA connects11.jpg",
  //         alt: "SLA Connect Network",
  //         title: "Global Network",
  //         description: "Building a global network of SLA alumni",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA connects/sep_8_25/WhatsApp Image 2025-09-08 at 10.39.02 AM.jpeg",
  //         alt: "SLA Connect Network",
  //         title: "Global Network",
  //         description: "Building a global network of SLA alumni",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA connects/sep_8_25/WhatsApp Image 2025-09-08 at 10.39.20 AM.jpeg",
  //         alt: "SLA Connect Network",
  //         title: "Global Network",
  //         description: "Building a global network of SLA alumni",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA connects/sep_8_25/WhatsApp Image 2025-09-08 at 10.39.21 AM (1).jpeg",
  //         alt: "SLA Connect Network",
  //         title: "Global Network",
  //         description: "Building a global network of SLA alumni",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA connects/sep_8_25/WhatsApp Image 2025-09-08 at 10.39.22 AM (1).jpeg",
  //         alt: "SLA Connect Network",
  //         title: "Global Network",
  //         description: "Building a global network of SLA alumni",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA connects/sep_8_25/WhatsApp Image 2025-09-08 at 10.39.21 AM.jpeg",
  //         alt: "SLA Connect Network",
  //         title: "Global Network",
  //         description: "Building a global network of SLA alumni",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA connects/sep_8_25/WhatsApp Image 2025-09-08 at 10.39.22 AM.jpeg",
  //         alt: "SLA Connect Network",
  //         title: "Global Network",
  //         description: "Building a global network of SLA alumni",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA connects/sep_8_25/WhatsApp Image 2025-09-08 at 10.39.23 AM (1).jpeg",
  //         alt: "SLA Connect Network",
  //         title: "Global Network",
  //         description: "Building a global network of SLA alumni",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA connects/sep_8_25/WhatsApp Image 2025-09-08 at 10.39.23 AM.jpeg",
  //         alt: "SLA Connect Network",
  //         title: "Global Network",
  //         description: "Building a global network of SLA alumni",
  //       },
  //     ],
  //     hasGallery: true,
  //     galleryCount: 10,
  //     author: "Academic Department",
  //     readTime: "4 min read",
  //     showInEventsPage: true,
  //     showInNewsSection: true,
  //     showInNoticeBoard: true,
  //     showInRelatedArticles: true,
  //   },
  //   {
  //     id: 4,
  //     title: "SLA Care",
  //     description:
  //       "Explore our photo gallery capturing the joyful moments of our students in Germany. See how they are thriving and enjoying their time abroad, making memories that last a lifetime.",
  //     excerpt: "Latest News and Announcements",
  //     date: "January 10, 2025",
  //     // endDate: "January 31, 2025",
  //     category: "Care",
  //     type: "Care",
  //     location: "All Centers",
  //     image: "/images/graduates-cert1.jpg",
  //     icon: "Award",
  //     gradient: "from-yellow-400 to-yellow-600",
  //     priority: "high",
  //     isNew: true,
  //     gallery: [
  //       "/images/graduates-cert1.jpg",
  //       "/placeholder.svg?height=400&width=600",
  //       "/placeholder.svg?height=400&width=600",
  //     ],
  //     fullContent:
  //       "SLA Cares showcases our commitment to community service and social responsibility. Through various outreach programs and charitable initiatives, we give back to society and make a positive impact in our communities.",
  //     galleryItems: [
  //       {
  //         id: 1,
  //         src: "/images/SLA cares/sla cares 1.png",
  //         alt: "SLA Community Service",
  //         title: "Community Service",
  //         description: "SLA team engaging in community service activities",
  //       },
  //       {
  //         id: 2,
  //         src: "/images/SLA cares/sla cares2.png",
  //         alt: "SLA Cares Initiative",
  //         title: "Caring Initiative",
  //         description:
  //           "Our caring initiatives making a difference in the community",
  //       },
  //       {
  //         id: 3,
  //         src: "/images/SLA cares/sla cares3.png",
  //         alt: "SLA Social Responsibility",
  //         title: "Social Responsibility",
  //         description: "Demonstrating our commitment to social responsibility",
  //       },
  //       {
  //         id: 4,
  //         src: "/images/SLA cares/sla cares 4.png",
  //         alt: "SLA Community Outreach",
  //         title: "Community Outreach",
  //         description: "Reaching out to help those in need",
  //       },
  //       {
  //         id: 5,
  //         src: "/images/SLA cares/sla cares 5.png",
  //         alt: "SLA Charitable Work",
  //         title: "Charitable Activities",
  //         description: "Engaging in meaningful charitable work",
  //       },
  //       {
  //         id: 6,
  //         src: "/images/SLA cares/sla cares 6.png",
  //         alt: "SLA Community Support",
  //         title: "Community Support",
  //         description: "Supporting our local community through various programs",
  //       },
  //       {
  //         id: 7,
  //         src: "/images/SLA cares/sla cares 7.png",
  //         alt: "SLA Volunteer Work",
  //         title: "Volunteer Activities",
  //         description: "Our volunteers making a positive impact",
  //       },
  //       {
  //         id: 8,
  //         src: "/images/SLA cares/sla cares 8.png",
  //         alt: "SLA Community Engagement",
  //         title: "Community Engagement",
  //         description: "Actively engaging with the community",
  //       },
  //       {
  //         id: 9,
  //         src: "/images/SLA cares/sla cares 9.png",
  //         alt: "SLA Social Impact",
  //         title: "Social Impact",
  //         description:
  //           "Creating meaningful social impact through our initiatives",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/SLA cares/sla cares 10.png",
  //         alt: "SLA Care Programs",
  //         title: "Care Programs",
  //         description: "Various care programs helping the community",
  //       },
  //     ],
  //     hasGallery: true,
  //     galleryCount: 10,
  //     author: "Academic Department",
  //     readTime: "4 min read",
  //     showInEventsPage: true,
  //     showInNewsSection: true,
  //     showInNoticeBoard: true,
  //     showInRelatedArticles: true,
  //   },
  //   {
  //     id: 6,
  //     title: "SLA PERAVOOR RENOVATED INSTITUTE",
  //     description:
  //       "Grand opening of our renovated state-of-the-art facility at Peravoor, Kannur with modern classrooms, advanced language labs, and comfortable student facilities.",
  //     excerpt:
  //       "We are excited to announce the opening of our renovated state-of-the-art facility at Peravoor, Kannur with modern classrooms and advanced learning equipment.",
  //     date: "August 15, 2025",
  //     // endDate: "March 15, 2025",
  //     category: "Updates",
  //     type: "New Building",
  //     location: "Peravoor, Kannur",
  //     image: "/images/locations/Image (7).jpeg",
  //     icon: "Building",
  //     gradient: "from-blue-400 to-blue-600",
  //     priority: "high",
  //     isNew: true,
  //     gallery: [
  //       "/images/locations/Image (1).jpeg",
  //       "/images/locations/Image (2).jpeg",
  //       "/images/locations/Image (3).jpeg",
  //       "/images/locations/Image (4).jpeg",
  //       "/images/locations/Image (5).jpeg",
  //       "/images/locations/Image (6).jpeg",
  //       "/images/locations/Image (7).jpeg",
  //       "/images/locations/Image (8).jpeg",
  //       "/images/locations/Image (9).jpeg",
  //       "/images/locations/Image.jpeg",
  //     ],
  //     galleryItems: [
  //       {
  //         id: 1,
  //         src: "/images/locations/Image (1).jpeg",
  //         alt: "New SLA Building Exterior",
  //         title: "Modern Building Exterior",
  //         description: "The impressive facade of our renovated Peravoor facility",
  //       },
  //       {
  //         id: 3,
  //         src: "/images/locations/Image (3).jpeg",
  //         alt: "Language Laboratory",
  //         title: "Advanced Language Lab",
  //         description: "State-of-the-art language learning laboratory",
  //       },
  //       {
  //         id: 4,
  //         src: "/images/locations/Image (4).jpeg",
  //         alt: "Student Facilities",
  //         title: "Student Common Area",
  //         description: "Comfortable spaces for students to study and relax",
  //       },
  //       {
  //         id: 5,
  //         src: "/images/locations/Image (5).jpeg",
  //         alt: "Modern Infrastructure",
  //         title: "Modern Infrastructure",
  //         description: "Updated infrastructure supporting quality education",
  //       },
  //       {
  //         id: 6,
  //         src: "/images/locations/Image (6).jpeg",
  //         alt: "Learning Environment",
  //         title: "Enhanced Learning Environment",
  //         description: "Optimized spaces for effective language learning",
  //       },
  //       {
  //         id: 7,
  //         src: "/images/locations/Image (7).jpeg",
  //         alt: "Renovated Facility",
  //         title: "Renovated Facility",
  //         description: "Complete renovation of the Peravoor institute",
  //       },
  //       {
  //         id: 8,
  //         src: "/images/locations/Image (8).jpeg",
  //         alt: "Educational Spaces",
  //         title: "Educational Spaces",
  //         description: "Well-designed educational spaces for better learning",
  //       },
  //       {
  //         id: 10,
  //         src: "/images/locations/Image.jpeg",
  //         alt: "SLA Peravoor Institute",
  //         title: "SLA Peravoor Institute",
  //         description: "The complete renovated SLA Peravoor institute",
  //       },
  //     ],
  //     hasGallery: true,
  //     galleryCount: 10,
  //     author: "SLA Administration",
  //     readTime: "3 min read",
  //     fullContent: `
  //       <p>We are thrilled to announce the grand opening of our renovated, state-of-the-art facility at Peravoor, Kannur. This milestone represents a significant step forward in our mission to provide world-class German language education in Kerala.</p>
  //       <h3>Modern Infrastructure</h3>
  //       <p>The renovated building features cutting-edge amenities designed specifically for language learning:</p>
  //       <ul>
  //         <li>Smart classrooms equipped with interactive whiteboards and audio-visual systems</li>
  //         <li>Advanced language laboratory with individual workstations</li>
  //         <li>Comfortable student lounge and study areas</li>
  //         <li>Modern library with extensive German literature collection</li>
  //         <li>High-speed internet connectivity throughout the building</li>
  //       </ul>
  //       <h3>Enhanced Learning Experience</h3>
  //       <p>Our renovated facility is designed to create an immersive German learning environment. The classrooms are acoustically optimized for language instruction, and the technology integration allows for interactive lessons that engage students in new and exciting ways.</p>
  //       <h3>Community Impact</h3>
  //       <p>This renovation allows us to accommodate more students and offer additional programs, furthering our commitment to making quality German language education accessible to everyone in Kerala.</p>
  //     `,
  //     tags: [
  //       "Infrastructure",
  //       "Expansion",
  //       "Kannur",
  //       "Modern Facilities",
  //       "Renovation",
  //     ],
  //     showInEventsPage: true,
  //     showInNewsSection: false,
  //     showInNoticeBoard: false,
  //     showInRelatedArticles: true,
  //   },
  //   {
  //     "id": 9,
  //     "title": "SLA Aloor Celebration",
  //     "description": "We are delighted to announce the grand Aloor Celebration at SLA. This festive occasion brings together our students, faculty, and community to enjoy cultural programs, traditional performances, and shared happiness.",
  //     "excerpt": "The Aloor Celebration at SLA was filled with vibrant cultural programs, traditional performances, and joyful participation from the entire SLA family.",
  //     "date": "August 28, 2025",
  //     "category": "Events",
  //     "type": "Celebration",
  //     "location": "SLA Campus, Aloor",
  //     "image": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.29 PM.jpeg",
  //     "icon": "PartyPopper",
  //     "gradient": "from-yellow-400 to-orange-600",
  //     "priority": "high",
  //     "isNew": true,
  //     "gallery": [
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.18 PM (1).jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.18 PM.jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.19 PM.jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.20 PM.jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.21 PM.jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.22 PM.jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.25 PM (1).jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.25 PM.jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.26 PM (1).jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.26 PM.jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.27 PM.jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.28 PM.jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.29 PM.jpeg",
  //       "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.30 PM.jpeg"
  //     ],
  //     "galleryItems": [
  //       {
  //         "id": 1,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.18 PM (1).jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "SLA Aloor Celebration 2025",
  //         "description": "Students and faculty enjoying the festive programs at SLA Aloor."
  //       },
  //       {
  //         "id": 2,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.18 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Cultural Performance",
  //         "description": "Vibrant cultural dances and performances during the celebration."
  //       },
  //       {
  //         "id": 3,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.19 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Traditional Arts Showcase",
  //         "description": "Students showcasing traditional Kerala art and culture."
  //       },
  //       {
  //         "id": 4,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.20 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Community Participation",
  //         "description": "Joyful participation from students, staff, and the community."
  //       },
  //       {
  //         "id": 5,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.21 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Festive Moments",
  //         "description": "Capturing the festive spirit and joy of Aloor Celebration."
  //       },
  //       {
  //         "id": 6,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.22 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Group Activities",
  //         "description": "Students participating in group activities and games."
  //       },
  //       {
  //         "id": 7,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.25 PM (1).jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Cultural Display",
  //         "description": "Beautiful cultural displays and decorations at the event."
  //       },
  //       {
  //         "id": 8,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.25 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Performance Highlights",
  //         "description": "Memorable performance moments from the celebration."
  //       },
  //       {
  //         "id": 9,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.26 PM (1).jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Student Engagement",
  //         "description": "Active student engagement in cultural activities."
  //       },
  //       {
  //         "id": 10,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.26 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Traditional Costumes",
  //         "description": "Students in beautiful traditional costumes and attire."
  //       },
  //       {
  //         "id": 11,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.27 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Dance Performance",
  //         "description": "Energetic dance performances by SLA students."
  //       },
  //       {
  //         "id": 12,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.28 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Cultural Unity",
  //         "description": "Celebrating cultural unity and diversity at SLA."
  //       },
  //       {
  //         "id": 13,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.29 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Celebration Highlights",
  //         "description": "Key highlights and memorable moments from the event."
  //       },
  //       {
  //         "id": 14,
  //         "src": "/images/events/aloor_8_25/WhatsApp Image 2025-08-29 at 2.24.30 PM.jpeg",
  //         "alt": "Aloor Celebration",
  //         "title": "Grand Finale",
  //         "description": "Grand finale capturing the festive spirit of Aloor Celebration."
  //       }
  //     ],
  //     "hasGallery": true,
  //     "galleryCount": 14,
  //     "author": "SLA Administration",
  //     "readTime": "2 min read",
  //     "fullContent":  `
  //         <p>The SLA Aloor Celebration was a memorable event filled with joy, unity, and cultural richness. This celebration brought together students, faculty, and the wider community to showcase traditions and talent.</p>
  //         <h3>Highlights of the Celebration</h3>
  //         <p>The event featured a variety of performances and activities, creating a lively and festive atmosphere across the campus.</p>
  //         <h3>What Participants Enjoyed</h3>
  //         <ul>
  //           <li>Traditional Kerala dance and music performances</li>
  //           <li>Festive decorations and cultural displays</li>
  //           <li>Interactive games and fun activities</li>
  //           <li>Community bonding and joyful experiences</li>
  //         </ul>
  //         <h3>Looking Ahead</h3>
  //         <p>This celebration reflects SLA’s commitment to fostering cultural values and community spirit alongside academic excellence. We look forward to hosting many more such events in the future.</p>
  //      `,
  //     "tags": ["Celebration", "Aloor", "Cultural Event", "Students", "Community"],
  //     "showInEventsPage": true,
  //     "showInNewsSection": true,
  //     "showInNoticeBoard": true,
  //     "showInRelatedArticles": true
  //   }
  // ,
  //   {
  //     id: 8,
  //     title: "SLA New S1 Batch Commencement",
  //     description:
  //       "We are excited to announce the commencement of our new S1 batch at SLA. This batch brings together enthusiastic learners ready to begin their journey into mastering the German language with the support of our expert faculty and modern facilities.",
  //     excerpt:
  //       "The new S1 batch has officially started at SLA, marking the beginning of a fresh learning journey in German language education.",
  //     date: "August 28, 2025",
  //     category: "Events",
  //     type: "Batch Opening",
  //     location: "SLA Campus",
  //     image: "/images/events/news1(28_25)/Image (1).jpeg",
  //     icon: "Users",
  //     gradient: "from-green-400 to-green-600",
  //     priority: "medium",
  //     isNew: true,
  //     gallery: [
  //       "/images/events/news1(28_25)/Image (1).jpeg",
  //       "/images/events/news1(28_25)/Image (2).jpeg",
  //       "/images/events/news1(28_25)/Image (3).jpeg",
  //       "/images/events/news1(28_25)/Image (4).jpeg",
  //       "/images/events/news1(28_25)/Image.jpeg",
  //     ],
  //     galleryItems: [
  //       {
  //         id: 1,
  //         src: "/images/events/news1(28_25)/Image (1).jpeg",
  //         alt: "New S1 Batch",
  //         title: "New S1 Batch Kickoff",
  //         description:
  //           "Students of the new S1 batch beginning their German language journey",
  //       },
  //       {
  //         id: 2,
  //         src: "/images/events/news1(28_25)/Image (2).jpeg",
  //         alt: "New S1 Batch",
  //         title: "New S1 Batch Kickoff",
  //         description:
  //           "Students of the new S1 batch beginning their German language journey",
  //       },
  //       {
  //         id: 3,
  //         src: "/images/events/news1(28_25)/Image (3).jpeg",
  //         alt: "New S1 Batch",
  //         title: "New S1 Batch Kickoff",
  //         description:
  //           "Students of the new S1 batch beginning their German language journey",
  //       },
  //       {
  //         id: 4,
  //         src: "/images/events/news1(28_25)/Image (4).jpeg",
  //         alt: "New S1 Batch",
  //         title: "New S1 Batch Kickoff",
  //         description:
  //           "Students of the new S1 batch beginning their German language journey",
  //       },
  //       {
  //         id: 5,
  //         src: "/images/events/news1(28_25)/Image.jpeg",
  //         alt: "New S1 Batch",
  //         title: "New S1 Batch Kickoff",
  //         description:
  //           "Students of the new S1 batch beginning their German language journey",
  //       },
  //     ],
  //     hasGallery: true,
  //     galleryCount: 1,
  //     author: "SLA Administration",
  //     readTime: "2 min read",
  //     fullContent: `
  //       <p>We are proud to welcome our new S1 batch to SLA. This marks an important milestone for our institute as we continue to expand opportunities for students eager to learn German language and culture.</p>
  //       <h3>About the S1 Batch</h3>
  //       <p>The S1 batch is designed for beginners who are just starting their German learning journey. Our structured curriculum, modern classrooms, and experienced faculty will provide students with the skills and confidence they need to succeed.</p>
  //       <h3>What Students Can Expect</h3>
  //       <ul>
  //         <li>Interactive and engaging language sessions</li>
  //         <li>Access to our advanced language lab</li>
  //         <li>Regular assessments and progress tracking</li>
  //         <li>Supportive community of peers and mentors</li>
  //       </ul>
  //       <h3>Looking Ahead</h3>
  //       <p>This batch reflects our ongoing mission to provide high-quality German language education to more students across Kerala. We look forward to seeing our S1 learners grow and achieve their goals.</p>
  //     `,
  //     tags: ["New Batch", "S1", "Education", "German Language", "Students"],
  //     showInEventsPage: true,
  //     showInNewsSection: true,
  //     showInNoticeBoard: true,
  //     showInRelatedArticles: true,
  //   },
];

// Function to convert API events to UnifiedEvent format
export const mapApiEventsToUnifiedFormat = (
  apiEvents: any[],
): UnifiedEvent[] => {
  if (!apiEvents || apiEvents.length === 0) return [];

  return apiEvents.map((event) => {
    // Direct access to event properties without attributes nesting
    const { id, documentId } = event;

    // Extract image URL from the nested structure
    const coverImageUrl = withStrapiUrl(event.coverImage?.url);
    const coverImageFormats = event.coverImage?.formats || {};

    // Extract gallery items if available
    const galleryItems =
      event.GalleryItems?.map((item: any) => ({
        id: item.id,
        src: withStrapiUrl(item.src?.url),
        alt: item.alt || "",
        title: item.title || "",
        description: item.description || "",
      })) || [];

    // Extract tags if available
    const tags = event.tags?.map((tag: any) => tag.name) || [];

    // Map API event to UnifiedEvent format
    return {
      id,
      documentId,
      title: event.title || "",
      description: event.description || "",
      excerpt:
        event.excerpt || event.description?.substring(0, 100) + "..." || "",
      date: event.date || event.createdAt || "",
      createdAt: event.createdAt || "",
      endDate: event.endDate || "",
      category: event.category?.name || "Updates",
      type: event.eventType || "News",
      location: event.location || "All Centers",
      image: coverImageUrl,
      coverImage: {
        url: coverImageUrl,
        formats: coverImageFormats,
      },
      icon: event.icon || "Zap",
      gradient: event.gradient || { className: "from-blue-400 to-blue-600" },
      priority: event.priority || "medium",
      isNew: (() => {
        // Derive isNew from endDate - if endDate is in the future, it's considered new
        if (event.endDate) {
          const endDate = new Date(event.endDate);
          const currentDate = new Date();
          return endDate >= currentDate;
        }
        // If no endDate, fall back to API value or false
        return event.isNew || false;
      })(),
      gallery: galleryItems.map((item: any) => item.src),
      galleryItems: galleryItems,
      GalleryItems: galleryItems,
      hasGallery: event.hasGallery || galleryItems.length > 0,
      galleryCount: galleryItems.length,
      author: event.author || "SLA Team",
      readTime: event.readTime || "3 min read",
      fullContent: event.fullContent,
      tags: tags,
      branch: event.branch || { header: "All Centers" },
      showInEventsPage: event.showInEventsPage !== false,
      showInNewsSection: event.showInNewsSection !== false,
      showInNoticeBoard: event.showInNoticeBoard !== false,
      showInRelatedArticles: event.showInRelatedArticles !== false,
      related_articles: event.related_articles || [],
    };
  });
};

// Get the current events data - either from API or fallback to static data
export const getUnifiedEventsData = (): UnifiedEvent[] => {
  const { events } = useApiStore.getState();

  // If API has data, use it; otherwise use static data
  const eventsData =
    events.length > 0 ? mapApiEventsToUnifiedFormat(events) : staticEventsData;

  // Sort events by createdAt date in descending order (newest first)
  return eventsData.sort((a, b) => {
    const dateA = a.createdAt
      ? new Date(a.createdAt).getTime()
      : new Date(a.date).getTime();
    const dateB = b.createdAt
      ? new Date(b.createdAt).getTime()
      : new Date(b.date).getTime();
    return dateB - dateA; // Descending order (newest first)
  });
};

// Helper function to check if an event is still valid based on endDate
const isEventValid = (event: UnifiedEvent): boolean => {
  if (!event.endDate) return true; // No endDate means always valid

  const endDate = new Date(event.endDate);
  const currentDate = new Date();
  return endDate >= currentDate;
};

// Helper functions to filter events for specific components
export const getEventsForEventsPage = () => {
  const eventsData = getUnifiedEventsData();
  return eventsData.filter((event) => event.showInEventsPage);
};

export const getEventsForNewsSection = () => {
  const eventsData = getUnifiedEventsData();

  return eventsData.filter((event) => {
    // Check if the event should show in news section and is still valid
    return event.showInNewsSection && isEventValid(event);
  });
};

export const getEventsForNoticeBoard = () => {
  const eventsData = getUnifiedEventsData();

  return eventsData.filter((event) => {
    // Check if the event should show in notice board and is still valid
    return event.showInNoticeBoard && isEventValid(event);
  });
};

// Get events by priority
export const getEventsByPriority = (priority: "high" | "medium" | "low") => {
  const eventsData = getUnifiedEventsData();
  return eventsData.filter((event) => event.priority === priority);
};

// Get new events (now derived from endDate)
export const getNewEvents = () => {
  const eventsData = getUnifiedEventsData();
  return eventsData.filter((event) => event.isNew);
};

// Test function to demonstrate date filtering logic
export const testDateFiltering = () => {
  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + 10); // 10 days from now

  const pastDate = new Date();
  pastDate.setDate(currentDate.getDate() - 5); // 5 days ago

  console.log("Date Filtering Test:");
  console.log("Current Date:", currentDate.toISOString().split("T")[0]);
  console.log("Future Date (valid):", futureDate.toISOString().split("T")[0]);
  console.log("Past Date (expired):", pastDate.toISOString().split("T")[0]);

  // Test events
  const testEvents = [
    { endDate: futureDate.toISOString().split("T")[0], title: "Future Event" },
    { endDate: pastDate.toISOString().split("T")[0], title: "Past Event" },
    { endDate: undefined, title: "No End Date Event" },
  ];

  testEvents.forEach((event) => {
    const isValid = isEventValid(event as any);
    console.log(
      `${event.title} (endDate: ${event.endDate || "none"}): ${isValid ? "VALID" : "EXPIRED"}`,
    );
  });
};

// Get events by category
export const getEventsByCategory = (category: string) => {
  const eventsData = getUnifiedEventsData();
  return eventsData.filter((event) => event.category === category);
};

// Get event by ID for detail pages
export const getEventById = (id: number): UnifiedEvent | undefined => {
  const eventsData = getUnifiedEventsData();
  return eventsData.find((event) => event.id === id);
};

// Get related articles for an event (excludes the current event)
export const getRelatedArticles = (
  currentEventId: number,
  limit: number = 3,
): UnifiedEvent[] => {
  const eventsData = getUnifiedEventsData();

  // Find the current event
  const currentEvent = eventsData.find((event) => event.id === currentEventId);

  // If the event has related_articles from API, use those
  if (
    currentEvent?.related_articles &&
    currentEvent.related_articles.length > 0
  ) {
    // Return the related articles, limited to the specified number
    return currentEvent.related_articles.slice(0, limit);
  }

  // Fallback to the old filtering method if no related_articles are available
  return eventsData
    .filter((event) => event.id !== currentEventId)
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
