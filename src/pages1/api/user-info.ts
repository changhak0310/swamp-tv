import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { NID_AUT, NID_SES } = req.cookies;

  if (!NID_AUT || !NID_SES) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const response = await axios.get('https://comm-api.game.naver.com/nng_main/v1/user/getUserStatus', {
      headers: {
        'Cookie': `NID_AUT=${NID_AUT}; NID_SES=${NID_SES}`,
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user status' });
  }
}
