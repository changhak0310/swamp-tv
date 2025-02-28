// pages/api/userInfo.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';

export default async function userInfoHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.accessToken) {
    console.error('세션 또는 액세스 토큰이 없습니다.');
    return res.status(401).json({ error: '인증되지 않은 사용자입니다.' });
  }

  try {
    const response = await axios.get('https://comm-api.game.naver.com/nng_main/v1/user/getUserStatus', {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6',
        'cache-control': 'max-age=0',
        'cookie': 'NNB=W2VEXNCXMYTWM; NSCS=1; NAC=zW5XBMgIMs62; NFS=2; m_loc=6d537eb9661ed6fa60d43c0dee92e6971123fac711d59b60d25b6cf9886c97df; NV_WETR_LAST_ACCESS_RGN_M="MDIzMTAxMDM="; NV_WETR_LOCATION_RGN_M="MDIzMTAxMDM="; _ga=GA1.2.943600573.1721283320; tooltipDisplayed=true; BNB_FINANCE_HOME_TOOLTIP_MYASSET=true; loungesRecentlyVisited=chzzk; lastSeenQuestPopupTime=1727449508780; nid_inf=2009851042; NID_AUT=RH1890KJh7ZLQv0q2ZRtwWnvom+9+PlU/gl1OlaEkA76A4VN164vCEerjHWM0Xzy; NID_JKL=m9td3dJMSgJt3qyCWxlmPhUYs0qhct7TX7n/055H1eI=; ba.uuid=0; BUC=f_tCSRn3sSH1zmNFtXpS36a7AbRmx_tePhu8Rv7g0Ow=; NID_SES=AAABf3eKD+VgbZiI0XO3G05HMBNRjRY4gYSt3CeVVLcFIPxe9DZZSJR5Er3GIaJoSeeLp7eDxbxy5Ls+ecKEKSvSuele5NMVBkmdrpGmHybtnanCB1FaTMbACenWTPwZGi27dmYuV21r2u934O7uSE0z20Wie2JcWZVjQpbIB3EpZt99jHrlUbO6sECWcmbtrUuoDZ3xUxh7jokx0/T7qgChtwFFblC3ZPzLfnm9WZvZn7paZEvXvU+AiocuZjeI2SaMM4mtpPxKqv/H2Gk0LDZVUUrhimgjVz2Y8zrOPrb0l1MbAHvCAL8oo6gB2zpr/sDDJlNGyo38rAKdAns8NOf329yTYqNRzsx33lmY8l0GlYrJkfkxihaWbJ+i30m9aeI2H3gLbsfFeqqZX7e3R6THFFy2e1thplsgwfEaKOEChA4m1BDAQCNI+vMKWKiL814lt1+t3TQObwnMXjS7nWwj37wIBf4KIM4s5MI8DBuJaVpXIiyN9L9aZoWLNoRibiYmhQ==',
        'priority': 'u=0, i',
        'sec-ch-ua': '"Whale";v="3", "Not-A.Brand";v="8", "Chromium";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Whale/3.28.266.11 Safari/537.36',
      },
    });


console.log(response)

    res.status(200).json(response.data.response);
  } catch (error) {
    console.error('사용자 정보를 가져오는 중 오류 발생:', error.response?.data || error.message);
    res.status(500).json({ error: '사용자 정보를 가져오는데 실패했습니다.' });
  }
}
