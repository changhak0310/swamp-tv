// app/api/chzzk/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CHZZK_CLIENT_ID = process.env.CHZZK_CLIENT_ID || '7897fbca-e68e-4024-8b8e-a138b242a9d5';
const CHZZK_CLIENT_SECRET = process.env.CHZZK_CLIENT_SECRET || 'x9QECEPmlP87oZWmkt8-oRCaQ0lRg1khQJBM-GxOxYM';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.json({ error: 'OAuth error', details: error }, { status: 400 });
  }
  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
  }

  console.log('OAuth callback received:', { code, state });

  try {
    const tokenResponse = await fetch('https://openapi.chzzk.naver.com/auth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grantType: 'authorization_code',
        clientId: CHZZK_CLIENT_ID,
        clientSecret: CHZZK_CLIENT_SECRET,
        code,
        state,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Token API error: ${tokenResponse.status} - ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token exchange success:', tokenData);
    
    // tokenData.content에 실제 토큰 값들이 들어있다고 가정
    const { accessToken, refreshToken, expiresIn } = tokenData.content;

    // 쿠키 API 사용: 서버에서 쿠키 스토어에 직접 접근하여 쿠키 설정
    const cookieStore = cookies();
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: expiresIn, // 예: 86400초 (하루)
      // 개발 환경에서는 secure 옵션은 생략하거나 false 설정
      sameSite: 'lax',
    });
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30일
      sameSite: 'lax',
    });

    // 하나의 응답 객체에 쿠키를 설정한 상태에서 리다이렉트 응답 생성
    const response = NextResponse.redirect(new URL('/test3', request.url));
    return response;
  } catch (err: any) {
    console.error('Token exchange error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
