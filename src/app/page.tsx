"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useStreamers } from "@/hooks/useStreamers";
import { swampData } from "@/constants/swampData";
import { FeaturedLive, PopularStreams, StreamerThumbnails } from "@/components";

export default function Home() {
  const { streamers, loading } = useStreamers();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 라이브 먼저 정렬
  const sortedStreamers = useMemo(() => {
    return [...streamers].sort((a, b) => {
      const aLive = a.openLive && a.live;
      const bLive = b.openLive && b.live;
      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;
      return 0;
    });
  }, [streamers]);

  // 라이브 스트리머만 추출
  const liveStreamers = useMemo(
    () => sortedStreamers.filter((s) => s.openLive && s.live),
    [sortedStreamers]
  );

  useEffect(() => {
    if (currentIndex >= liveStreamers.length && liveStreamers.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, liveStreamers]);

  // ▶ 로딩 스켈레톤 (기존 코드 그대로)
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Swamp Streamers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, index) => (
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
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Swamp Streamers</h1>

      <main className="flex-1 p-6">
        {/* ============== A) FeaturedLive ============== */}
        <section className="mb-8">
          <FeaturedLive
            liveStreamers={liveStreamers}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </section>

        {/* ============== B) Streamer Thumbnails ============== */}
        <section className="mb-8">
          <StreamerThumbnails
            sortedStreamers={sortedStreamers}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </section>

        {/* (C) Popular Streams */}
        <h2 className="text-text-100 text-2xl mb-4">Popular Streams</h2>
        <PopularStreams streamers={streamers} />
      </main>
    </div>
  );
}
