import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-6 px-4 md:px-6 border-t">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p>&copy; 2025 RepoRadar. All rights reserved.</p>
        </div>
        <nav className="flex space-x-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}

