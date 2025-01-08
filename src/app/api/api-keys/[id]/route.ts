import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { 
  getUser, 
  updateApiKeyName, 
  updateApiKeyStatus, 
  regenerateApiKey, 
  deleteApiKey 
} from '@/lib/supabase';

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

// PUT /api/api-keys/[id] - Update API key name
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromSession();
    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Key name is required' },
        { status: 400 }
      );
    }

    const updatedKey = await updateApiKeyName(params.id, name, userId);
    return NextResponse.json(updatedKey);
  } catch (error: any) {
    console.error('Error updating API key name:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update API key name' },
      { status: error?.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PATCH /api/api-keys/[id] - Update API key status or regenerate key
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromSession();
    const { action, isActive } = await request.json();

    if (action === 'regenerate') {
      const updatedKey = await regenerateApiKey(params.id, userId);
      return NextResponse.json(updatedKey);
    } else if (action === 'toggle-status' && typeof isActive === 'boolean') {
      const updatedKey = await updateApiKeyStatus(params.id, isActive, userId);
      return NextResponse.json(updatedKey);
    } else {
      return NextResponse.json(
        { error: 'Invalid action or missing parameters' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update API key' },
      { status: error?.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// DELETE /api/api-keys/[id] - Delete an API key
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromSession();
    await deleteApiKey(params.id, userId);
    
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete API key' },
      { status: error?.message === 'Unauthorized' ? 401 : 500 }
    );
  }
} 