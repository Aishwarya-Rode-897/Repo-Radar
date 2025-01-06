'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Copy, Key, Pencil, Plus, RefreshCw, Trash2, Menu, Home, FileText, Users, Settings, LogOut, Bell, ChevronDown, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  isVisible?: boolean;
  isActive: boolean;
}

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API Key",
      key: "rr_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      createdAt: "2024-01-20",
      isVisible: false,
      isActive: true,
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [editKeyName, setEditKeyName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    
    const newKey: ApiKey = {
      id: Math.random().toString(),
      name: newKeyName,
      key: `rr_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString().split("T")[0],
      isActive: true,
      isVisible: false,
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setShowCreateModal(false);
  };

  const handleEditClick = (key: ApiKey) => {
    setEditingKey(key);
    setEditKeyName(key.name);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (!editingKey || !editKeyName.trim()) return;

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
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  const handleCopyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    // You can add a toast notification here
  };

  const handleRegenerateKey = (id: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id
          ? {
              ...key,
              key: `rr_${Math.random().toString(36).substring(2, 15)}`,
            }
          : key
      )
    );
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

  const handleToggleStatus = (id: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id
          ? {
              ...key,
              isActive: !key.isActive,
            }
          : key
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1c1e] text-white">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-[#1f2123] transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} z-20`}>
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center mb-6 text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </Button>
          
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
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1c1e] border-b border-gray-800 z-10">
          <div className="flex justify-end items-center h-16 px-8">
            <div className="flex items-center gap-4">
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

        {/* Page Content */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">API Keys</h1>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-4 h-4" />
              Create New Key
            </Button>
          </div>

          <Card className="p-6 bg-[#1f2123] border-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left pb-4 text-gray-400">Name</th>
                    <th className="text-left pb-4 text-gray-400">API Key</th>
                    <th className="text-left pb-4 text-gray-400">Status</th>
                    <th className="text-left pb-4 text-gray-400">Created</th>
                    <th className="text-left pb-4 text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="border-b border-gray-700 last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-gray-400" />
                          {key.name}
                        </div>
                      </td>
                      <td className="py-4 font-mono text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
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
                      <td className="py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(key.id)}
                          className={`rounded-full px-3 ${
                            key.isActive
                              ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {key.isActive ? 'Active' : 'Inactive'}
                        </Button>
                      </td>
                      <td className="py-4 text-gray-300">{key.createdAt}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
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
                            className="hover:bg-[#2a2d30]"
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