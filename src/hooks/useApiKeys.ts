import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ApiKey, apiKeyService } from '@/lib/api/apiKeys';

export const useApiKeys = (userId: string) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const keys = await apiKeyService.getApiKeys(userId);
      setApiKeys(keys);
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
      const newKey = await apiKeyService.createApiKey(name, userId);
      if (!newKey) {
        throw new Error('Failed to create API key');
      }
      
      setApiKeys([newKey, ...apiKeys]);
      toast.success('API key created successfully');
      return newKey;
    } catch (error: any) {
      console.error('Error creating API key:', error);
      toast.error(error.message || 'Failed to create API key');
      return null;
    }
  };

  const updateKeyName = async (id: string, name: string) => {
    try {
      await apiKeyService.updateKeyName(id, name, userId);
      setApiKeys(
        apiKeys.map((key) =>
          key.id === id
            ? {
                ...key,
                name,
              }
            : key
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
      await apiKeyService.deleteApiKey(id, userId);
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
      const updatedKey = await apiKeyService.regenerateApiKey(id, userId);
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
      await apiKeyService.updateKeyStatus(id, !key.isActive, userId);
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