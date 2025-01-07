import { validateApiKey } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const isValid = await validateApiKey(apiKey);

    return NextResponse.json({ isValid });
  } catch (error: any) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred while validating the API key' },
      { status: 500 }
    );
  }
} 