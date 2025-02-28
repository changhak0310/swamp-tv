import { swampData } from '@/constants/swampData';
import { Streamer } from '@/types/streamers';

export function transformChzStreamerData(data: any, name: string, channelId: string): Streamer {
  // swampData에서 channelId가 같은 항목을 찾음
  const local = swampData.find(s => s.channelId === channelId);

  const streamer: Streamer = {
    name,
    platform: 'chz',
    channelId,
    channelName: data.channelName || name,
    channelImageUrl: data.channelImageUrl || '/default-avatar.png',
    openLive: data.openLive || false,
    live: null,
    liveurl: local?.liveUrl || "",
  };
  return streamer;
}

export function transformChzLiveDetailData(streamer: Streamer, liveData: any): Streamer {
  if (liveData) {
    streamer.live = {
      liveTitle: liveData.liveTitle || '',
      liveImageUrl: liveData.liveImageUrl || '',
      concurrentUserCount: liveData.concurrentUserCount || 0,
      liveCategoryValue: liveData.liveCategoryValue || '',
      adult: liveData.adult || false,
      liveNo: liveData.liveId
    };
  }
  return streamer;
}

export function transformAfStreamerData(data: any, name: string, channelId: string): Streamer {
  const profileImage = data.profile_image ? 'https:' + data.profile_image : '/default-avatar.png';
  const userNick = data.station.user_nick || channelId;
  const broad = data.broad || null;

    // swampData에서 channelId가 같은 항목을 찾음
    const local = swampData.find(s => s.channelId === channelId);


  const streamer: Streamer = {
    name,
    platform: 'af',
    channelId,
    channelName: userNick,
    channelImageUrl: profileImage,
    openLive: false,
    live: null,
    liveurl: local?.liveUrl || "",
  };

  if (broad) {
    streamer.openLive = true;
    streamer.live = {
      liveTitle: broad.broad_title || '',
      liveImageUrl: `https://liveimg.afreecatv.com/h/${broad.broad_no}`,
      concurrentUserCount: broad.current_sum_viewer || 0,
      liveCategoryValue: '', // AfreecaTV may not provide category info
      adult: broad.broad_grade >= 19 ? true : false,
      liveNo: broad.broad_no
    };
  }

  return streamer;
}
