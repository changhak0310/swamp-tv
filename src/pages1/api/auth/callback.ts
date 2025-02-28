// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { code, state } = req.query;
//   const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
//   const clientSecret = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;
//   const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;

//   if (!code || !state) {
//     return res.status(400).json({ error: 'Invalid request' });
//   }

//   try {
//     const tokenResponse = await fetch(`https://nid.naver.com/oauth2.0/token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams({
//         grant_type: 'authorization_code',
//         client_id: clientId!,
//         client_secret: clientSecret!,
//         code: code as string,
//         state: state as string,
//         redirect_uri: redirectUri!,
//       }),
//     });

//     const tokenData = await tokenResponse.json();

//     if (tokenData.access_token) {
//       // 쿠키 설정
//       res.setHeader('Set-Cookie', [
//         `NID_AUT=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
//         `NID_SES=${tokenData.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
//       ]);
      
//       const userInfoResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
//         method: 'GET',
//         headers: {
//             Authorization: `Bearer ${tokenData.access_token}`,
//         },
//     });
    
//     res.status(200).json(userInfoResponse);

//     } else {
//       return res.status(401).json({ error: 'Failed to retrieve access token' });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }


// pages/api/naver-callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ message: 'Missing code or state' });
  }

  try {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;

    // 네이버 서버에 액세스 토큰 요청
    const tokenResponse = await axios.get('https://nid.naver.com/oauth2.0/token', {
      params: {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
        state,
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // 네이버 API 호출 시 사용할 수 있는 액세스 토큰을 이용해 사용자 정보 요청
    const profileResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const profileData = profileResponse.data;

    // 여기서 쿠키 값을 추출하는 로직을 추가할 수 있음
    const naverAutCookie = req.cookies['NID_AUT'];
    const naverSesCookie = req.cookies['NID_SES'];

    // 사용자 프로필 정보 및 쿠키 값 응답
    
    
    res.status(200).json({ profileData, naverAutCookie, naverSesCookie });
  } catch (error) {
    console.error('Error during Naver login callback:', error);
    res.status(500).json({ message: 'Naver login failed' });
  }
}


// import { useEffect } from 'react';
// import { useState } from 'react';

// interface NaverCallbackProps {
//   code: string | null;
//   state: string | null;
// }

// export default function NaverCallback({ code, state }: NaverCallbackProps) {
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (code && state) {
//       const fetchToken = async () => {
//         try {
//           const response = await fetch('/api/naver-token', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ code, state }),
//           });

//           const { accessToken } = await response.json();

//           if (accessToken) {
//             // Save the access token in localStorage or cookies
//             localStorage.setItem('naverToken', accessToken);

//             // Redirect to followings page
//             window.location.href = '/followings';
//           }
//         } catch (error) {
//           console.error('Failed to fetch token:', error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchToken();
//     }
//   }, [code, state]);

//   if (loading) {
//     return "<div>Loading...</div>";
//   }

//   return "<div>Redirection failed or invalid code/state</div>";
// }

// export async function getServerSideProps(context: any) {
//   const { code, state } = context.query;

//   return {
//     props: {
//       code: code || null,
//       state: state || null,
//     },
//   };
// }