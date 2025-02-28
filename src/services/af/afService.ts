import axios from 'axios';

const afApiClient = axios.create({
  baseURL: 'https://bjapi.afreecatv.com/api',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
});

export async function fetchAfStreamerInfo(channelId: string): Promise<any> {
  try {
    const response = await afApiClient.get(`/${channelId}/station`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AfreecaTV streamer info:', error);
    return null;
  }
}
