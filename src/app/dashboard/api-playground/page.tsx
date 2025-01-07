'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Bell, ChevronDown, FileText, Home, Key, LogOut, Menu, Settings, Code2 } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { validateApiKey } from "@/lib/supabase";

export default function ApiPlayground() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!apiKey.trim()) {
        toast.error('Please enter an API key');
        return;
      }

      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate API key');
      }

      if (data.isValid) {
        toast.success('Valid API Key');
        router.push('/protected');
      } else {
        toast.error('Sorry! Invalid API Key');
      }
    } catch (error: any) {
      console.error('Error validating API key:', error);
      toast.error(error?.message || 'An error occurred while validating the API key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1c1e] text-white">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-[#1f2123] transition-all duration-300 ${
        isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
      } z-20`}>
        <div className="p-4">
          <div className="flex items-center justify-end mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          <div className="mb-6 flex items-center justify-center">
            <Logo showText={isSidebarOpen} />
          </div>
          
          <nav className="space-y-2">
            <Link href="/">
              <Button
                variant="ghost"
                className={`w-full flex items-center gap-3 justify-${isSidebarOpen ? 'start' : 'center'} text-gray-400 hover:text-white hover:bg-[#2a2d30]`}
              >
                <Home className="w-5 h-5" />
                {isSidebarOpen && <span>Home</span>}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className={`w-full flex items-center gap-3 justify-${isSidebarOpen ? 'start' : 'center'} text-gray-400 hover:text-white hover:bg-[#2a2d30]`}
              >
                <Key className="w-5 h-5" />
                {isSidebarOpen && <span>API Keys</span>}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className={`w-full flex items-center gap-3 justify-${isSidebarOpen ? 'start' : 'center'} text-gray-400 hover:text-white hover:bg-[#2a2d30]`}
            >
              <FileText className="w-5 h-5" />
              {isSidebarOpen && <span>Documentation</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full flex items-center gap-3 justify-${isSidebarOpen ? 'start' : 'center'} text-white bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500`}
            >
              <Code2 className="w-5 h-5" />
              {isSidebarOpen && <span>API Playground</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full flex items-center gap-3 justify-${isSidebarOpen ? 'start' : 'center'} text-gray-400 hover:text-white hover:bg-[#2a2d30]`}
            >
              <Settings className="w-5 h-5" />
              {isSidebarOpen && <span>Settings</span>}
            </Button>
          </nav>
        </div>
        
        <div className="absolute bottom-4 w-full px-4">
          <Button
            variant="ghost"
            className={`w-full flex items-center gap-3 justify-${isSidebarOpen ? 'start' : 'center'} text-white bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600`}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Log out</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1c1e] border-b border-gray-800 z-10">
          <div className="flex justify-between items-center h-16 px-4 lg:px-8">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-400 hover:text-white lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </Button>
              <h1 className="text-xl font-semibold hidden sm:block">API Playground</h1>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-sm font-medium">A</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">Aishwarya</div>
                  <div className="text-xs text-gray-400">Admin</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-8">
          <Card className="bg-[#1f2123] border-gray-800 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>API Playground</CardTitle>
              <CardDescription>Test your API key and explore the API functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium text-gray-200">
                    Enter your API Key
                  </label>
                  <Input
                    id="apiKey"
                    type="text"
                    placeholder="rr_..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-[#2a2d30] border-gray-700 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white"
                >
                  {isLoading ? 'Validating...' : 'Validate API Key'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 