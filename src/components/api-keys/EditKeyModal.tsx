import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApiKey } from '@/lib/api/apiKeys';

interface EditKeyModalProps {
  apiKey: ApiKey;
  onClose: () => void;
  onSave: (id: string, name: string) => Promise<void>;
}

export function EditKeyModal({ apiKey, onClose, onSave }: EditKeyModalProps) {
  const [editKeyName, setEditKeyName] = useState(apiKey.name);

  const handleSave = async () => {
    await onSave(apiKey.id, editKeyName);
  };

  return (
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
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-[#2a2d30]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 