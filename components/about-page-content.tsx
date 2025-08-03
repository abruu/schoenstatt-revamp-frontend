"use client"

import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    Target,
    Eye,
    Users,
    HelpCircle,
    GraduationCap,
    HeartHandshake,
    ShieldCheck,
    TrendingUp,
    Computer,
    LifeBuoy,
    Quote,
    CheckCircle
  } from "lucide-react"

export function AboutPageContent() {


  const faqItems = [
    {
      question: "What courses do you offer?",
      answer:
        "We offer comprehensive German language courses from A1 (beginner) to B2 (upper-intermediate) levels. We also provide specialized preparation courses for the Telc B2 certification exam.",
    },
    {
      question: "Are your certificates internationally recognized?",
      answer:
        "Yes, absolutely. We are an official partner of 'Sprachforum Augsburg' and conduct Telc exams. The Telc certificate is internationally recognized by universities, employers, and government bodies in Germany and worldwide.",
    },
    {
      question: "Do you provide accommodation for students?",
      answer:
        "Yes, we provide comfortable and secure hostel facilities with quality food for our students, ensuring a conducive learning environment away from home.",
    },
    {
      question: "What makes your teaching method different?",
      answer:
        "Our holistic approach combines rigorous language training with deep cultural immersion. Our faculty, many of whom were trained in Germany, use interactive methods and state-of-the-art technology to make learning effective and engaging.",
    },
    {
      question: "What kind of support do you offer for students planning to go to Germany?",
      answer:
        "We provide end-to-end support, including career guidance, assistance with university applications, job placement support, and guidance on the visa process. Our goal is to ensure a smooth transition for our students to life in Germany.",
    },
  ]
  const differentItems = [
    {
      icon: GraduationCap,
      title: "Expert Faculty",
      description:
        "Our instructors are certified and have direct experience with German culture and language training.",
      gradient: "from-cyan-400 to-blue-600",
    },
    {
      icon: HeartHandshake,
      title: "Holistic Approach",
      description:
        "We go beyond language, integrating cultural nuances and real-world application into our curriculum.",
      gradient: "from-green-400 to-teal-600",
    },
    {
      icon: ShieldCheck,
      title: "Official Telc Partner",
      description: "As an authorized Telc exam center, we offer internationally recognized certifications.",
      gradient: "from-purple-400 to-violet-600",
    },
    {
      icon: TrendingUp,
      title: "Proven Success",
      description: "Our students consistently achieve high scores and successfully transition to life in Germany.",
      gradient: "from-amber-400 to-orange-600",
    },
    {
      icon: Computer,
      title: "Modern Infrastructure",
      description: "Learn in a state-of-the-art environment with smart classrooms and advanced learning tools.",
      gradient: "from-rose-400 to-red-600",
    },
    {
      icon: LifeBuoy,
      title: "End-to-End Support",
      description: "From admissions to placements, we provide comprehensive guidance for your entire journey.",
      gradient: "from-sky-400 to-indigo-600",
    },
  ]
  return (
    <div className="container mx-auto px-4 py-16 space-y-24">
      {/* About Us Hero */}
       <section className="grid lg:grid-cols-5 gap-12 items-center scroll-animate fade-up">
          <div className="lg:col-span-3 space-y-6 text-left">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 backdrop-blur-sm">
              <Users className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-medium">ABOUT US</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Pioneering German Language Education
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
              Schoenstatt Language Academy (SLA) is a premier institution dedicated to providing world-class German
              language education. As an initiative of the Secular Institute of Schoenstatt Fathers, we blend academic
              excellence with a holistic approach, preparing students not just to speak German, but to thrive in a
              German-speaking environment.
            </p>
          </div>
          <div className="lg:col-span-2 relative w-full h-full min-h-[300px] lg:min-h-[500px]">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative w-full h-full">
              <Image
                src="/images/hero-group.jpg"
                alt="SLA Team and Students"
                layout="fill"
                objectFit="cover"
                className="rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
              />
            </div>
          </div>
        </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-16 items-start scroll-animate fade-up">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Our Mission
              </h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed border-l-2 border-blue-500 pl-6">
              To empower individuals with superior German language proficiency and deep cultural understanding, enabling
              them to achieve their academic and professional aspirations in Germany and beyond. We are committed to
              providing an immersive, supportive, and technologically advanced learning environment.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Our Vision
              </h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed border-l-2 border-yellow-500 pl-6">
              To be the leading center for German language education in India, recognized for our innovative teaching
              methodologies, high success rates, and our commitment to the holistic development of our students,
              fostering a global community of proficient and culturally aware individuals.
            </p>
          </div>
        </section>

      {/* What We Do */}
      <section className="grid lg:grid-cols-2 gap-12 items-center scroll-animate fade-right">
          <div className="space-y-6">
            <p className="text-sm font-bold tracking-widest text-yellow-400 uppercase">What We Do</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Unlocking German Language And Culture</h2>
            <p className="text-gray-300 leading-relaxed">
              It starts with basic level A1, which lasts for 2 months (8 weeks), then A2 for 2 months (8 weeks),
              followed by B1 for 2 months (9 weeks), then B2 for 3 months (12 weeks). After one month's preparation
              course, you will be eligible to appear for the B2 exam. Altogether it comes to around 10 months.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12">
              <Quote className="h-12 w-12 text-yellow-400 mb-6" />
              <blockquote className="text-xl text-gray-200 italic leading-loose">
                “Under the protection of Mary, we want to learn to educate ourselves to become firm, free, priestly
                personalities.”
              </blockquote>
              <footer className="mt-8 text-right">
                <p className="text-lg font-bold text-white">Fr. Joseph Kentenich</p>
                <p className="text-gray-400">Founder of Schoenstatt Movement</p>
              </footer>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="space-y-16 scroll-animate fade-up">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">What Makes Us Different</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Our unique approach sets us apart, ensuring our students receive the best possible education and support.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentItems.map((item, index) => (
              <div key={index} className="relative group">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
                ></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      {/* What Makes Us Different */}
      {/* <section className="grid lg:grid-cols-2 gap-12 items-center scroll-animate fade-right">
        <div className="space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">What Makes Us Different</h2>
          <p className="text-lg text-gray-400">
            Our unique approach sets us apart, ensuring our students receive the best possible education and support.
          </p>
          <ul className="space-y-4">
            {[
              "Faculty with German Training & Experience",
              "Holistic Approach: Language & Culture",
              "Official Telc Exam Partner",
              "Proven Track Record of Success",
              "State-of-the-Art Infrastructure",
              "End-to-End Student Support System",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                <span className="text-lg text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=600&width=500"
              alt="Students collaborating"
              width={500}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto space-y-12 scroll-animate fade-up">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm">
            <HelpCircle className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-blue-400 font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-400">Find answers to common questions about our academy.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl mb-4 px-6"
            >
              <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 leading-relaxed pt-2">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <section className="py-16 scroll-animate fade-up">
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-2xl opacity-20"></div>
          <div className="relative">
            <Image
              src="/images/about-mission-group.png"
              alt="SLA team on a mission"
              width={1280}
              height={720}
              className="rounded-2xl w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
            <div className="absolute bottom-8 left-8 right-8 md:left-auto md:w-2/5 p-8 bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl">
              <p className="text-sm font-semibold tracking-widest text-yellow-400 uppercase">Our Mission</p>
              <h3 className="mt-2 text-2xl md:text-3xl font-bold text-white">We're On A Mission Of Big Changes.</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
