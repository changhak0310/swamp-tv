// app/api/chzzk/user/route.ts
import { NextResponse } from 'next/server';

// 쿠키 헤더에서 특정 쿠키 값을 추출하는 도우미 함수
function getCookieValue(cookieHeader: string | null, cookieName: string): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split('; ').reduce<Record<string, string>>((acc, cookie) => {
    const [key, value] = cookie.split('=');
    acc[key] = value;
    return acc;
  }, {});
  return cookies[cookieName] || null;
}

const CHZZK_CLIENT_ID = process.env.CHZZK_CLIENT_ID || '7897fbca-e68e-4024-8b8e-a138b242a9d5';
const CHZZK_CLIENT_SECRET = process.env.CHZZK_CLIENT_SECRET || 'x9QECEPmlP87oZWmkt8-oRCaQ0lRg1khQJBM-GxOxYM';

// refresh token을 이용해 새로운 accessToken, refreshToken, expiresIn 값을 받아오는 함수
async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const refreshResponse = await fetch('https://openapi.chzzk.naver.com/auth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grantType: 'refresh_token',
      clientId: CHZZK_CLIENT_ID,
      clientSecret: CHZZK_CLIENT_SECRET,
      refreshToken: refreshToken,
    }),
  });
  if (!refreshResponse.ok) {
    const errorText = await refreshResponse.text();
    throw new Error(`Refresh token API error: ${refreshResponse.status} - ${errorText}`);
  }
  const tokenData = await refreshResponse.json();
  return {
    accessToken: tokenData.accessToken,
    refreshToken: tokenData.refreshToken,
    expiresIn: parseInt(tokenData.expiresIn, 10),
  };
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  let accessToken = getCookieValue(cookieHeader, 'accessToken');
  const refreshToken = getCookieValue(cookieHeader, 'refreshToken');

    // 1. accessToken이 존재하면 그대로 사용자 정보 요청
    if (accessToken) {
        try {
          const userResponse = await fetch('https://openapi.chzzk.naver.com/open/v1/users/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          if (!userResponse.ok) {
            const errorText = await userResponse.text();
            throw new Error(`User API error: ${userResponse.status} - ${errorText}`);
          }
          const userData = await userResponse.json();
          return NextResponse.json(userData);
        } catch (err: any) {
          console.error('User info fetch error:', err);
          return NextResponse.json({ error: err.message }, { status: 500 });
        }
      }

  // 2. accessToken이 없지만 refreshToken이 있다면, refresh 요청 진행
  if (!accessToken && refreshToken) {
    try {
      const newTokens = await refreshAccessToken(refreshToken);
      accessToken = newTokens.accessToken;

      // NextResponse.cookies를 사용해 HttpOnly 쿠키에 갱신된 토큰 저장 (App Router 방식)
      const response = NextResponse.next();
      response.cookies.set('token', newTokens.accessToken, {
        httpOnly: true,
        path: '/',
        maxAge: newTokens.expiresIn,
      });
      response.cookies.set('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30일
      });
      console.log('Access token refreshed successfully.');
      
      // accessToken 업데이트 후 아래 user API 호출
      const userResponse = await fetch('https://openapi.chzzk.naver.com/open/v1/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(`User API error: ${userResponse.status} - ${errorText}`);
      }
      const userData = await userResponse.json();
      return NextResponse.json(userData);
    } catch (err: any) {
      console.error('Token refresh failed:', err);
      return NextResponse.json({ error: 'Failed to refresh token', details: err.message }, { status: 500 });
    }
  }

  // 3. accessToken와 refreshToken 둘 다 없으면 로그인 안 된 것으로 처리
  return NextResponse.json({ error: 'Not logged in: No token available' }, { status: 401 });
}
