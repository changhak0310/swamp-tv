import React from 'react';

interface LiveDetailProps {
  liveTitle: string;
  liveImageUrl: string;
  concurrentUserCount: number;
  liveCategoryValue: string;
}

export const LiveDetailCard: React.FC<LiveDetailProps> = ({
  liveTitle,
  liveImageUrl,
  concurrentUserCount,
  liveCategoryValue,
}) => {
    const imageUrl = liveImageUrl.replace('{type}', '480');

  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-gray-900 text-white">
      <div className="relative">
        <img
          src={imageUrl}
          alt={liveTitle}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 bg-red-600 text-xs font-bold px-2 py-1 rounded">
          생방송
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-sm font-bold px-2 py-1 rounded">
          시청자 {concurrentUserCount}명
        </div>
      </div>
      
      <div className="px-4 py-2">
        <div className="font-bold text-lg mb-2">{liveTitle}</div>
        <p className="text-sm text-gray-400">{liveCategoryValue}</p>
      </div>
    </div>
  );
};