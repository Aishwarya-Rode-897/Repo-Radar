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
  const [response, setResponse] = useState<any>(defaultResponse)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, this would make an actual API call
      // For demo purposes, we'll simulate a delay and return the default response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const parsedPayload = JSON.parse(payload)
      if (!parsedPayload.githubUrl) {
        throw new Error('GitHub URL is required')
      }
      
      setResponse(defaultResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 px-4 md:px-6 bg-[#1a1b1e]">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-pink-400 text-transparent bg-clip-text">Try It Out</h2>
          <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <a href="/docs" className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              Documentation
            </a>
          </Button>
        </div>
        
        <Card className="bg-[#1e1f23] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Repository Analysis Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request" className="text-gray-300">
              <TabsList className="bg-[#2c2d31]">
                <TabsTrigger value="request" className="data-[state=active]:bg-[#1e1f23]">Request</TabsTrigger>
                <TabsTrigger value="response" className="data-[state=active]:bg-[#1e1f23]">Response</TabsTrigger>
              </TabsList>
              
              <TabsContent value="request" className="space-y-4">
                <Textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="font-mono min-h-[200px] bg-[#2c2d31] border-gray-800 text-gray-300"
                  placeholder="Enter your JSON payload..."
                />
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
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
                    "bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto",
                    "font-mono text-sm"
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

