import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 flex items-center justify-between bg-[#1a1b1e]/50 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Repo-Radar</span>
      </div>
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
      </div>
    </header>
  )
}

