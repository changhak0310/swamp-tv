import type { NextApiRequest, NextApiResponse } from 'next';
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromeAwsLambda from 'chrome-aws-lambda';
import axios from 'axios';

async function getDriver(): Promise<WebDriver> {
  const options = new chrome.Options();
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    return await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(new chrome.ServiceBuilder(await chromeAwsLambda.executablePath))
      .build();
  } else {
    return await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  }
}

async function loginNaver(driver: WebDriver, userId: string, userPw: string): Promise<void> {
  await driver.get('https://nid.naver.com/nidlogin.login');

  await driver.findElement(By.id('id')).sendKeys(userId);
  await driver.findElement(By.id('pw')).sendKeys(userPw);

  await driver.findElement(By.id('log.login')).click();

  await driver.wait(until.urlContains('naver.com'), 5000);
}

async function getUserStatus(driver: WebDriver): Promise<any> {
  const cookies = await driver.manage().getCookies();
    
    console.log(cookies)

  const axiosInstance = axios.create({
    headers: {
      Cookie: cookies.map((cookie: any) => `${cookie.name}=${cookie.value}`).join('; '),
    },
  });


  const response = await axiosInstance.get('https://comm-api.game.naver.com/nng_main/v1/user/getUserStatus');
  return response.data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, userPw } = req.body;

  if (!userId || !userPw) {
    return res.status(400).json({ error: 'Missing userId or userPw' });
  }

  const driver = await getDriver();

  try {
    await loginNaver(driver, userId, userPw);

    const userStatus = await getUserStatus(driver);
    res.status(200).json({ status: 'success', data: userStatus });
  } catch (error) {
    console.error('Login or API fetch error:', error);
    res.status(500).json({ error: 'Failed to login or fetch user status' });
  } finally {
    await driver.quit();
  }
}