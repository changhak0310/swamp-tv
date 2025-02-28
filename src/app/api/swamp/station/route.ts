/*
  - 치지직 -
  스트리머 정보 : https://api.chzzk.naver.com/service/v1/channels/-
  실시간 방송 정보 : https://api.chzzk.naver.com/polling/v3/channels/-/live-status
  실시간 방송 디테일 : https://api.chzzk.naver.com/service/v2/channels/-/live-detail

  - 아프리카 -
  스트리머 정보 : https://bjapi.afreecatv.com/api/-/station
  스트리머 홈 정보 : https://bjapi.afreecatv.com/api/-/home
*/

import { NextResponse } from 'next/server';
import { swampData } from '@/constants/swampData';
import { fetchChzStreamerInfo, fetchChzLiveDetail } from '@/services/chz/chzService';
import { fetchAfStreamerInfo } from '@/services/af/afService';
import {
  transformChzStreamerData,
  transformChzLiveDetailData,
  transformAfStreamerData,
} from '@/utils/streamerUtils';
import { Streamer } from '@/types/streamers';

export async function GET() {
  const streamerDataPromises = swampData.map(async (streamer) => {
    const { name, platform, channelId } = streamer;

    if (platform === 'chz' && channelId) {
      const data = await fetchChzStreamerInfo(channelId);
      if (!data) return null;

      let streamerInfo = transformChzStreamerData(data, name, channelId);

      if (streamerInfo.openLive) {
        const liveDetailData = await fetchChzLiveDetail(channelId);
        streamerInfo = transformChzLiveDetailData(streamerInfo, liveDetailData);
      }

      return streamerInfo;
    } else if (platform === 'af' && channelId) {
      const data = await fetchAfStreamerInfo(channelId);
      if (!data) return null;

      const streamerInfo = transformAfStreamerData(data, name, channelId);

      return streamerInfo;
    } else {
      // Handle other platforms or return null
      return null;
    }
  });

  const streamerData = await Promise.all(streamerDataPromises);
  const validData = streamerData.filter((data): data is Streamer => data !== null);

  return NextResponse.json(validData);
}