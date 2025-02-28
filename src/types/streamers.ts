export interface LiveDetail {
    liveTitle: string;
    liveImageUrl: string;
    concurrentUserCount: number;
    liveCategoryValue: string;
    adult: boolean;
    liveNo: string;
  }
  
  export interface Streamer {
    name: string;
    platform: string;
    channelId: string;
    channelName: string;
    channelImageUrl: string;
    openLive: boolean;
    live: LiveDetail | null;
    liveurl: string; 
    img?: {
      mc?: string;
    };
  }