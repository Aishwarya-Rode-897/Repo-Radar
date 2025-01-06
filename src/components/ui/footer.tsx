import Link from 'next/link'
import { Logo } from './logo'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-8 px-4 md:px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <Logo />
        
        {/* Social Links */}
        <div className="flex items-center gap-6">
          <Link href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
            <Facebook className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
            <Instagram className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <div className="text-gray-400 text-sm">
          &copy; 2025 RepoRadar. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

