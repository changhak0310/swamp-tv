// app/test3/page.tsx
"use client";

import { useEffect, useState } from "react";

interface UserInfo {
  channelId: string;
  channelName: string;
  nickname: string;
}

export default function Test3Page() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [followings, setFollowings] = useState<any>(null);
  const [loadingFollowings, setLoadingFollowings] = useState<boolean>(false);

  // 사용자 정보 fetch 함수
  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chzzk/auth/user", { method: "GET" });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      const data = await res.json();
      setUserInfo(data.content);
    } catch (err: any) {
      console.error("User info fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const clientId =
      process.env.NEXT_PUBLIC_CHZZK_CLIENT_ID ||
      "7897fbca-e68e-4024-8b8e-a138b242a9d5";
    // 환경 변수에서 등록한 리다이렉트 URI 사용 (예: http://localhost:3000/api/chzzk/auth/callback)
    const redirectUri = encodeURIComponent(
      process.env.NEXT_PUBLIC_CHZZK_REDIRECT_URI ||
        "http://localhost:3000/api/chzzk/auth/callback"
    );
    const state = "randomState123"; // 실제 배포 시에는 보안을 위해 랜덤하게 생성 후 session 등에 저장할 것

    // 치지직 인증 URL : 문서에 따라 account-interlock 엔드포인트를 사용함
    const loginUrl = `https://chzzk.naver.com/account-interlock?clientId=${clientId}&redirectUri=${redirectUri}&state=${state}`;
    window.location.href = loginUrl;
  };

  const fetchFollowings = async () => {
    try {
      setLoadingFollowings(true);
      const res = await fetch("/api/chzzk/auth/followings");
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      const data = await res.json();
      setFollowings(data);
    } catch (err: any) {
      console.error("Followings fetch error:", err);
      setError(err.message);
    } finally {
      setLoadingFollowings(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>/test3 페이지</h1>
      {loading && <p>사용자 정보 로딩 중...</p>}
      {error && <p style={{ color: "red" }}>에러: {error}</p>}
      {userInfo ? (
        <div>
          <h2>로그인된 사용자 정보</h2>
          <p>채널 ID: {userInfo.channelId}</p>
          <p>채널 이름: {userInfo.nickname}</p>
          {/* 추가적인 정보를 표시할 수 있습니다. */}

          <div>
            <button onClick={fetchFollowings} disabled={loadingFollowings}>
              팔로잉 목록 가져오기 테스트
            </button>
            {loadingFollowings && <p>팔로잉 목록 로딩 중...</p>}
            {followings && (
              <div>
                <h2>팔로잉 목록</h2>
                <pre>{JSON.stringify(followings, null, 2)}</pre>
              </div>
            )}
          </div>

        </div>
      ) : (
        !loading && (
          <div>
            <p>로그인이 되어 있지 않습니다.</p>
            <button
              onClick={handleLogin}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "4px",
                backgroundColor: "#3f5b62",
                color: "#fff",
                border: "none",
              }}
            >
              네이버(치지직)으로 로그인하기
            </button>
          </div>
        )
      )}
    </div>
  );
}
