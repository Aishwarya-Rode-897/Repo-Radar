'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
    <section className="py-20 px-4 md:px-6">
      <h2 className="text-3xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-pink-400 text-transparent bg-clip-text">Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`${
              index === 1 ? 'border-primary md:scale-105' : ''
            } transition-transform hover:scale-105 md:hover:scale-110`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl md:text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </div>
                {index > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    Coming Soon
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold mb-4">{plan.price}</p>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm md:text-base">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white opacity-100 disabled:opacity-75"
                disabled={index > 0}
                onClick={index === 0 ? handleGetStarted : undefined}
              >
                {index === 0 ? 'Get Started' : 'Coming Soon'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

