import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, GitPullRequest, Tag, FileText } from 'lucide-react'

const features = [
  {
    title: 'Repository Summaries',
    description: 'Get concise summaries of repositories at a glance.',
    icon: FileText,
  },
  {
    title: 'Star Tracking',
    description: 'Monitor the popularity of repositories with star counts.',
    icon: Star,
  },
  {
    title: 'Pull Request Insights',
    description: 'Stay updated on the latest important pull requests.',
    icon: GitPullRequest,
  },
  {
    title: 'Version Updates',
    description: 'Track version updates and releases for repositories.',
    icon: Tag,
  },
]

export default function Features() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-pink-400 text-transparent bg-clip-text">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="transition-transform hover:scale-105">
            <CardHeader className="space-y-2">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2.5 flex items-center justify-center">
                <feature.icon className="h-full w-full text-white" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base text-gray-400">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

