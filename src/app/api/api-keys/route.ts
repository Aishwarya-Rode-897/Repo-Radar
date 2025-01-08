import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createApiKey, getApiKeys, getUser } from '@/lib/supabase';

// Helper function to get user ID from session
async function getUserIdFromSession() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const user = await getUser(session.user.email);
  if (!user?.id) {
    throw new Error('User not found');
  }

  return user.id;
}

export async function GET(
  request: Request
): Promise<Response> {
  try {
    const userId = await getUserIdFromSession();
    const apiKeys = await getApiKeys(userId);
    
    return NextResponse.json(apiKeys);
  } catch (error: any) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch API keys' },
      { status: error?.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<Response> {
  try {
    const userId = await getUserIdFromSession();
    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Key name is required' },
        { status: 400 }
      );
    }

    const newKey = await createApiKey(name, userId);
    return NextResponse.json(newKey, { status: 201 });
  } catch (error: any) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create API key' },
      { status: error?.message === 'Unauthorized' ? 401 : 500 }
    );
  }
} 