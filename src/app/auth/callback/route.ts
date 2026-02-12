import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const next = request.nextUrl.searchParams.get('next');
  const safeNext = next && next.startsWith('/') ? next : '/home';

  if (!code) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'missing_code');
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const completeUrl = new URL('/auth/complete', request.url);
  completeUrl.searchParams.set('code', code);
  completeUrl.searchParams.set('next', safeNext);

  return NextResponse.redirect(completeUrl, { status: 303 });
}
