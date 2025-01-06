import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ApiKeyDB {
  id: string;
  name: string;
  key: string;
  created_at: string;
  is_active: boolean;
  user_id: string;
}

export async function createApiKey(name: string, userId: string) {
  if (!name || !userId) {
    throw new Error('Name and user ID are required');
  }

  const key = `rr_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
  
  const { data, error } = await supabase
    .from('api_keys')
    .insert([
      {
        name,
        key,
        is_active: true,
        user_id: userId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('No data returned from database');
  }

  return data;
}

export async function getApiKeys(userId: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateApiKeyName(id: string, name: string, userId: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .update({ name })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateApiKeyStatus(id: string, isActive: boolean, userId: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .update({ is_active: isActive })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function regenerateApiKey(id: string, userId: string) {
  const newKey = `rr_${Math.random().toString(36).substring(2, 15)}`;
  
  const { data, error } = await supabase
    .from('api_keys')
    .update({ key: newKey })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteApiKey(id: string, userId: string) {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
} 