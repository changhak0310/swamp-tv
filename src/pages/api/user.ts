import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nidAuth, nidSession } = req.query; // 쿠키에서 NID_AUT와 NID_SES를 받아옵니다.

  try {
    const response = await axios.get('https://comm-api.game.naver.com/nng_main/v1/user/getUserStatus', {
      headers: {
        'Cookie': `NID_AUT=${nidAuth}; NID_SES=${nidSession}`
      }
    });

    const userData = response.data;
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
}