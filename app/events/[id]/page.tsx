import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { EventDetailContent } from "@/components/event-detail-content"
import { notFound } from "next/navigation"

// This would typically come from a database or CMS
const getEventById = (id: string) => {
  const events = [
    {
      id: "1",
      title: "New SLA Building at Kuttur, Thrissur",
      description:
        "We are excited to announce the opening of our new state-of-the-art facility at Kuttur, Thrissur with modern classrooms and advanced learning equipment.",
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
      date: "January 15, 2025",
      category: "Infrastructure",
      type: "New Building",
      location: "Kuttur, Thrissur",
      author: "SLA Administration",
      readTime: "3 min read",
      tags: ["Infrastructure", "Expansion", "Thrissur", "Modern Facilities"],
      gradient: "from-blue-400 to-blue-600",
      priority: "high",
      isNew: true,
      hasGallery: true,
      gallery: [
        {
          id: 1,
          src: "/placeholder.svg?height=600&width=800",
          alt: "New SLA Building Exterior",
          title: "Modern Building Exterior",
          description: "The impressive facade of our new Kuttur facility",
        },
        {
          id: 2,
          src: "/placeholder.svg?height=600&width=800",
          alt: "Smart Classroom Interior",
          title: "Smart Classroom Setup",
          description: "Interactive learning environment with modern technology",
        },
        {
          id: 3,
          src: "/placeholder.svg?height=600&width=800",
          alt: "Language Laboratory",
          title: "Advanced Language Lab",
          description: "Individual workstations for personalized learning",
        },
        {
          id: 4,
          src: "/placeholder.svg?height=600&width=800",
          alt: "Student Lounge",
          title: "Comfortable Student Areas",
          description: "Relaxing spaces for students to study and socialize",
        },
        {
          id: 5,
          src: "/placeholder.svg?height=600&width=800",
          alt: "Library Section",
          title: "German Literature Library",
          description: "Extensive collection of German books and resources",
        },
      ],
    },
    {
      id: "2",
      title: "B2 Level Graduates - December 2024",
      description:
        "Celebrating the outstanding achievements of our B2 level graduates including Zahra Thasneem and Liya Sanju who successfully completed their Telc certification.",
      fullContent: `
        <p>We are incredibly proud to celebrate the remarkable achievements of our B2 level graduates from December 2024. This batch has demonstrated exceptional dedication and linguistic prowess in mastering the German language.</p>
        
        <h3>Outstanding Performers</h3>
        <p>Special congratulations to our star performers:</p>
        <ul>
          <li><strong>Zahra Thasneem</strong> - Achieved excellent scores across all four skills (Reading, Writing, Listening, Speaking)</li>
          <li><strong>Liya Sanju</strong> - Demonstrated exceptional oral communication skills and cultural understanding</li>
          <li>And many other dedicated students who have successfully completed their B2 certification</li>
        </ul>
        
        <h3>Telc Certification Excellence</h3>
        <p>Our partnership with Sprachforum Augsburg continues to provide our students with internationally recognized certifications. The B2 level represents upper-intermediate proficiency, enabling our graduates to:</p>
        <ul>
          <li>Pursue higher education in German universities</li>
          <li>Secure employment opportunities in Germany</li>
          <li>Communicate effectively in professional German environments</li>
          <li>Understand complex texts and express ideas fluently</li>
        </ul>
        
        <h3>Success Stories</h3>
        <p>Many of our B2 graduates have already secured admissions to prestigious German universities and job opportunities with leading German companies. Their success is a testament to the quality of education and support provided at SLA.</p>
      `,
      date: "December 20, 2024",
      category: "Graduation",
      type: "Certificate Ceremony",
      location: "All Centers",
      author: "Academic Department",
      readTime: "4 min read",
      tags: ["Graduation", "B2 Level", "Telc Certification", "Success"],
      gradient: "from-yellow-400 to-yellow-600",
      priority: "high",
      isNew: true,
      hasGallery: true,
      gallery: [
        {
          id: 1,
          src: "/images/graduates-cert1.jpg",
          alt: "B2 Graduation Certificates",
          title: "Certificate Presentation",
          description: "Zahra Thasneem and Liya Sanju receiving their B2 certificates",
        },
        {
          id: 2,
          src: "/placeholder.svg?height=600&width=800",
          alt: "Graduation Ceremony",
          title: "Graduation Ceremony",
          description: "Faculty and students celebrating the achievement",
        },
        {
          id: 3,
          src: "/placeholder.svg?height=600&width=800",
          alt: "Group Photo",
          title: "Proud Graduates",
          description: "B2 level graduates with their certificates and faculty",
        },
      ],
    },
    {
      id: "3",
      title: "Digital Learning Initiative Launch",
      description:
        "SLA introduces cutting-edge digital learning platforms and AI-powered language tools to enhance the German learning experience.",
      fullContent: `
        <p>Schoenstatt Language Academy is proud to announce the launch of our comprehensive Digital Learning Initiative, marking a new era in German language education. This innovative program integrates the latest educational technology with our proven teaching methodologies.</p>
        
        <h3>Revolutionary Learning Platform</h3>
        <p>Our new digital ecosystem includes:</p>
        <ul>
          <li>AI-powered personalized learning paths</li>
          <li>Interactive virtual reality language immersion</li>
          <li>Real-time pronunciation analysis and feedback</li>
          <li>Gamified learning modules for enhanced engagement</li>
          <li>Mobile app for learning on-the-go</li>
        </ul>
        
        <h3>Enhanced Student Experience</h3>
        <p>The digital platform complements our traditional classroom instruction by providing:</p>
        <ul>
          <li>24/7 access to learning materials and exercises</li>
          <li>Progress tracking and performance analytics</li>
          <li>Virtual conversation practice with AI tutors</li>
          <li>Collaborative online study groups</li>
          <li>Instant feedback on assignments and assessments</li>
        </ul>
        
        <h3>Future of Language Learning</h3>
        <p>This initiative positions SLA at the forefront of educational innovation, ensuring our students receive the most effective and engaging German language education available. The combination of human expertise and artificial intelligence creates an unparalleled learning experience.</p>
        
        <h3>Implementation Timeline</h3>
        <p>The digital platform will be rolled out across all our centers over the next three months, with comprehensive training provided to both faculty and students to ensure smooth adoption of these new tools.</p>
      `,
      date: "January 8, 2025",
      category: "Technology",
      type: "Innovation",
      location: "All Centers",
      author: "Technology Team",
      readTime: "5 min read",
      tags: ["Digital Learning", "AI", "Innovation", "Technology"],
      gradient: "from-purple-400 to-pink-500",
      priority: "high",
      isNew: true,
      hasGallery: false,
    },
    {
      id: "4",
      title: "SLA Cares - Community Outreach Program",
      description:
        "Our faculty and students participated in various community service activities, strengthening bonds with the local community.",
      fullContent: `
        <p>The SLA Cares initiative represents our commitment to giving back to the community that has supported our growth and success. This comprehensive outreach program involves both faculty and students in meaningful community service activities.</p>
        
        <h3>Community Service Activities</h3>
        <p>Our recent community outreach included:</p>
        <ul>
          <li>Free German language workshops for underprivileged students</li>
          <li>Educational support for local schools</li>
          <li>Environmental awareness campaigns</li>
          <li>Support for elderly care centers</li>
          <li>Collaboration with local NGOs for social causes</li>
        </ul>
        
        <h3>Student Involvement</h3>
        <p>Our students actively participated in various activities, demonstrating the values of compassion and social responsibility that are integral to the Schoenstatt philosophy. These experiences also provide practical opportunities to use their German language skills in real-world contexts.</p>
        
        <h3>Impact and Results</h3>
        <p>The program has positively impacted over 500 community members and has strengthened the bond between SLA and the local community. Students have reported increased confidence and a deeper understanding of social responsibility.</p>
        
        <h3>Future Plans</h3>
        <p>We plan to expand the SLA Cares program to include more regular community service opportunities and partnerships with additional local organizations.</p>
      `,
      date: "December 10, 2024",
      category: "Community",
      type: "Social Service",
      location: "All Centers",
      author: "Community Relations",
      readTime: "3 min read",
      tags: ["Community Service", "Social Responsibility", "Outreach"],
      gradient: "from-purple-400 to-purple-600",
      priority: "medium",
      isNew: false,
      hasGallery: true,
      gallery: [
        {
          id: 1,
          src: "/placeholder.svg?height=600&width=800",
          alt: "Community Workshop",
          title: "Free German Workshop",
          description: "Students teaching German to local community members",
        },
        {
          id: 2,
          src: "/placeholder.svg?height=600&width=800",
          alt: "Environmental Campaign",
          title: "Environmental Awareness",
          description: "SLA team participating in environmental conservation",
        },
        {
          id: 3,
          src: "/placeholder.svg?height=600&width=800",
          alt: "Elderly Care Visit",
          title: "Elderly Care Support",
          description: "Students and faculty visiting elderly care centers",
        },
      ],
    },
  ]

  return events.find((event) => event.id === id)
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10">
        <Header />
        <main className="pt-20">
          <EventDetailContent event={event} />
        </main>
        <Footer />
      </div>
    </div>
  )
}
