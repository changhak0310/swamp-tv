import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const nidAuth = "AAAAPMG4_PPfhxwdMBucITNTI0mk41MOWy2LEg-GO3CVEJmzgKad0eMZqmVBF-vkiHgOtlPxyaEb00YRroWxItJ9bLo";
const nidSession = "XGE6UUCjKP4MjaRsMOyNyr9brHaH69PiixjxXIO9AloPcV6JEJOeZvXpI4enaChXDBtcIO7sZQusfisAtWUeqGVcvaMvo3isRcGOgEI0Hist98el4siiljPWql7Aiiisfnk3Y2I"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await axios.get('https://api.chzzk.naver.com/service/v1/search/channels', {
      params: {
        keyword: '남봉',
        size: 13,
        offset: 0,
      },
      headers: {
        'Cookie': `NID_AUT=${nidAuth}; NID_SES=${nidSession}`
      }
    });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from CHZZK API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}