"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { MapPin, Phone, Mail, Clock, Users, Building, Instagram, Facebook,ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageSlider } from "@/components/common/image-slider"
export function BranchesSection() {
  const [selectedBranch, setSelectedBranch] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const branches = [
    {
      name: "Schoenstatt Academy (Kuttur, Thrissur)",
      header: "Thrissur Center",
      address: "Schoenstatt Language Academy, Sion Centre, Kottekkad, Kuttoor, Thrissur, Kerala 680013",
      phone: "7994361013, 9447053306",
      callno:'',
      email: "languageacademyschoenstatt@gmail.com",
      timings: "Mon - Sat: 9:00 AM - 6:00 PM",
      students: "200+",
      established: "2024",
      gradient: "from-blue-400 to-blue-600",
      features: ["Main Campus", "Library", "Hostel Facility", "Career Guidance"],
      instagram: "https://www.instagram.com/sla_kuttur/",
      facebook: "https://www.facebook.com/sla.kuttur",
      location: "https://www.google.com/maps?q=Schoenstatt+language+Academy,+Kottekkad,+Kuttoor,+Thrissur,+Kerala+680013&ftid=0x3ba7eebb3655554d:0xbfad3e55405da126&entry=gps&lucs=,94215790,47071704,94206166,47069508,94218635,94203019,47084304,94208458,94208447&g_ep=CAISDTYuMTE0LjMuNTkxOTAYACCenQoqUSw5NDIxNTc5MCw0NzA3MTcwNCw5NDIwNjE2Niw0NzA2OTUwOCw5NDIxODYzNSw5NDIwMzAxOSw0NzA4NDMwNCw5NDIwODQ1OCw5NDIwODQ0N0ICSU4%3D",
      images: [
        "https://static.vecteezy.com/system/resources/previews/010/938/844/non_2x/tropical-purple-butterfly-illustration-beautiful-butterfly-vector.jpg",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "https://static.vecteezy.com/system/resources/previews/010/938/844/non_2x/tropical-purple-butterfly-illustration-beautiful-butterfly-vector.jpg",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "https://static.vecteezy.com/system/resources/previews/010/938/844/non_2x/tropical-purple-butterfly-illustration-beautiful-butterfly-vector.jpg",
        "/placeholder.svg?height=400&width=600",
      ],
    },
    {
      name: "Schoenstatt Academy (Aloor,Chalakkudy)",
      header: "Chalakudy Center",
      address: "Schoenstatt Language Academy, Aloor – Cherukunnu Rd, near St Thomas Church, Aloor, Kerala 680683",
      phone: "8281603660, 8281038421",
      callno:'8281603660',
      email: "slaaloor2000@gmail.com",
      timings: "Mon - Sat: 9:00 AM - 6:00 PM",
      students: "150+",
      established: "2016",
      gradient: "from-green-400 to-green-600",
      features: ["Smart Classrooms", "Language Lab", "Cultural Center", "Exam Center"],
      instagram: "https://www.instagram.com/german.sla_chalakudy/",
      facebook: "https://www.facebook.com/people/Sla-German-Chalakudy/",
      location: "https://www.google.com/maps?q=Schoenstatt+Language+Academy,+Alur+-+Cherukunnu+Rd,+near+St+Thomas+Church,+Alur,+Kerala+680683&ftid=0x3ba7f92f1b0bff95:0x90ada14d0862e435&entry=gps&lucs=,94215790,47071704,94206166,47069508,94218635,94203019,47084304,94208458,94208447&g_ep=CAISDTYuMTE0LjMuNTkxOTAYACCenQoqUSw5NDIxNTc5MCw0NzA3MTcwNCw5NDIwNjE2Niw0NzA2OTUwOCw5NDIxODYzNSw5NDIwMzAxOSw0NzA4NDMwNCw5NDIwODQ1OCw5NDIwODQ0N0ICSU4%3DChalakudy",
      images: [
        "https://static.vecteezy.com/system/resources/previews/010/938/844/non_2x/tropical-purple-butterfly-illustration-beautiful-butterfly-vector.jpg",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
    },
    {
      name: "Schoenstatt Academy (Peravoor,Kannur)",
      header: "Peravoor Center",
      address: "Schoenstatt Language Academy, Manathana-Kottiyoor Rd, Thondiyil, Peravoor, Kerala 670673",
      phone: "7306861763",
      callno:'8281603660',
      email: "peravoorsla@gmail.com",
      timings: "Mon - Sat: 9:00 AM - 6:00 PM",
      students: "100+",
      established: "2016",
      gradient: "from-purple-400 to-purple-600",
      features: ["Modern Facilities", "Online Classes", "Weekend Batches", "Flexible Timings"],
      instagram: "https://www.instagram.com/sla_peravoor/",
      facebook: "https://www.facebook.com/slaperavoor",
      location: "https://www.google.com/maps?q=VPXV+45R+Schoenstatt+Language+Academy(SLA),+Peravoor.+%E0%B4%B7%E0%B5%87%E0%B5%BA%E0%B4%B8%E0%B5%8D%E0%B4%B1%E0%B5%8D%E0%B4%B1%E0%B4%BE%E0%B4%9F%E0%B5%8D%E0%B4%9F%E0%B5%8D+%E0%B4%B2%E0%B4%BE%E0%B4%82%E0%B4%97%E0%B5%8D%E0%B4%B5%E0%B5%87%E0%B4%9C%E0%B5%8D+%E0%B4%85%E0%B4%95%E0%B5%8D%E0%B4%95%E0%B4%BE%E0%B4%A6%E0%B4%AE%E0%B4%BF,+Manathana-Kottiyoor+Rd,+Thondiyil,+Peravoor,+Kerala+670673&ftid=0x3ba5cd9c885ad593:0x5946cb768036ce96&entry=gps&lucs=,94215790,47071704,94206166,47069508,94218635,94203019,47084304,94208458,94208447&g_ep=CAISDTYuMTE0LjMuNTkxOTAYACCenQoqUSw5NDIxNTc5MCw0NzA3MTcwNCw5NDIwNjE2Niw0NzA2OTUwOCw5NDIxODYzNSw5NDIwMzAxOSw0NzA4NDMwNCw5NDIwODQ1OCw5NDIwODQ0N0ICSU4%3D",
      images: [
        "/placeholder.svg?height=400&width=600",
        "https://static.vecteezy.com/system/resources/previews/010/938/844/non_2x/tropical-purple-butterfly-illustration-beautiful-butterfly-vector.jpg",
        "/placeholder.svg?height=400&width=600",
      ],
  },
  ]


  // Effect for automatic sliding
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextIndex = (currentImageIndex + 1) % branches[selectedBranch].images.length
      setCurrentImageIndex(nextIndex)
    }, 4000) // Change image every 4 seconds

    return () => clearTimeout(timer) // Cleanup the timer
  }, [currentImageIndex, selectedBranch, branches])

  // Effect to reset image index when branch changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [selectedBranch])





  return (
    <section className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 left-10 w-72 h-72 bg-green-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-400/20 to-green-500/20 border border-blue-400/30 backdrop-blur-sm">
            <Building className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-blue-400 font-medium">OUR BRANCHES</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Learning Centers Across Kerala
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Experience world-class German language education at our state-of-the-art centers strategically located
            across Kerala.
          </p>
        </div>

        {/* Branch Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {branches.map((branch, index) => (
            <Button
              key={index}
              onClick={() => setSelectedBranch(index)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedBranch === index
                  ? `bg-gradient-to-r ${branch.gradient} text-white shadow-lg hover:scale-105`
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {branch.header}
            </Button>
          ))}
        </div>

        {/* Selected Branch Details */}
        <div className="relative">
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${branches[selectedBranch].gradient} rounded-3xl blur-xl opacity-20`}
          ></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Branch Info */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-3xl mb-2 font-bold text-white">{branches[selectedBranch].name}</h3>
                  {/* <h5 className=" text-white">{branches[selectedBranch].header}</h5> */}
                  <div className="flex flex-wrap gap-2">
                    {branches[selectedBranch].features.map((feature, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${branches[selectedBranch].gradient} text-white`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-0">
                  <div className="flex items-start gap-3">
                    <MapPin className={`h-5 w-5 text-blue-400 mt-1 flex-shrink-0`} />
                    <span className="text-gray-300">{branches[selectedBranch].address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className={`h-5 w-5 text-green-400 flex-shrink-0`} />
                    <span className="text-gray-300">{branches[selectedBranch].phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className={`h-5 w-5 text-purple-400 flex-shrink-0`} />
                    <span className="text-gray-300">{branches[selectedBranch].email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className={`h-5 w-5 text-yellow-400 flex-shrink-0`} />
                    <span className="text-gray-300">{branches[selectedBranch].timings}</span>
                  </div>
                  <div className="flex mt-2 pt-3 items-center gap-4">
                    <a target="_blank" href={branches[selectedBranch].instagram} className="text-white hover:text-blue-400 transition-colors">
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a target="_blank" href={branches[selectedBranch].facebook} className="text-white hover:text-blue-400 transition-colors">
                      <Facebook className="h-6 w-6" />
                    </a>
                  </div>
                </div>

                {/* Connect With Us Section */}

                  {/* <h4 className="text-xl font-semibold text-white">Connect With Us</h4> */}




                <Button onClick={() => window.open(branches[selectedBranch].location, "_blank")}
                  className={`bg-gradient-to-r ${branches[selectedBranch].gradient} hover:scale-105 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300`}
                >
                  Visit This Center
                </Button>
              </div>

               {/* Image Slider */}
               <ImageSlider
                key={selectedBranch}
                images={branches[selectedBranch].images}
                altPrefix={branches[selectedBranch].name}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
