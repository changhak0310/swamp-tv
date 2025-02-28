import axios from 'axios';

const chzApiClient = axios.create({
  baseURL: 'https://api.chzzk.naver.com',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
});

export async function fetchChzStreamerInfo(channelId: string): Promise<any> {
  try {
    const response = await chzApiClient.get(`/service/v1/channels/${channelId}`);
    return response.data.content;
  } catch (error) {
    console.error('Error fetching CHZ streamer info:', error);
    return null;
  }
}

export async function fetchChzLiveDetail(channelId: string): Promise<any> {
  try {
    const response = await chzApiClient.get(`/service/v2/channels/${channelId}/live-detail`);
    return response.data.content;
  } catch (error) {
    console.error('Error fetching CHZ live detail:', error);
    return null;
  }
}
