import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //const { nidAuth, nidSession } = req.query; // 쿠키에서 NID_AUT와 NID_SES를 받아옵니다.

  const nidAuth = "4ACNpFVNzoKWMoA9NZrQ7xoUk78n4gnkUa43SwvI4MiErtH2WVBdQfZbNrkSD9TX";
  const nidSession = "AAABhTVyRBKNuPln0pen+nK/EzHB7Uem3h5B+OdhNkt5IG7O6F5aZBwpcGUa0Okf+gTzDW4P6HNVzaSzdMvGKrrBqSd5yEbbYTNdxEpN+uPITwaXa+mL3Yo6A5DwtNhABJ97XwNraQb5frWC93oIpHzndym+UDFBuSFC17ZHyoeed3XuY6Cs7Fp5oCzNxPnMcL0S555mLOKvUY5xUCiTjACBUFIGFd/MwUB4tBHBdwH4sunnTJ2eO0xxcmYxHPxai7KTwy+1bnnr7Bs6KD+T3AKOF/5JkQFyS4rGXkff9XUxTC65xoQfw4POU/ksc8N9sudN+27nEABhDYJAOvFJ1A/H0IMLYd3I2Asbv0Po07rmn+wVsiFxHitgsBJSo38G22ecS7TnmxaneVjox9V0TrD5gW1rpMRW9S2RBA6vChw5x3SDm1dfABSMWxhbUDTCIoUriy5+sX9WZJYVwWxgklb++x/E3zr1rO5IF6ZorhpShlvlnVx0rJV1ID0j3YkO4+aiCgWoF+MlU0GKo+448uosfF4="
  
  try {
    const response = await axios.get('https://comm-api.game.naver.com/nng_main/v1/user/getUserStatus', {
      headers: {
        'Cookie': `NID_AUT=${nidAuth}; NID_SES=${nidSession}`
      }
    });

    const userData = response.data;
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
}