"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useStreamers } from "@/hooks/useStreamers";
import { FeaturedLive, PopularStreams, StreamerThumbnails } from "@/components";
// shadcn/ui 컴포넌트 (미리 생성해둔 컴포넌트로 가정)
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { streamers, loading } = useStreamers();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 라이브 스트리머 우선 정렬
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

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Swamp Streamers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <Card
              key={index}
              className="p-4 flex space-x-4 animate-pulse"
            >
              <Skeleton className="rounded-full h-20 w-20 bg-muted" />
              <div className="flex-1 space-y-4 py-1">
                <Skeleton className="h-4 rounded w-3/4 bg-muted" />
                <Skeleton className="h-4 rounded w-1/2 bg-muted" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Swamp Streamers</h1>
      <main className="flex-1 p-6">
        {/* A) Featured Live 섹션 */}
        <section className="mb-8">
          <FeaturedLive
            liveStreamers={liveStreamers}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </section>

        {/* B) Streamer Thumbnails 섹션 */}
        <section className="mb-8">
          <StreamerThumbnails
            sortedStreamers={sortedStreamers}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </section>

        {/* C) Popular Streams 섹션 */}
        <h2 className="text-2xl text-muted-foreground mb-4">
          Popular Streams
        </h2>
        <PopularStreams streamers={streamers} />
      </main>
    </div>
  );
}
