"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Award,
  BookOpen,
  Clock,
  Users,
  CheckCircle,
  Star,
  Calendar,
  Headphones,
  MessageCircle,
  PenTool,
  Eye,
  Target,
  Globe,
  TrendingUp,
  Download,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function B2ExamContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const handleContactClick = () => {
    // Use Next.js router for smooth navigation without page refresh
    router.push("/#contact")
  }

  const examSkills = [
    {
      icon: Eye,
      title: "Reading Comprehension",
      duration: "90 minutes",
      description: "Understanding complex texts, articles, and reports on contemporary topics",
      gradient: "from-blue-400 to-blue-600",
      tasks: [
        "Reading comprehension with multiple choice questions",
        "Text completion exercises",
        "Matching headings to paragraphs",
      ],
    },
    {
      icon: Headphones,
      title: "Listening Comprehension",
      duration: "20 minutes",
      description: "Understanding extended speech, lectures, and conversations",
      gradient: "from-green-400 to-green-600",
      tasks: [
        "Multiple choice questions on audio texts",
        "Note completion from lectures",
        "Understanding main ideas and details",
      ],
    },
    {
      icon: PenTool,
      title: "Written Expression",
      duration: "30 minutes",
      description: "Writing clear, detailed texts on various topics and expressing viewpoints",
      gradient: "from-purple-400 to-purple-600",
      tasks: [
        "Formal and informal letter writing",
        "Essay writing on given topics",
        "Report writing with data analysis",
      ],
    },
    {
      icon: MessageCircle,
      title: "Oral Expression",
      duration: "16 minutes",
      description: "Speaking fluently and spontaneously on familiar and unfamiliar topics",
      gradient: "from-yellow-400 to-orange-500",
      tasks: ["Presentation on a given topic", "Discussion and debate", "Role-play scenarios"],
    },
  ]

  const examBenefits = [
    {
      icon: Globe,
      title: "International Recognition",
      description: "Accepted by universities and employers worldwide",
    },
    {
      icon: TrendingUp,
      title: "Career Advancement",
      description: "Opens doors to better job opportunities in Germany",
    },
    {
      icon: BookOpen,
      title: "University Admission",
      description: "Required for many German university programs",
    },
    {
      icon: Target,
      title: "Language Proficiency Proof",
      description: "Official certification of upper-intermediate German skills",
    },
  ]

  const preparationProgram = [
    {
      phase: "Foundation Phase",
      duration: "4 weeks",
      focus: "Grammar review and vocabulary building",
      activities: ["Intensive grammar sessions", "Vocabulary expansion", "Basic exam strategies"],
    },
    {
      phase: "Skill Development",
      duration: "6 weeks",
      focus: "Developing all four language skills",
      activities: ["Reading comprehension practice", "Listening exercises", "Writing workshops", "Speaking practice"],
    },
    {
      phase: "Exam Preparation",
      duration: "4 weeks",
      focus: "Mock tests and exam techniques",
      activities: ["Full-length practice tests", "Time management", "Exam strategies", "Individual feedback"],
    },
    {
      phase: "Final Review",
      duration: "2 weeks",
      focus: "Last-minute preparation and confidence building",
      activities: ["Final mock exams", "Weak area focus", "Stress management", "Exam day preparation"],
    },
  ]

  const successStats = [
    { label: "Success Rate", value: "95%", icon: Award },
    { label: "Students Certified", value: "500+", icon: Users },
    { label: "Average Score", value: "85/100", icon: Star },
    { label: "Course Duration", value: "16 weeks", icon: Clock },
  ]

  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 backdrop-blur-sm">
          <Award className="h-5 w-5 text-yellow-400 mr-2" />
          <span className="text-yellow-400 font-medium">TELC B2 CERTIFICATION</span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Master German B2 Level
          </span>
          <br />
          <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Telc Certification
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
          Achieve upper-intermediate German proficiency with our comprehensive B2 Telc exam preparation program. In
          partnership with Sprachforum Augsburg, we provide internationally recognized certification that opens doors to
          German universities and career opportunities.
        </p>

        {/* Success Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {successStats.map((stat, index) => (
            <div key={index} className="relative group">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-500 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="flex justify-center">
        <div className="flex flex-wrap gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "skills", label: "Exam Skills" },
            { id: "preparation", label: "Preparation" },
            { id: "benefits", label: "Benefits" },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Content Sections */}
      {activeTab === "overview" && (
        <section className="space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">What is Telc B2?</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              The European Language Certificate (telc) B2 is an internationally recognized German language proficiency
              test that certifies upper-intermediate level skills according to the Common European Framework of
              Reference for Languages (CEFR).
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Why Choose Telc B2?</h3>
              <ul className="space-y-4">
                {[
                  "Internationally recognized certification",
                  "Required for German university admission",
                  "Accepted by German employers",
                  "Comprehensive assessment of all language skills",
                  "Partnership with Sprachforum Augsburg",
                  "High success rate with expert preparation",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white">CEFR B2 Level</h4>
                  <p className="text-gray-300 text-sm">
                    Can understand the main ideas of complex text on both concrete and abstract topics, including
                    technical discussions in their field of specialization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "skills" && (
        <section className="space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Exam Skills Assessment</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              The Telc B2 exam evaluates four essential language skills through comprehensive testing methods.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {examSkills.map((skill, index) => (
              <div key={index} className="relative group">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${skill.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
                ></div>

                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${skill.gradient} rounded-xl flex items-center justify-center`}
                    >
                      <skill.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{skill.title}</h3>
                      <Badge className="bg-white/20 text-gray-300 mt-1">{skill.duration}</Badge>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6">{skill.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Key Tasks:</h4>
                    <ul className="space-y-2">
                      {skill.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-400 text-sm">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "preparation" && (
        <section className="space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">16-Week Preparation Program</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Our structured preparation program ensures comprehensive coverage of all exam components with personalized
              attention and expert guidance.
            </p>
          </div>

          <div className="space-y-8">
            {preparationProgram.map((phase, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{phase.phase}</h3>
                        <Badge className="bg-yellow-400/20 text-yellow-400">{phase.duration}</Badge>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Focus Area</h4>
                        <p className="text-gray-300 text-sm">{phase.focus}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Key Activities</h4>
                        <ul className="space-y-1">
                          {phase.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="text-gray-400 text-sm flex items-center gap-2">
                              <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {index < preparationProgram.length - 1 && (
                  <div className="w-px h-8 bg-gradient-to-b from-yellow-400 to-transparent ml-6 mt-2"></div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "benefits" && (
        <section className="space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Benefits of B2 Certification</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Achieving B2 level German proficiency opens numerous opportunities for personal and professional growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {examBenefits.map((benefit, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500"></div>

                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-300">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-white">Ready to Start Your B2 Journey?</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Join our comprehensive B2 Telc preparation program and take the next step towards your German language
                goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleContactClick}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-3 rounded-full"
                >
                  Enroll Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-full bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Get Started Today</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Contact us to learn more about our B2 Telc preparation program and take the first step towards your German
            language certification.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Next Batch</h4>
              <p className="text-gray-400 text-sm">February 1, 2025</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Duration</h4>
              <p className="text-gray-400 text-sm">16 weeks intensive</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Class Size</h4>
              <p className="text-gray-400 text-sm">Max 12 students</p>
            </div>
          </div>
          <Button
            onClick={handleContactClick}
            className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold px-8 py-3 rounded-full"
          >
            Contact Us Now
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
