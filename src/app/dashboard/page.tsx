'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Bell, ChevronDown, FileText, Home, Key, LogOut, Menu, Settings, Code2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";
import { useApiKeys } from "@/hooks/useApiKeys";
import { CreateKeyModal } from "@/components/api-keys/CreateKeyModal";
import { EditKeyModal } from "@/components/api-keys/EditKeyModal";
import { ApiKeyTable } from "@/components/api-keys/ApiKeyTable";
import { ApiKey } from "@/lib/api/apiKeys";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    apiKeys,
    isLoading,
    createKey,
    updateKeyName,
    deleteKey,
    regenerateKey,
    toggleKeyStatus,
    toggleKeyVisibility,
  } = useApiKeys(session?.user?.email || "");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleCreateKey = async (name: string) => {
    await createKey(name);
    setShowCreateModal(false);
  };

  const handleEditKey = (key: ApiKey) => {
    setEditingKey(key);
    setShowEditModal(true);
  };

  const handleEditSave = async (id: string, name: string) => {
    await updateKeyName(id, name);
    setShowEditModal(false);
    setEditingKey(null);
  };

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success('API key copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy API key');
    }
  };

  const userImage = session.user.image;
  const userName = session.user.name || 'User';
  const userInitial = userName.charAt(0);

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
            <Button
              variant="ghost"
              className={`w-full flex items-center gap-3 justify-${isSidebarOpen ? 'start' : 'center'} text-white bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500`}
            >
              <Key className="w-5 h-5" />
              {isSidebarOpen && <span>API Keys</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full flex items-center gap-3 justify-${isSidebarOpen ? 'start' : 'center'} text-gray-400 hover:text-white hover:bg-[#2a2d30]`}
            >
              <FileText className="w-5 h-5" />
              {isSidebarOpen && <span>Documentation</span>}
            </Button>
            <Link href="/dashboard/api-playground">
              <Button
                variant="ghost"
                className={`w-full flex items-center gap-3 justify-${isSidebarOpen ? 'start' : 'center'} text-gray-400 hover:text-white hover:bg-[#2a2d30]`}
              >
                <Code2 className="w-5 h-5" />
                {isSidebarOpen && <span>API Playground</span>}
              </Button>
            </Link>
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
            onClick={handleSignOut}
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
              <h1 className="text-xl font-semibold hidden sm:block">Dashboard</h1>
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
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-sm font-medium">{userInitial}</span>
                    </div>
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{userName}</div>
                  <div className="text-xs text-gray-400">{session.user?.email}</div>
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
          <Card className="bg-[#1f2123] border-gray-800">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys</CardDescription>
                </div>
                <div className="w-full sm:w-auto">
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white"
                  >
                    Create New Key
                  </Button>
                </div>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <ApiKeyTable
                apiKeys={apiKeys}
                onCopyKey={handleCopyKey}
                onEditKey={handleEditKey}
                onRegenerateKey={regenerateKey}
                onDeleteKey={deleteKey}
                onToggleVisibility={toggleKeyVisibility}
                onToggleStatus={toggleKeyStatus}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateKeyModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateKey}
        />
      )}

      {showEditModal && editingKey && (
        <EditKeyModal
          apiKey={editingKey}
          onClose={() => {
            setShowEditModal(false);
            setEditingKey(null);
          }}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
} 