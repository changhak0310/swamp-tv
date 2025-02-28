import puppeteer from 'puppeteer';

export async function getNaverCookies(username: string, password: string): Promise<string[]> {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  const naver = await browser.newPage();
  
  try {
    await page.goto('https://nid.naver.com/nidlogin.login');

    // 로그인 폼에 입력
    await page.type('#id', username);
    await page.type('#pw', password);

    console.log('로그인 정보를 입력했습니다. 이제 사용자가 직접 로그인 버튼을 클릭할 수 있습니다.');
    console.log('브라우저를 확인하고 로그인 버튼을 클릭하세요. 로그인 후 이 브라우저 창을 닫지 마세요.');

    // 사용자가 로그인 버튼을 클릭할 때까지 대기
    await page.waitForFunction(() => {
      const loginButton = document.querySelector('#log.login') as HTMLButtonElement;
      return loginButton && loginButton.disabled === false;
    });

    // 사용자에게 로그인 버튼 클릭을 요청하는 대기 시간
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30초 대기 (사용자가 로그인 버튼 클릭을 기다림)

    // 로그인 후 쿠키 추출
    const cookies = await page.cookies();
    return cookies.map(cookie => `${cookie.name}=${cookie.value}`);
  } catch (error) {
    console.error('Error during Puppeteer login:', error);
    throw error;
  } finally {
    await browser.close();
  }
}
