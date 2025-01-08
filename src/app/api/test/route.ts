import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Test route works' });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: 'Test PUT works' });
} 