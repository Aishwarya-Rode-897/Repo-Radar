'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Copy, Key, Pencil, Plus, RefreshCw, Trash2, Menu, Home, FileText, Users, Settings, LogOut, Bell, ChevronDown, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ApiKeyDB, createApiKey, deleteApiKey, getApiKeys, regenerateApiKey, updateApiKeyName, updateApiKeyStatus } from "@/lib/supabase";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";

interface ApiKey extends Omit<ApiKeyDB, 'created_at'> {
  createdAt: string;
  isVisible?: boolean;
  isActive: boolean;
}

// Mock user ID until auth is implemented
const MOCK_USER_ID = "123";

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [editKeyName, setEditKeyName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const keys = await getApiKeys(MOCK_USER_ID);
      setApiKeys(
        keys.map((key) => ({
          ...key,
          createdAt: new Date(key.created_at).toISOString().split('T')[0],
          isVisible: false,
          isActive: key.is_active,
        }))
      );
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Key name is required');
      return;
    }
    
    try {
      const newKey = await createApiKey(newKeyName, MOCK_USER_ID);
      if (!newKey) {
        throw new Error('Failed to create API key');
      }
      
      setApiKeys([
        {
          ...newKey,
          createdAt: new Date(newKey.created_at).toISOString().split('T')[0],
          isVisible: false,
          isActive: newKey.is_active,
        },
        ...apiKeys,
      ]);
      setNewKeyName("");
      setShowCreateModal(false);
      toast.success('API key created successfully');
    } catch (error: any) {
      console.error('Error creating API key:', error);
      toast.error(error.message || 'Failed to create API key');
    }
  };

  const handleEditClick = (key: ApiKey) => {
    setEditingKey(key);
    setEditKeyName(key.name);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editingKey || !editKeyName.trim()) return;

    try {
      const updatedKey = await updateApiKeyName(editingKey.id, editKeyName, MOCK_USER_ID);
      setApiKeys(
        apiKeys.map((key) =>
          key.id === editingKey.id
            ? {
                ...key,
                name: editKeyName,
              }
            : key
        )
      );
      setShowEditModal(false);
      setEditingKey(null);
      setEditKeyName("");
      toast.success('API key name updated successfully');
    } catch (error) {
      console.error('Error updating API key name:', error);
      toast.error('Failed to update API key name');
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      await deleteApiKey(id, MOCK_USER_ID);
      setApiKeys(apiKeys.filter((key) => key.id !== id));
      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
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

  const handleRegenerateKey = async (id: string) => {
    try {
      const updatedKey = await regenerateApiKey(id, MOCK_USER_ID);
      setApiKeys(
        apiKeys.map((key) =>
          key.id === id
            ? {
                ...key,
                key: updatedKey.key,
              }
            : key
        )
      );
      toast.success('API key regenerated successfully');
    } catch (error) {
      console.error('Error regenerating API key:', error);
      toast.error('Failed to regenerate API key');
    }
  };

  const handleToggleVisibility = (id: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id
          ? {
              ...key,
              isVisible: !key.isVisible,
            }
          : key
      )
    );
  };

  const handleToggleStatus = async (id: string) => {
    const key = apiKeys.find((k) => k.id === id);
    if (!key) return;

    try {
      await updateApiKeyStatus(id, !key.isActive, MOCK_USER_ID);
      setApiKeys(
        apiKeys.map((k) =>
          k.id === id
            ? {
                ...k,
                isActive: !k.isActive,
              }
            : k
        )
      );
      toast.success(`API key ${key.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error updating API key status:', error);
      toast.error('Failed to update API key status');
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
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">API Key</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Created</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="border-b border-gray-700 last:border-0">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-gray-400" />
                          {key.name}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 truncate max-w-[200px] sm:max-w-none">
                            {key.isVisible ? (
                              key.key
                            ) : (
                              <span className="opacity-50">rr_{'*'.repeat(30)}</span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleVisibility(key.id)}
                            className="hover:bg-[#2a2d30] ml-2"
                            title={key.isVisible ? "Hide API Key" : "Show API Key"}
                          >
                            {key.isVisible ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(key.id)}
                          className={`rounded-full px-3 ${
                            key.isActive
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {key.isActive ? 'Active' : 'Inactive'}
                        </Button>
                      </td>
                      <td className="py-4 px-4 text-gray-300 hidden sm:table-cell">{key.createdAt}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyKey(key.key)}
                            className="hover:bg-[#2a2d30]"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(key)}
                            className="hover:bg-[#2a2d30] hidden sm:inline-flex"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRegenerateKey(key.id)}
                            className="hover:bg-[#2a2d30]"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteKey(key.id)}
                            className="hover:bg-[#2a2d30]"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals with updated styling */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="p-6 w-[400px] bg-[#1f2123] border-0">
            <h2 className="text-xl font-bold mb-4 text-white">Create New API Key</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#2a2d30] border-0 text-white placeholder-gray-400"
                  placeholder="e.g., Production API Key"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="border-gray-600 text-gray-300 hover:bg-[#2a2d30]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateKey}
                  className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white"
                >
                  Create Key
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showEditModal && editingKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="p-6 w-[400px] bg-[#1f2123] border-0">
            <h2 className="text-xl font-bold mb-4 text-white">Edit API Key Name</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Key Name
                </label>
                <input
                  type="text"
                  value={editKeyName}
                  onChange={(e) => setEditKeyName(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#2a2d30] border-0 text-white placeholder-gray-400"
                  placeholder="e.g., Production API Key"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingKey(null);
                    setEditKeyName("");
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-[#2a2d30]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditSave}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 