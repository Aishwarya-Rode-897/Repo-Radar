import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CreateKeyModalProps {
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export function CreateKeyModal({ onClose, onCreate }: CreateKeyModalProps) {
  const [newKeyName, setNewKeyName] = useState("");

  const handleCreate = async () => {
    await onCreate(newKeyName);
    setNewKeyName("");
  };

  return (
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
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-[#2a2d30]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white"
            >
              Create Key
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 