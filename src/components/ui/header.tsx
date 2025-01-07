'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "./logo";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleAuth = () => {
    if (session) {
      signOut();
    } else {
      signIn('google');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-[#1a1b1e]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {session && (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            )}
            <Button 
              className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white"
              onClick={handleAuth}
            >
              {session ? 'Sign Out' : 'Sign In with Google'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col gap-2">
              {session && (
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
              )}
              <Button 
                className="w-full justify-start bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white"
                onClick={() => {
                  handleAuth();
                  setIsMenuOpen(false);
                }}
              >
                {session ? 'Sign Out' : 'Sign In with Google'}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

