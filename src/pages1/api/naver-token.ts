// pages/api/naver-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (true) {
    const { code, state } = req.body;

    const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}&state=${state}`;

    try {
      const response = await fetch(tokenUrl, { method: 'POST' });
      const data = await response.json();

      if (data.access_token) {
        res.status(200).json({ accessToken: data.access_token });
      } else {
        res.status(400).json({ error: 'Failed to fetch access token' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).end();
  }
}
