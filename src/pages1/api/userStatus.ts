import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const gameApiUrl = 'https://comm-api.game.naver.com/nng_main/v1/user/getUserStatus';
    const gameApiResponse = await fetch(gameApiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!gameApiResponse.ok) {
      return res.status(gameApiResponse.status).json({ error: 'Failed to fetch user status from game API' });
    }

    const gameApiData = await gameApiResponse.json();
    res.status(200).json(gameApiData);
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}