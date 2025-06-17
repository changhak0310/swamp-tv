import type { NextApiRequest, NextApiResponse } from 'next';

const CHZZK_CLIENT_ID = process.env.CHZZK_CLIENT_ID || '7897fbca-e68e-4024-8b8e-a138b242a9d5';
const CHZZK_CLIENT_SECRET = process.env.CHZZK_CLIENT_SECRET || 'x9QECEPmlP87oZWmkt8-oRCaQ0lRg1khQJBM-GxOxYM';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channelId } = req.query;
  if (!channelId || typeof channelId !== 'string') {
    return res.status(400).json({ error: 'channelId is required as a query parameter.' });
  }

  const url = `https://openapi.chzzk.naver.com/open/v1/lives?size=20`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CHZZK_CLIENT_ID,
        'Client-Secret': CHZZK_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`CHZZK Live API returned ${response.status}`);
    }

    const json = await response.json();
    const liveList = json?.data || [];

    // liveList에서 channelId가 일치하는 항목 찾기
    const liveData = liveList.find((item: any) => item.channelId === channelId);
    if (!liveData) {
      return res.status(404).json({ error: 'Live data not found or channel is offline' });
    }

    return res.status(200).json({
      liveId: liveData.liveId,
      liveTitle: liveData.liveTitle,
      viewerCount: liveData.concurrentUserCount,
      startTime: liveData.openDate,
      categoryName: liveData.liveCategoryValue,
      thumbnailUrl: liveData.thumbnailUrl || null, // 썸네일 URL이 제공되는 경우
    });
  } catch (error: any) {
    console.error('Failed to fetch CHZZK live info:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}