import React from "react";
import { Streamer } from "@/types/streamers";
import { AfChatBox } from "./AfChatBox";

interface FeaturedLiveProps {
  liveStreamers: Streamer[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function FeaturedLive({
  liveStreamers,
  currentIndex,
  setCurrentIndex
}: FeaturedLiveProps) {
  if (liveStreamers.length === 0) {
    return (
      <div className="relative bg-bg-300 rounded-lg overflow-hidden">
        <img src="" alt="No live" className="w-full h-64 object-cover" />
        <div className="absolute bottom-4 left-4 text-text-100">
          <h3 className="text-xl font-bold">No Featured Stream</h3>
          <p className="text-sm">No one is live right now.</p>
        </div>
      </div>
    );
  }

  const featured = liveStreamers[currentIndex];

  if (!featured.live) {
    return <div>No live detail</div>;
  }

  // 방송 정보
  const {
    channelName,
    liveurl,
    platform,
    channelId,
    live: {
      liveTitle,
      liveImageUrl,
      concurrentUserCount,
      liveCategoryValue,
      adult,
      liveNo, // 방송 번호 (아프리카 채팅용)
    },
  } = featured;

  // 이미지 치환: 항상 720p로 설정
  let thumbnail: string;
  if (liveImageUrl.includes("{type}")) {
    const rawUrl = liveImageUrl.replace("{type}", "720");
    thumbnail = adult ? "/adult.png" : rawUrl;
  } else {
    // '{type}'이 없는 경우 원본 이미지 사용
    thumbnail = adult ? "/adult.png" : liveImageUrl;
  }

  // 새 탭으로 열기
  const handleOpenLive = (url: string) => {
    console.log(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // 좌우 버튼 클릭 시, 인덱스 이동 (양끝에서 wrap-around)
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + liveStreamers.length) % liveStreamers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % liveStreamers.length);
  };

  return (
    <div className="relative bg-bg-200 overflow-hidden flex">
      {/* 이미지를 클릭하면 새 탭으로 이동 */}
      <div className="relative w-full h-96">
        <img
          src={thumbnail}
          alt={liveTitle}
          className="w-2/3 h-full object-cover cursor-pointer"
          onClick={() => handleOpenLive(liveurl)}
        />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      <div className="absolute bottom-4 left-4 text-text-100">
        <h3 className="text-xl font-bold">{channelName}</h3>
        <p className="text-sm">{liveTitle}</p>
        <p className="text-sm">💥 {concurrentUserCount.toLocaleString()} viewers</p>
        <p className="text-sm">{liveCategoryValue}</p>
      </div>

      {/* 플랫폼별로 채팅 표시 */}
      {platform === "af" ? (
        // 아프리카TV → 직접 만든 WebSocket Chat
        // liveNo 가 있다면 그 값을 AfChatPage에 넘겨줄 수 있음
        <div className="absolute right-0 w-1/3 h-full">
          {liveNo ? (
            <AfChatBox bid={channelId} bno={liveNo} />
          ) : (
            <p className="text-red-500">No broadcast number</p>
          )}
        </div>
      ) : (
        // 치지직(등등) → iframe
        <iframe
          src={`https://chzzk.naver.com/live/${channelId}/chat`}
          className="absolute top-[-80px] right-0 w-1/3 h-[565px] border-none"
        />
        
      )}

      {/* 좌우 버튼 */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded"
        aria-label="Previous Stream"
      >
        ◀
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded"
        aria-label="Next Stream"
      >
        ▶
      </button>
    </div>
  );
}
