import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiUrl = 'https://api.chzzk.naver.com/service/v1/channels/followings/live';


  const nidAuth = "4ACNpFVNzoKWMoA9NZrQ7xoUk78n4gnkUa43SwvI4MiErtH2WVBdQfZbNrkSD9TX";
  const nidSession = "AAABhTVyRBKNuPln0pen+nK/EzHB7Uem3h5B+OdhNkt5IG7O6F5aZBwpcGUa0Okf+gTzDW4P6HNVzaSzdMvGKrrBqSd5yEbbYTNdxEpN+uPITwaXa+mL3Yo6A5DwtNhABJ97XwNraQb5frWC93oIpHzndym+UDFBuSFC17ZHyoeed3XuY6Cs7Fp5oCzNxPnMcL0S555mLOKvUY5xUCiTjACBUFIGFd/MwUB4tBHBdwH4sunnTJ2eO0xxcmYxHPxai7KTwy+1bnnr7Bs6KD+T3AKOF/5JkQFyS4rGXkff9XUxTC65xoQfw4POU/ksc8N9sudN+27nEABhDYJAOvFJ1A/H0IMLYd3I2Asbv0Po07rmn+wVsiFxHitgsBJSo38G22ecS7TnmxaneVjox9V0TrD5gW1rpMRW9S2RBA6vChw5x3SDm1dfABSMWxhbUDTCIoUriy5+sX9WZJYVwWxgklb++x/E3zr1rO5IF6ZorhpShlvlnVx0rJV1ID0j3YkO4+aiCgWoF+MlU0GKo+448uosfF4="
  
  try {
    // axios로 API 요청을 보냅니다.
    const response = await axios.get(apiUrl, {
      headers: {
        'Cookie': `NID_AUT=${nidAuth}; NID_SES=${nidSession}`,
      },
    });

    // 요청이 성공하면 데이터를 클라이언트에 반환합니다.
    res.status(200).json(response.data);
  } catch (error: any) {
    // 에러가 발생하면 에러 메시지를 출력하고, 적절한 상태 코드와 메시지를 반환합니다.
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}