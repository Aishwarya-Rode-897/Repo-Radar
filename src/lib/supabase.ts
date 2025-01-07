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

export interface UserDB {
  id: string;
  email: string;
  name: string;
  image: string;
  created_at: string;
  last_login: string;
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

export async function validateApiKey(key: string) {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {  // No rows returned error
        return false;
      }
      throw error;  // For other types of errors
    }

    return !!data;
  } catch (error) {
    console.error('Error validating API key:', error);
    throw error;  // Re-throw the error to be handled by the caller
  }
}

export async function upsertUser(user: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  const { email, name, image } = user;
  
  console.log('Starting upsertUser with data:', { email, name, image });

  try {
    // First, check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log('Existing user check:', { existingUser, fetchError });

    const userData = {
      email,
      name: name || '',
      image: image || '',
      last_login: new Date().toISOString(),
    };

    let result;
    if (!existingUser) {
      // Insert new user
      console.log('Inserting new user');
      result = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
    } else {
      // Update existing user
      console.log('Updating existing user');
      result = await supabase
        .from('users')
        .update(userData)
        .eq('email', email)
        .select()
        .single();
    }

    const { data, error } = result;

    if (error) {
      console.error('Supabase operation error:', error);
      throw error;
    }

    console.log('Upsert operation successful:', data);
    return data;
  } catch (error) {
    console.error('Error in upsertUser:', error);
    throw error;
  }
}

export async function getUser(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
    throw error;
  }

  return data;
} 