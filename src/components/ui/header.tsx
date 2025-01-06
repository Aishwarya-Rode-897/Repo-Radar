'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "./logo";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-[#1a1b1e]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

