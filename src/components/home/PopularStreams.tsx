import React from "react";
import { Streamer } from "@/types/streamers";
import { LiveDetailCard } from "@/components";

interface PopularStreamsProps {
  streamers: Streamer[];
}

export function PopularStreams({ streamers }: PopularStreamsProps) {
  // isLive가 true인 스트리머와 false인 스트리머를 분리
  const liveStreamers = streamers.filter(streamer => streamer.openLive && streamer.live);
  const offlineStreamers = streamers.filter(streamer => !streamer.openLive || !streamer.live);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* isLive가 true인 스트리머 먼저 보여주기 */}
      {liveStreamers.map((streamer) => (
        <div
          key={streamer.channelId}
          className="rounded-lg shadow p-4 flex flex-col items-center space-y-4 text-text-100 min-w-[64] max-w-[60]"
        >
          {streamer.live && (
            <LiveDetailCard
              channelImageUrl={streamer.channelImageUrl}
              channelName={streamer.channelName}
              liveTitle={streamer.live.liveTitle}
              liveImageUrl={streamer.live.liveImageUrl}
              concurrentUserCount={streamer.live.concurrentUserCount}
              liveCategoryValue={streamer.live.liveCategoryValue}
              adult={streamer.live.adult}
              liveurl={streamer.liveurl}
            />
          )}
        </div>
      ))}
      {/* isLive가 false인 스트리머 그 다음에 보여주기 */}
      {offlineStreamers.map((streamer) => (
        <div
          key={streamer.channelId}
          className="rounded-lg shadow p-4 flex flex-col items-center space-y-4 text-text-100 min-w-64 max-w-60"
        >
          <div className="flex flex-col items-center">
            <img
              src={streamer.channelImageUrl}
              alt={streamer.channelName}
              className="rounded-full w-20 h-20 object-cover grayscale"
            />
            <p className="text-sm text-gray-500">Offline</p>
          </div>
        </div>
      ))}
    </div>
  );
}
