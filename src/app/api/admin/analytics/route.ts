import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ activation: 0, retention7d: 0, events: [] });
}
