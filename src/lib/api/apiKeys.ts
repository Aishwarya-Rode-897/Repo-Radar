import { ApiKeyDB, createApiKey, deleteApiKey, getApiKeys, regenerateApiKey, updateApiKeyName, updateApiKeyStatus } from "@/lib/supabase";

export interface ApiKey extends Omit<ApiKeyDB, 'created_at'> {
  createdAt: string;
  isVisible?: boolean;
  isActive: boolean;
}

export const apiKeyService = {
  getApiKeys: async (userId: string): Promise<ApiKey[]> => {
    const keys = await getApiKeys(userId);
    return keys.map((key) => ({
      ...key,
      createdAt: new Date(key.created_at).toISOString().split('T')[0],
      isVisible: false,
      isActive: key.is_active,
    }));
  },

  createApiKey: async (name: string, userId: string): Promise<ApiKey | null> => {
    const newKey = await createApiKey(name, userId);
    if (!newKey) return null;
    
    return {
      ...newKey,
      createdAt: new Date(newKey.created_at).toISOString().split('T')[0],
      isVisible: false,
      isActive: newKey.is_active,
    };
  },

  updateKeyName: async (id: string, name: string, userId: string) => {
    return await updateApiKeyName(id, name, userId);
  },

  deleteApiKey: async (id: string, userId: string) => {
    return await deleteApiKey(id, userId);
  },

  regenerateApiKey: async (id: string, userId: string) => {
    return await regenerateApiKey(id, userId);
  },

  updateKeyStatus: async (id: string, isActive: boolean, userId: string) => {
    return await updateApiKeyStatus(id, isActive, userId);
  },
}; 