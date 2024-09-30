import { useState, useEffect } from 'react';
import { Streamer } from '@/types/streamers';

export function useStreamers() {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStreamers = async () => {
      try {
        const response = await fetch('/api/swamp/station');
        const data = await response.json();
        setStreamers(data);
      } catch (error) {
        console.error('Error fetching streamers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamers();
  }, []);

  return { streamers, loading };
}
