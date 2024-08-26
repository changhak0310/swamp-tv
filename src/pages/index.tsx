import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState<null | string>(null);

  const fetchUserInfo = async () => {
    try {
      // NID_AUT와 NID_SES 쿠키 값을 가져옵니다.
      const nidAuth = "B3wuwsYsEUaVmo6qAaPyoVjtkmMlwkufZcwf4GsuVnQ9ooAd7w/u9cEUgn//0u9v"; // 실제 쿠키 값으로 대체하세요.
      const nidSession = "AAABhiKO+4G+CPf22/eru0uW0WyhQ1KOJPWkx/yhSF9k9w9b62FIusJGNYhQLjAgVcqh77HWDieQdxsKtnlEBk6rBIbmUAS8C+2XX+bZ4qei34G+2jmNdXX6eLwH7VooyymPI0z1dGvI92lzDQwp7oqFpLUWu+IKPNFp4vlzjRoT4ZGOE27EuGPqrKpfZhvI59Q3KtChhZfFMmhh2k2aP48MUv2fHB8I9n/qFu3A8kGjHwwThX+2TXHiYsykGKumoe5GJ1aX5Sz3UexC9eyh6azTWnB51jPYEC4Mdc55vpTl/fdx/cGFI1h/xZidFbykScI/agSHbKIeYNTlgatMhlHQk/heXbiBhhKI3QgrH5/zANR7G1C1Mf84Ddu5FQns+BfyYAz/9V/W07+xSC+i9NGqpDTyZl+dCRuD0FfdqYlOsaSYMM3U6R+Ms/YdkiVzZTb39XI8NaHs3oR2rWCG11sex0U9yG9nIfAfKgfthmZJSGhLbx889ch50qLxcEP3f1Gx4Eq8hpr5oZ672TIxtyTgbHc="; // 실제 쿠키 값으로 대체하세요.
 
      const response = await axios.get('/api/user', {
        params: { nidAuth, nidSession }
      });

      setUserInfo(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError('Failed to fetch user info');
      setUserInfo(null);
    }
  };

  return (
    <div>
      <h1>User Info</h1>
      <button onClick={fetchUserInfo}>Get User Info</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {userInfo && (
        <div>
          <h2>User Details:</h2>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}