import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  return NextResponse.json({ id: context.params.id });
} 