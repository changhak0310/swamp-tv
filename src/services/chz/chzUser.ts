import axios from 'axios';

export async function fetchChzUserInfo(accessToken: string): Promise<any> {
  try {
    const response = await axios.get(
      'https://comm-api.game.naver.com/nng_main/v1/user/getUserStatus',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.content;
  } catch (error) {
    console.error('Error fetching CHZ user info:', error);
    return null;
  }
}