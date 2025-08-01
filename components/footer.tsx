import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="relative bg-black/50 backdrop-blur-xl border-t border-white/10 mt-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  SCHOENSTATT
                </span>
                <span className="text-sm text-yellow-400 font-medium tracking-wider">LANGUAGE ACADEMY</span>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Pioneering the future of German language education through innovative teaching methodologies and immersive
              learning experiences.
            </p>

            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#", color: "hover:text-blue-400" },
                { icon: Instagram, href: "#", color: "hover:text-pink-400" },
                { icon: Youtube, href: "#", color: "hover:text-red-400" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/10`}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Our Courses", href: "/courses" },
                { name: "B2 Telc Exam", href: "/b2-exam" },
                { name: "Gallery", href: "/gallery" },
                { name: "Videos", href: "/videos" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Centers */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Centers
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Thrissur", href: "/centers/thrissur" },
                { name: "Chalakudy", href: "/centers/chalakudy" },
                { name: "Peravoor", href: "/centers/peravoor" },
              ].map((center) => (
                <li key={center.name}>
                  <Link
                    href={center.href}
                    className="text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    {center.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Stay Connected
            </h3>

            <div className="space-y-4">
              {[
                { icon: Mail, text: "info@sla.schoenstatt-fathers.in" },
                { icon: Phone, text: "+91 487 2421234" },
                { icon: MapPin, text: "Thrissur, Kerala, India" },
              ].map((contact, index) => (
                <div key={index} className="flex items-start gap-3">
                  <contact.icon className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">{contact.text}</span>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-400/50"
                />
                <Button
                  size="icon"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Schoenstatt Language Academy. All rights reserved. | Crafted with ⚡ for the future of learning.
          </p>
        </div>
      </div>
    </footer>
  )
}
