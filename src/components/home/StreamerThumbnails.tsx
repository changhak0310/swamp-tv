import React from "react";
import { Streamer } from "@/types/streamers";
import { swampData } from "@/constants/swampData";

interface StreamerThumbnailsProps {
  sortedStreamers: Streamer[];
  currentIndex: number;                   // 어떤 스트리머가 선택되었는지
  setCurrentIndex: (index: number) => void;
}

export function StreamerThumbnails({
  sortedStreamers,
  currentIndex,
  setCurrentIndex,
}: StreamerThumbnailsProps) {
  return (
    <div className="flex gap-4 overflow-x-auto justify-around">
      {sortedStreamers.map((streamer, i) => {
        const isLive = streamer.openLive && streamer.live;
        const matchedSwamp = swampData.find(
          (s) => s.channelId === streamer.channelId
        );
        const mcImage = matchedSwamp?.img?.mc ?? "/default.png";

        // 지금 반복 중인 i === currentIndex 면 회색 박스
        const isSelected = i === currentIndex; 

        return (
          <div
            key={streamer.channelId}
            // isSelected면 회색 배경
            className={`
              min-w-[80px] flex flex-col items-center flex-shrink-0 p-2 rounded-md
              ${isSelected ? "bg-accent-200" : ""}
            `}
            // 클릭하면 해당 인덱스로 변경
            onClick={isLive ? () => setCurrentIndex(i) : () => {}}
            style={isLive ? { cursor: "pointer" } : {}}
          >
            <img
              src={mcImage}
              alt={streamer.name}
              className={`w-16 h-16 rounded-full object-cover
                ${
                  isLive
                    ? "border-[3px] border-red-500"
                    : "grayscale"
                }
              `}
            />
          </div>
        );
      })}
    </div>
  );
}
