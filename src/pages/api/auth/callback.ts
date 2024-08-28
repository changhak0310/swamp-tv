import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query;
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;

  if (!code || !state) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const tokenResponse = await fetch(`https://nid.naver.com/oauth2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId!,
        client_secret: clientSecret!,
        code: code as string,
        state: state as string,
        redirect_uri: redirectUri!,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      // 쿠키 설정
      res.setHeader('Set-Cookie', [
        `NID_AUT=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
        `NID_SES=${tokenData.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
      ]);

      // 리다이렉트 후 사용자 정보 요청 가능
      res.redirect('/');
    } else {
      return res.status(401).json({ error: 'Failed to retrieve access token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}