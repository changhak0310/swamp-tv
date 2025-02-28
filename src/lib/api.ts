// lib/api.ts
export const ApiUrl = {
    chzzk: 'https://api.chzzk.naver.com',
    chzzkService: 'https://api.chzzk.naver.com/service',
    naverGame: 'https://comm-api.game.naver.com/nng_main',
    naverLogin:
      'https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fchzzk.naver.com%2F&locale=ko_KR&svctype=1&disposable=',
  
    userStatus: '/v1/user/getUserStatus',
    privateUserBlocks: '/v1/privateUserBlocks/allUserIdHash',
    channel: (channelId: string) => `/v1/channels/${channelId}`,
    followings: '/v1/channels/followings',
    followingLives: '/v1/channels/following-lives',
    allLives: '/service/v1/lives',
    liveDetail: (channelId: string) => `/service/v3/channels/${channelId}/live-detail`,
    liveStatus: (channelId: string) => `/polling/v3/channels/${channelId}/live-status`,
    vod: (videoNo: string) => `/v3/videos/${videoNo}`,
    channelVods: (channelId: string) => `/v1/channels/${channelId}/videos`,
    followingVods: '/v1/my-content',
    popularVods: '/v1/home/popular-videos',
    vodPlayback: (videoId: string, inKey: string) =>
      `https://apis.naver.com/neonplayer/vodplay/v1/playback/${videoId}?key=${inKey}`,
    category: '/v1/categories',
    followingCategories: '/v1/categories/following',
    categoryLives: (categoryId: string) => `/v2/categories/${categoryId}/lives`,
    searchChannels: '/v1/search/channels',
    accessToken: (channelId: string, chatType = 'STREAMING') =>
      `/v1/chats/access-token?channelId=${channelId}&chatType=${chatType}`,
    chatServer: (serverNo: number) => `wss://kr-ss${serverNo}.chat.naver.com/chat`,
    channelClips: (channelId: string) => `/v1/channels/${channelId}/clips`,
    categoryClips: (categoryId: string) => `/v1/categories/${categoryId}/clips`,
    popularClips: '/v1/home/recommended/clips',
    naverClipEmbed: (clipUID: string) => `https://chzzk.naver.com/embed/clip/${clipUID}`,
    githubLatestRelease:
      'https://api.github.com/repos/Escaper-Park/unofficial_chzzk_android_tv/releases/latest',
  };
  