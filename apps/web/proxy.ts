import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export function proxy(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    const backendPath = url.pathname.replace('/api', '');
    const backendUrl = new URL(backendPath, BACKEND_URL);
    backendUrl.search = url.search;

    return NextResponse.rewrite(backendUrl, {
      request: { headers: request.headers },
    });
  }
}

export const config = {
  matcher: '/api/:path*',
};
