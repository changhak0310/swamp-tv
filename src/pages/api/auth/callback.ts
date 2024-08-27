import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  const state = req.query.state as string;

  if (!code || !state) {
    return res.status(400).json({ error: 'Code and state are required' });
  }

  const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET}&code=${code}&state=${state}`;

  try {
    const tokenResponse = await fetch(tokenUrl, { method: 'POST' });
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    const { access_token } = tokenData;

    const profileUrl = 'https://openapi.naver.com/v1/nid/me';
    const profileResponse = await fetch(profileUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const profileData = await profileResponse.json();

    res.status(200).json(profileData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data from Naver' });
  }
}