// src/pages/api/auth/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const CHZZK_CLIENT_ID = process.env.CHZZK_CLIENT_ID || '7897fbca-e68e-4024-8b8e-a138b242a9d5';
const CHZZK_CLIENT_SECRET = process.env.CHZZK_CLIENT_SECRET || 'x9QECEPmlP87oZWmkt8-oRCaQ0lRg1khQJBM-GxOxYM';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.status(400).json({ error: 'Authorization failed' });
  }
  if (!code || !state) {
    return res.status(400).json({ error: 'Missing code or state' });
  }
  
  try {
    // Access Token 발급 요청
    const tokenResponse = await fetch('https://openapi.chzzk.naver.com/auth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grantType: 'authorization_code',
        clientId: CHZZK_CLIENT_ID,
        clientSecret: CHZZK_CLIENT_SECRET,
        code: code,
        state: state,
      })
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Token API error: ${tokenResponse.status} - ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    const { accessToken, refreshToken, expiresIn } = tokenData;
    
    // Access Token을 HttpOnly 쿠키에 저장 (개발 시에는 Secure 옵션은 생략할 수 있음)
    res.setHeader('Set-Cookie', `token=${accessToken}; HttpOnly; Path=/; Max-Age=${expiresIn}`);
    
    // 로그인 성공 후 메인 화면 (예: "/")으로 리다이렉트
    res.writeHead(302, { Location: '/' });
    res.end();
    
  } catch (err: any) {
    console.error('Token exchange error:', err);
    res.status(500).json({ error: err.message });
  }
}
