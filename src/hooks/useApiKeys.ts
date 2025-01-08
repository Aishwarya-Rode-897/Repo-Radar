import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ApiKeyDB } from '@/lib/supabase';
import { ApiKey } from '@/lib/api/apiKeys';

// Transform function to convert from DB format to component format
function transformApiKey(dbKey: ApiKeyDB): ApiKey {
  return {
    ...dbKey,
    createdAt: new Date(dbKey.created_at).toISOString().split('T')[0],
    isActive: dbKey.is_active,
    isVisible: false,
  };
}

export const useApiKeys = (userId: string) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadApiKeys();
    }
  }, [userId]);

  const loadApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys');
      if (!response.ok) {
        throw new Error('Failed to load API keys');
      }
      const keys: ApiKeyDB[] = await response.json();
      setApiKeys(keys.map(transformApiKey));
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const createKey = async (name: string) => {
    if (!name.trim()) {
      toast.error('Key name is required');
      return null;
    }
    
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create API key');
      }

      const newKey: ApiKeyDB = await response.json();
      const transformedKey = transformApiKey(newKey);
      setApiKeys([transformedKey, ...apiKeys]);
      toast.success('API key created successfully');
      return transformedKey;
    } catch (error: any) {
      console.error('Error creating API key:', error);
      toast.error(error.message || 'Failed to create API key');
      return null;
    }
  };

  const updateKeyName = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to update API key name');
      }

      const updatedKey: ApiKeyDB = await response.json();
      const transformedKey = transformApiKey(updatedKey);
      setApiKeys(
        apiKeys.map((key) =>
          key.id === id ? { ...transformedKey, isVisible: key.isVisible } : key
        )
      );
      toast.success('API key name updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating API key name:', error);
      toast.error('Failed to update API key name');
      return false;
    }
  };

  const deleteKey = async (id: string) => {
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      setApiKeys(apiKeys.filter((key) => key.id !== id));
      toast.success('API key deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
      return false;
    }
  };

  const regenerateKey = async (id: string) => {
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'regenerate' }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate API key');
      }

      const updatedKey: ApiKeyDB = await response.json();
      const transformedKey = transformApiKey(updatedKey);
      setApiKeys(
        apiKeys.map((key) =>
          key.id === id ? { ...transformedKey, isVisible: key.isVisible } : key
        )
      );
      toast.success('API key regenerated successfully');
      return true;
    } catch (error) {
      console.error('Error regenerating API key:', error);
      toast.error('Failed to regenerate API key');
      return false;
    }
  };

  const toggleKeyStatus = async (id: string) => {
    const key = apiKeys.find((k) => k.id === id);
    if (!key) return false;

    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-status',
          isActive: !key.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update API key status');
      }

      const updatedKey: ApiKeyDB = await response.json();
      const transformedKey = transformApiKey(updatedKey);
      setApiKeys(
        apiKeys.map((k) =>
          k.id === id ? { ...transformedKey, isVisible: k.isVisible } : k
        )
      );
      toast.success(`API key ${key.isActive ? 'deactivated' : 'activated'} successfully`);
      return true;
    } catch (error) {
      console.error('Error updating API key status:', error);
      toast.error('Failed to update API key status');
      return false;
    }
  };

  const toggleKeyVisibility = (id: string) => {
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

  return {
    apiKeys,
    isLoading,
    createKey,
    updateKeyName,
    deleteKey,
    regenerateKey,
    toggleKeyStatus,
    toggleKeyVisibility,
  };
}; 