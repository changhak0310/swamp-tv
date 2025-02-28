import { NextRequest, NextResponse } from "next/server";

interface AfreecaApiResponse {
  CHANNEL: {
    CHDOMAIN: string;
    CHATNO: string;
    FTK: string;
    TITLE: string;
    BJID: string;
    CHPT: string;
  };
}

/**
 * Afreeca API: https://live.afreecatv.com/afreeca/player_live_api.php
 * - bno, bid를 받아서 Afreeca 채팅 서버 정보를 조회
 */
export async function POST(req: NextRequest) {
  try {
    const { bno, bid } = await req.json();
    if (!bno || !bid) {
      return NextResponse.json(
        { error: "bno, bid가 필요합니다." },
        { status: 400 }
      );
    }

    const url = `https://live.afreecatv.com/afreeca/player_live_api.php?bjid=${bid}`;
    const formData = new URLSearchParams();
    formData.append("bid", bid);
    formData.append("bno", bno);
    formData.append("type", "live");
    formData.append("confirm_adult", "false");
    formData.append("player_type", "html5");
    formData.append("mode", "landing");
    formData.append("from_api", "0");
    formData.append("pwd", "");
    formData.append("stream_type", "common");
    formData.append("quality", "HD");

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Afreeca API 호출 실패." },
        { status: response.status }
      );
    }

    const data = (await response.json()) as AfreecaApiResponse;

    const { CHDOMAIN, CHATNO, FTK, TITLE, BJID, CHPT } = data.CHANNEL;
    // CHPT에 +1 (원본 코드처럼)
    const chptNumber = (parseInt(CHPT) + 1).toString();

    return NextResponse.json({
      CHDOMAIN: CHDOMAIN.toLowerCase(),
      CHATNO,
      FTK,
      TITLE,
      BJID,
      CHPT: chptNumber,
    });
  } catch (error) {
    console.error("API Error", error);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}
