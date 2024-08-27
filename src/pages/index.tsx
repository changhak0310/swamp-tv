import React from 'react';

const Home = () => {
  const naverLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const redirectUri = encodeURI(process.env.NEXT_PUBLIC_NAVER_CALLBACK_URL!);
    const state = Math.random().toString(36).substring(2);

    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    window.location.href = naverLoginUrl;
  };

  return (
    <div>
      <h1>Naver Login</h1>
      <a href="/api/auth/login">Login with Naver11111111</a>
      <button onClick={naverLogin}>Login with Naver</button>
    </div>
  );
};

export default Home;