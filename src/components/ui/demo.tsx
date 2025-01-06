'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ExternalLink, Play, FileJson } from 'lucide-react'
import { cn } from '@/lib/utils'

const defaultPayload = {
  githubUrl: "https://github.com/assafelovic/gpt-researcher"
}

const defaultResponse = {
  summary: "GPT Researcher is an autonomous agent designed for comprehensive online research on various tasks. It aims to produce detailed, factual, and unbiased research reports by leveraging AI technology. The project addresses issues of misinformation, speed, determinism, and reliability in research tasks.",
  cool_facts: [
    "The project leverages both 'gpt-4o-mini' and 'gpt-4o' (128K context) to complete research tasks, optimizing costs by using each only when necessary.",
    "The average research task using GPT Researcher takes around 2 minutes to complete and costs approximately $0.005."
  ]
}

export default function Demo() {
  const [payload, setPayload] = useState(JSON.stringify(defaultPayload, null, 2))
  const [response, setResponse] = useState(defaultResponse)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    setIsLoading(true)
    setError(null)
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-[#1a1b1e]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-pink-400 text-transparent bg-clip-text">
            Try it out
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Enter a GitHub repository URL and get instant insights about the project.
          </p>
        </div>
        
        <Card className="bg-[#1e1f23] border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-white">Repository Analysis Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request" className="text-gray-300">
              <TabsList className="bg-[#2c2d31] w-full md:w-auto">
                <TabsTrigger value="request" className="flex-1 md:flex-none data-[state=active]:bg-[#1e1f23]">Request</TabsTrigger>
                <TabsTrigger value="response" className="flex-1 md:flex-none data-[state=active]:bg-[#1e1f23]">Response</TabsTrigger>
              </TabsList>
              
              <TabsContent value="request" className="space-y-4">
                <Textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="font-mono text-sm md:text-base min-h-[200px] bg-[#2c2d31] border-gray-800 text-gray-300"
                  placeholder="Enter your JSON payload..."
                />
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full md:w-auto flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Play className="h-4 w-4" />
                    {isLoading ? 'Analyzing...' : 'Analyze Repository'}
                  </Button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </TabsContent>
              
              <TabsContent value="response">
                <pre
                  className={cn(
                    "bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto",
                    "font-mono text-xs md:text-sm"
                  )}
                >
                  {JSON.stringify(response, null, 2)}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

