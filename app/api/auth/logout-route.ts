import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Firebase logout is handled client-side
    // This endpoint just acknowledges the logout request
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('auth');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    );
  }
}
