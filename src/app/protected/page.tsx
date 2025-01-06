'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a1c1e] text-white p-4 lg:p-8">
      <Card className="bg-[#1f2123] border-gray-800 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Protected Content</CardTitle>
          <CardDescription>You have successfully validated your API key</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-300">
              Welcome to the protected area! Here you can access exclusive content and features.
            </p>
            <Button
              onClick={() => router.push('/dashboard/api-playground')}
              variant="outline"
              className="text-gray-300 hover:text-white"
            >
              Back to API Playground
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 