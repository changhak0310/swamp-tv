import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
  const state = Math.random().toString(36).substr(2, 12); // CSRF 방지를 위한 상태값

  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri!)}&state=${state}`;

  res.redirect(naverAuthUrl);
}

// import { NextApiRequest, NextApiResponse } from 'next';

// export default function login(req: NextApiRequest, res: NextApiResponse) {
//   const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI || "")}&state=${Date.now()}`;

//   res.redirect(naverLoginUrl);
// }