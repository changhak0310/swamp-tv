// src/pages/api/chzzk/user-info.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token found' });
  }
  
  try {
    const response = await fetch('https://openapi.chzzk.naver.com/open/v1/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`User info API error: ${response.status} - ${errorText}`);
    }
    
    const json = await response.json();
    // 예제에서는 json.content에 사용자 데이터가 있다고 가정
    return res.status(200).json(json.content);
  } catch (err: any) {
    console.error('Failed to fetch user info:', err);
    return res.status(500).json({ error: err.message });
  }
}
