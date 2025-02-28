"use client";

import { AfChatBox } from "@/components";
import React, { useState, useEffect, useRef } from "react";

const F = "\x0c";    // Python 코드에서 사용하던 것
const ESC = "\x1b\t";
const SEPARATOR = "+" + "-".repeat(70) + "+";

/**
 * Afreeca 서버에서 내려오는 데이터를 디코딩하는 로직
 * (Python의 decode_message 참고)
 */
function decodeMessage(data: Uint8Array) {
  try {
    // 수신된 데이터를 문자열로 변환
    // (텍스트로 넘어오면 그냥 string으로 받을 수도 있지만, Binary/Buffer 형식이라 가정)
    const text = new TextDecoder("utf-8").decode(data);

    // '\x0c' 로 split
    const parts = text.split(F);
    // parts[0] => ESC + "0002{...}" 이런 식의 메타정보
    // parts[1] => 실제 채팅인지, 제어코드인지 등등
    // ...
    // Python 코드는 대략 인덱스 2, 1, 6 등을 참고하고 있음

    // 간단 디버깅
    // console.log("Raw parts:", parts);

    /**
     * 주의: Afreeca 서버에서 메시지가 다양한 형태로 내려올 수 있으므로,
     * 실제 상황에 맞게 조건문을 잘 설계해야 합니다.
     * 여기서는 Python 코드에서 "if len(messages) > 5 and ..." 조건 참고
     */
    if (
      parts.length > 6 &&
      parts[1] !== "-1" &&
      parts[1] !== "1" &&
      !parts[1].includes("|")
    ) {
      const userId = parts[2];
      const comment = parts[1];
      const userNickname = parts[6];
      return {
        userId,
        userNickname,
        comment,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("decodeMessage Error:", error);
    return null;
  }
}

/**
 * 바이트 크기 계산 (Python의 calculate_byte_size 대체)
 */
function calculateByteSize(str: string) {
  // utf-8 인코딩 후 + 6
  // Python: len(string.encode('utf-8')) + 6
  return new TextEncoder().encode(str).length + 6;
}

export default function ChatPage() {
  const [bno, setBno] = useState("");
  const [bid, setBid] = useState("");
  const [messages, setMessages] = useState<
    { userId: string; userNickname: string; comment: string }[]
  >([]);
  const wsRef = useRef<WebSocket | null>(null);

  const handleConnect = async () => {
    try {
      // 1) api/afreeca 라우트에 POST해서 채팅에 필요한 정보 가져오기
      const res = await fetch("/api/afreeca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bno, bid }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      const { CHDOMAIN, CHATNO, FTK, TITLE, BJID, CHPT } = data;
      console.log(SEPARATOR);
      console.log(`CHDOMAIN: ${CHDOMAIN}  CHATNO: ${CHATNO}  FTK: ${FTK}`);
      console.log(`TITLE: ${TITLE}  BJID: ${BJID}  CHPT: ${CHPT}`);
      console.log(SEPARATOR);

      // 2) WebSocket 연결
      const wsUrl = `wss://${CHDOMAIN}:${CHPT}/Websocket/${bid}`;
      const socket = new WebSocket(wsUrl, ["chat"]);
      wsRef.current = socket;

      socket.binaryType = "arraybuffer"; // 혹은 "blob" 등 필요에 맞게

      // 연결 시도
      socket.onopen = () => {
        console.log("WebSocket 연결 성공");

        // 연결 후 Python 코드처럼 패킷 전송
        // 2-1) CONNECT_PACKET
        const CONNECT_PACKET = ESC + "000100000600" + F.repeat(3) + "16" + F;
        socket.send(CONNECT_PACKET);

        // 2-2) 2초 후 JOIN_PACKET 전송
        setTimeout(() => {
          const size = calculateByteSize(CHATNO);
          const JOIN_PACKET =
            ESC + "0002" + String(size).padStart(6, "0") + "00" + F + CHATNO + F.repeat(5);
          socket.send(JOIN_PACKET);
        }, 2000);

        // 2-3) 주기적으로 PING_PACKET 전송
        //     (아래 setInterval 예시는 60초 마다 전송)
        const PING_PACKET = ESC + "000000000100" + F;
        setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(PING_PACKET);
          }
        }, 60_000);
      };

      // 메시지 수신
      socket.onmessage = (event) => {
        let data: Uint8Array;
        if (event.data instanceof ArrayBuffer) {
          data = new Uint8Array(event.data);
        } else if (typeof event.data === "string") {
          // 단순 텍스트라면, Uint8Array 변환
          data = new TextEncoder().encode(event.data);
        } else {
          console.warn("Unknown data type:", event.data);
          return;
        }

        const decoded = decodeMessage(data);
        if (decoded) {
          setMessages((prev) => [...prev, decoded]);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket Error:", err);
      };

      socket.onclose = () => {
        console.log("WebSocket Closed");
      };
    } catch (error) {
      console.error(error);
      alert("오류가 발생하였습니다.");
    }
  };

  // 페이지 떠날 때 WebSocket 닫기
  useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <AfChatBox bid={'jdm1197'} bno={'280240546'} />
      <h1 className="text-2xl font-bold">Afreeca 채팅 테스트</h1>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="BNO를 입력하세요"
          className="border rounded p-2"
          value={bno}
          onChange={(e) => setBno(e.target.value)}
        />
        <input
          type="text"
          placeholder="BID를 입력하세요"
          className="border rounded p-2"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
        />
        <button
          onClick={handleConnect}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          채팅 서버 연결
        </button>
      </div>

      <hr className="my-4" />

      {/* 채팅 메시지 리스트 */}
      <div className="space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="border rounded p-2 bg-white shadow-sm text-sm"
          >
            <p className="font-semibold">
              {msg.userNickname} [{msg.userId}]
            </p>
            <p className="text-gray-700">{msg.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
