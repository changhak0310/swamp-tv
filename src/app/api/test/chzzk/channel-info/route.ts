// src/pages/api/chzzk/channel-info.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const CHZZK_CLIENT_ID = process.env.CHZZK_CLIENT_ID || '7897fbca-e68e-4024-8b8e-a138b242a9d5';
const CHZZK_CLIENT_SECRET = process.env.CHZZK_CLIENT_SECRET || 'x9QECEPmlP87oZWmkt8-oRCaQ0lRg1khQJBM-GxOxYM';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channelId } = req.query;
  if (!channelId || typeof channelId !== 'string') {
    return res.status(400).json({ error: 'channelId is required as a query parameter.' });
  }

  const url = `https://openapi.chzzk.naver.com/open/v1/channels?channelIds=${channelId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CHZZK_CLIENT_ID,
        'Client-Secret': CHZZK_CLIENT_SECRET,
      },
    });

    // 만약 응답이 실패한다면, 응답 본문을 같이 읽어서 에러를 throw
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CHZZK API returned ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    const channelData = json?.content?.data?.[0];

    if (!channelData) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    return res.status(200).json({
      channelId: channelData.channelId,
      channelName: channelData.channelName,
      channelImageUrl: channelData.channelImageUrl,
      followerCount: channelData.followerCount,
      isLive: channelData.openLive,
      isPartner: channelData.verifiedMark,
    });
  } catch (error: any) {
    console.error('Failed to fetch CHZZK channel info:', error);
    return res.status(500).json({ error: error.message });
  }
}
