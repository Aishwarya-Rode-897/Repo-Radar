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
    <section className="py-20 px-4 md:px-6">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-pink-400 text-transparent bg-clip-text">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <feature.icon className="h-8 w-8 mb-2" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

