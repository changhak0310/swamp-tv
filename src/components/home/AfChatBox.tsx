"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAfChat } from "@/hooks/useAfCaht";

interface AfChatBoxProps {
  bno: string;
  bid: string;
}

/**
 * 문자열을 해시하고 (hash % 360)을 Hue로 사용하여 항상 동일한 HSL 색을 반환
 * @param str 문자열
 * @param s 채도(saturation), 기본값 70
 * @param l 명도(lightness), 기본값 50
 */
export function stringToHslColor(str: string, s = 70, l = 50): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Hue (0 ~ 359) 범위로 맞추기
  const h = hash % 360;

  return `hsl(${h}, ${s}%, ${l}%)`;
}

export const AfChatBox: React.FC<AfChatBoxProps> = ({ bno, bid }) => {
  const { messages, isLoading, isError } = useAfChat(bno, bid);

  const containerRef = useRef<HTMLDivElement | null>(null); // 스크롤 컨테이너 ref
  const [autoScroll, setAutoScroll] = useState(true); // 자동 스크롤 여부
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(false); // "맨 아래로" 버튼 노출 제어

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 5;
    // 스크롤이 맨 아래로부터 5px 이하인지 여부

    if (isAtBottom) {
      // 이미 맨 아래라면, autoScroll 상태를 true로 전환하고 버튼 숨기기
      setAutoScroll(true);
      setShowScrollDownBtn(false);
    } else {
      // 사용자가 올라갔으니 autoScroll을 false로 두고, 버튼 노출
      setAutoScroll(false);
      setShowScrollDownBtn(true);
    }
  };

  // "맨 아래로" 이동 버튼을 누르면 실행
  const scrollToBottom = () => {
    if (!containerRef.current) return;

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
    setAutoScroll(true);
    setShowScrollDownBtn(false);
  };

  // 메시지가 업데이트될 때마다 동작
  useEffect(() => {
    if (!containerRef.current) return;
    // autoScroll이 true일 때만 맨 아래로 이동
    if (autoScroll) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-100 border rounded-lg flex items-center justify-center">
        <p className="text-gray-500 text-sm">채팅을 불러오는 중입니다...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full bg-gray-100 border rounded-lg flex items-center justify-center">
        <p className="text-red-500 text-sm">채팅 연결에 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* 스크롤 컨테이너 */}
      <div
        ref={containerRef}
        className="w-full h-full bg-gray-100 border rounded-r-sm p-4 overflow-y-auto"
        onScroll={handleScroll}
      >
        {messages.map((msg, idx) => {
          const color = stringToHslColor(msg.userNickname);
          return (
            <div key={idx} className="mb-1 px-2 bg-white rounded shadow-sm">
              <span className="font-semibold text-sm pr-2" style={{ color }}>
                {msg.userNickname}
              </span>
              <span className="text-gray-700">{msg.comment}</span>
            </div>
          );
        })}
        {/* "맨 아래로" 버튼 (사용자가 스크롤을 올렸을 때만 표시) */}
        {showScrollDownBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute right-1/2 bottom-4 text-white px-3 py-1 rounded bg-black bg-opacity-50"
          >
            맨 아래로
          </button>
        )}
      </div>
    </div>
  );
};
