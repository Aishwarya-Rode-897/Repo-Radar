import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Free',
    description: 'For individuals and small teams',
    price: '$0',
    features: ['5 repositories', 'Basic insights', 'Daily updates'],
  },
  {
    name: 'Pro',
    description: 'For growing teams and organizations',
    price: '$19',
    features: ['Unlimited repositories', 'Advanced insights', 'Real-time updates', 'API access'],
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    price: 'Custom',
    features: ['Custom integrations', 'Dedicated support', 'SLA', 'On-premise option'],
  },
]

export default function Pricing() {
  return (
    <section className="py-20 px-4 md:px-6">
      <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={index === 1 ? 'border-primary' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {index > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    Coming Soon
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {index === 0 ? (
                <Button asChild className="w-full">
                  <Link href={`/signup?plan=${plan.name.toLowerCase()}`}>Choose Plan</Link>
                </Button>
              ) : (
                <Button className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

