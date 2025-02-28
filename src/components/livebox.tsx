import React from 'react';

interface LiveDetailProps {
  channelImageUrl:string;
  channelName: string;
  liveTitle: string;
  liveImageUrl: string;
  concurrentUserCount: number;
  liveCategoryValue: string;
  adult: boolean;
  liveurl: string;
}

export const LiveDetailCard: React.FC<LiveDetailProps> = ({
  channelImageUrl,
  channelName,
  liveTitle,
  liveImageUrl,
  concurrentUserCount,
  liveCategoryValue,
  adult,
  liveurl
}) => {
    const imageUrl = liveImageUrl.replace('{type}', '480');
    const handleOpenLive = (url: string) => {
      window.open(url, "_blank", "noopener,noreferrer");
    };

  return (
    <div onClick={() => handleOpenLive(liveurl)} className="overflow-hidden cursor-pointer min-w-72 max-w-88">
      <div className="relative">
        <img
          src={(adult ? "/adult.png" : imageUrl)}
          alt={liveTitle}
          width={400}
          height={200}
          className="w-full h-48 object-contain"
        />
        <div className="absolute top-4 right-2 bg-red-600 text-xs font-bold px-2 py-1 rounded-sm">
          Live
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-sm font-bold px-2 py-1 rounded-sm">
          시청자 {concurrentUserCount.toLocaleString()}명
        </div>
      </div>
      <div className='flex items-center'>
        <img
          src={channelImageUrl}
          alt={channelName}
          width={40}
          height={40}
          className="rounded-full h-11 w-11"
        />
        <div className="px-4 py-2">
          <h3 className="text-lg font-bold line-clamp-2">{channelName}</h3>
          <p className="text-sm line-clamp-2">{liveTitle}</p>
          <p className="text-sm text-text-200 line-clamp-1">{liveCategoryValue}</p>
        </div>
      </div>
    </div>
  );
};