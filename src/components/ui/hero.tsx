'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (session) {
      router.push('/dashboard');
    } else {
      await signIn('google', { callbackUrl: '/dashboard' });
    }
  };

  return (
    <section className="py-32 px-4 md:px-6 text-center bg-[#1a1b1e]">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-pink-400 text-transparent bg-clip-text">
        Gain Insights into Open Source Repositories
      </h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
        RepoRadar provides summaries, star counts, cool facts, latest important pull requests, and version updates for GitHub repositories.
      </p>
      <div className="flex gap-4 justify-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          <Link href="/learn-more">Learn More</Link>
        </Button>
      </div>
    </section>
  )
}

