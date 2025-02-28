import type { NextApiRequest, NextApiResponse } from 'next';
import { getNaverCookies } from '../../lib/puppeteerLogin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const cookies = await getNaverCookies(username, password);
    res.status(200).json({ cookies });
  } catch (error) {
    console.error('Error during API call:', error);
    res.status(500).json({ error: 'Failed to retrieve cookies' });
  }
}
