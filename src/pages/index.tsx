import React, { useEffect, useState } from 'react';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user-info');
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.log('Not authenticated');
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <div>
      <h1>Naver Login</h1>
      {!userInfo ? (
        <a href="/api/auth/login">Login with Naver</a>
      ) : (
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
      )}
    </div>
  );
};

export default Home;