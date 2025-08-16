export const SITE_CONFIG = {
  name: "Schoenstatt Language Academy",
  shortName: "SCHOENSTATT",
  description: "Premier German language education in Kerala",
  url: "https://sla.schoenstatt-fathers.in",
  ogImage: "/images/og-image.jpg",
  links: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
};

export const NAVIGATION_ITEMS = [
  { name: "Home", href: "#home" },
  // { name: "Courses", href: "#courses" },
  { name: "About Us", href: "/about" },
  { name: "Centers", href: "#centers" },
  { name: "Graduates", href: "/graduates" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact Us", href: "#contact" },
  // { name: "Register Now", href: "/register" },
  // { name: "B2 Telc Exam", href: "/b2-exam" }, // Hidden as requested
];

export const CENTERS = [
  {
    id: "thrissur",
    name: "SLA-Thrissur Center",
    address: "Schoenstatt Fathers, Thrissur, Kerala 680001",
    phone: "+91 487 2421234",
    email: "thrissur@sla.schoenstatt-fathers.in",
    timings: "Mon - Sat: 9:00 AM - 6:00 PM",
    students: "200+",
    established: "2018",
    gradient: "from-blue-400 to-blue-600",
    features: ["Main Campus", "Library", "Hostel Facility", "Career Guidance"],
  },
  {
    id: "chalakudy",
    name: "SLA-Chalakudy Center",
    address: "Schoenstatt Campus, Chalakudy, Kerala 680307",
    phone: "+91 480 2701234",
    email: "chalakudy@sla.schoenstatt-fathers.in",
    timings: "Mon - Sat: 9:00 AM - 6:00 PM",
    students: "150+",
    established: "2019",
    gradient: "from-green-400 to-green-600",
    features: [
      "Smart Classrooms",
      "Language Lab",
      "Cultural Center",
      "Exam Center",
    ],
  },
  {
    id: "peravoor",
    name: "SLA-Peravoor Center",
    address: "Schoenstatt Institute, Peravoor, Kerala 670673",
    phone: "+91 497 2851234",
    email: "peravoor@sla.schoenstatt-fathers.in",
    timings: "Mon - Sat: 9:00 AM - 6:00 PM",
    students: "100+",
    established: "2020",
    gradient: "from-purple-400 to-purple-600",
    features: [
      "Modern Facilities",
      "Online Classes",
      "Weekend Batches",
      "Flexible Timings",
    ],
  },
];

export const CONTACT_INFO = [
  {
    type: "phone",
    title: "Call Us",
    details: ["+91 487 2421234", "+91 480 2701234"],
    gradient: "from-green-400 to-green-600",
  },
  {
    type: "email",
    title: "Email Us",
    details: [
      "info@sla.schoenstatt-fathers.in",
      "admissions@sla.schoenstatt-fathers.in",
    ],
    gradient: "from-blue-400 to-blue-600",
  },
  {
    type: "location",
    title: "Visit Us",
    details: ["Thrissur • Chalakudy • Peravoor", "Kerala, India"],
    gradient: "from-purple-400 to-purple-600",
  },
  {
    type: "hours",
    title: "Office Hours",
    details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"],
    gradient: "from-yellow-400 to-yellow-600",
  },
];
