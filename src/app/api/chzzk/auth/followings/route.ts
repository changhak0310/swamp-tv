// app/api/chzzk/followings/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  // next/headers의 cookies() API로 쿠키 스토어에서 'token' 값을 가져옵니다.
  const token = cookies().get("accessToken")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Not logged in: No token available" },
      { status: 401 }
    );
  }

  try {
    const url =
      "https://comm-api.game.naver.com/nng_main/v1/user/getUserStatus";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        // 요청 헤더 (제공해주신 값 그대로)
        
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Followings API error: ${response.status} - ${errorText}`
      );
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Followings fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
