// pages/followings.tsx
import { useEffect, useState } from 'react';
import { ApiUrl } from '../lib/api';
import { fetcher } from '../lib/fetcher';

interface Channel {
  id: string;
  name: string;
  liveInfo: boolean;
}

export default function FollowingsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getFollowings = async () => {
      const token = localStorage.getItem('naverToken');
      
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      try {
        const data = await fetcher(`${ApiUrl.chzzkService}${ApiUrl.followings}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChannels(data.channels);
      } catch (error) {
        setError('팔로우 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    getFollowings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Following Channels</h1>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <li key={channel.id} className="p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold">{channel.name}</h2>
            <p>{channel.liveInfo ? 'Live' : 'Offline'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
