import { useState, useEffect, useRef } from "react";

const F = "\x0c";
const ESC = "\x1b\t";

interface ChatMessage {
  userId: string;
  userNickname: string;
  comment: string;
}

export function useAfChat(bno: string, bid: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const decodeMessage = (data: Uint8Array): ChatMessage | null => {
    try {
      const text = new TextDecoder("utf-8").decode(data);
      const parts = text.split(F);

      if (
        parts.length > 6 &&
        parts[1] !== "-1" &&
        parts[1] !== "1" &&
        !parts[1].includes("|") &&
        parts.length === 13
      ) {
        return {
          userId: parts[2],
          userNickname: parts[6],
          comment: parts[1],
        };
      }
      return null;
    } catch (error) {
      console.error("decodeMessage Error:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!bno || !bid) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const connectWebSocket = async () => {
      try {
        const res = await fetch("/api/afreeca", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bno, bid }),
        });
        const data = await res.json();

        if (data.error) {
          console.error("API Error:", data.error);
          setIsError(true);
          setIsLoading(false);
          return;
        }

        const { CHDOMAIN, CHATNO, CHPT } = data;
        const wsUrl = `wss://${CHDOMAIN}:${CHPT}/Websocket/${bid}`;
        const socket = new WebSocket(wsUrl, ["chat"]);
        wsRef.current = socket;

        socket.binaryType = "arraybuffer";

        socket.onopen = () => {
          console.log("WebSocket connected");
          setIsLoading(false);

          const CONNECT_PACKET = ESC + "000100000600" + F.repeat(3) + "16" + F;
          socket.send(CONNECT_PACKET);

          setTimeout(() => {
            const size = new TextEncoder().encode(CHATNO).length + 6;
            const JOIN_PACKET =
              ESC +
              "0002" +
              String(size).padStart(6, "0") +
              "00" +
              F +
              CHATNO +
              F.repeat(5);
            socket.send(JOIN_PACKET);
          }, 2000);

          const PING_PACKET = ESC + "000000000100" + F;
          const interval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(PING_PACKET);
            }
          }, 60000);

          socket.onclose = () => clearInterval(interval);
        };

        socket.onmessage = (event) => {
          let data: Uint8Array;
          if (event.data instanceof ArrayBuffer) {
            data = new Uint8Array(event.data);
          } else if (typeof event.data === "string") {
            data = new TextEncoder().encode(event.data);
          } else {
            console.warn("Unknown data type:", event.data);
            return;
          }

          const decodedMessage = decodeMessage(data);
          if (decodedMessage) {
            setMessages((prev) => [...prev, decodedMessage]);
          }
        };

        socket.onerror = (err) => {
          console.error("WebSocket Error:", err);
          setIsError(true);
        };
      } catch (error) {
        console.error("Connection Error:", error);
        setIsError(true);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [bno, bid]);

  return { messages, isLoading, isError };
}
