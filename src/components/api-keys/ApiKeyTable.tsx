import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Key, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { ApiKey } from "@/lib/api/apiKeys";

interface ApiKeyTableProps {
  apiKeys: ApiKey[];
  onCopyKey: (key: string) => Promise<void>;
  onEditKey: (key: ApiKey) => void;
  onRegenerateKey: (id: string) => Promise<boolean>;
  onDeleteKey: (id: string) => Promise<boolean>;
  onToggleVisibility: (id: string) => void;
  onToggleStatus: (id: string) => Promise<boolean>;
}

export function ApiKeyTable({
  apiKeys,
  onCopyKey,
  onEditKey,
  onRegenerateKey,
  onDeleteKey,
  onToggleVisibility,
  onToggleStatus,
}: ApiKeyTableProps) {
  const handleRegenerateKey = async (id: string) => {
    await onRegenerateKey(id);
  };

  const handleDeleteKey = async (id: string) => {
    await onDeleteKey(id);
  };

  const handleToggleStatus = async (id: string) => {
    await onToggleStatus(id);
  };

  return (
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
                  onClick={() => onToggleVisibility(key.id)}
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
                  onClick={() => onCopyKey(key.key)}
                  className="hover:bg-[#2a2d30]"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditKey(key)}
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
  );
} 