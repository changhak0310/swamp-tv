import React from 'react';
import { useStreamers } from '../hooks/useStreamers';
import { LiveDetailCard } from '@/components';

export default function Home() {
  const { streamers, loading } = useStreamers();

  return (
    <div className="container mx-auto p-4">
      <a href='/test'>test</a>
      <h1 className="text-3xl font-bold mb-4">Swamp Streamers</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Skeleton UI */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse rounded-lg p-4 flex space-x-4"
            >
              <div className="rounded-full bg-gray-300 h-20 w-20"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {streamers.map((streamer) => (
            <div
              key={streamer.channelId}
              className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
            >
              <img
                src={streamer.channelImageUrl}
                alt={streamer.channelName}
                width={80}
                height={80}
                className={`rounded-full ${
                  streamer.openLive ? '' : 'grayscale'
                }`}
              />
              <div>
                <h2 className="text-xl font-bold">{streamer.channelName}</h2>
                {streamer.openLive && streamer.live ? (
                  <LiveDetailCard
                    
                    liveTitle={streamer.live.liveTitle}
                    liveImageUrl={streamer.live.liveImageUrl}
                    concurrentUserCount={streamer.live.concurrentUserCount}
                    liveCategoryValue={streamer.live.liveCategoryValue}
                  />
                ) : (
                  <p className="text-sm text-gray-500">Offline</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
