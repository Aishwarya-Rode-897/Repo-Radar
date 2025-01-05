'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 flex items-center justify-between bg-[#1a1b1e]/50 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Repo-Radar</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
        <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
        <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
        <Link href="/pricing" className="text-gray-300 hover:text-white">Pricing</Link>
        <Link href="/use-case" className="text-gray-300 hover:text-white">Use Case</Link>
        <Link href="/feature" className="text-gray-300 hover:text-white">Feature</Link>
      </nav>

      <div className="flex items-center space-x-4">
        <Button asChild className="bg-white text-black hover:bg-gray-100">
          <Link href="/login">Log In</Link>
        </Button>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#1a1b1e] border-t border-gray-800 md:hidden">
          <nav className="flex flex-col py-4">
            <Link href="/" className="px-6 py-2 text-gray-300 hover:text-white hover:bg-gray-800">Home</Link>
            <Link href="/dashboard" className="px-6 py-2 text-gray-300 hover:text-white hover:bg-gray-800">Dashboard</Link>
            <Link href="/about" className="px-6 py-2 text-gray-300 hover:text-white hover:bg-gray-800">About</Link>
            <Link href="/pricing" className="px-6 py-2 text-gray-300 hover:text-white hover:bg-gray-800">Pricing</Link>
            <Link href="/use-case" className="px-6 py-2 text-gray-300 hover:text-white hover:bg-gray-800">Use Case</Link>
            <Link href="/feature" className="px-6 py-2 text-gray-300 hover:text-white hover:bg-gray-800">Feature</Link>
          </nav>
        </div>
      )}
    </header>
  )
}

