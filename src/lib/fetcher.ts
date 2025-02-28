// lib/fetcher.ts
export const fetcher = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
  
    return res.json();
  };
  