const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4321', {waitUntil: 'networkidle2'});
  
  // Mobile
  await page.setViewport({width: 375, height: 800});
  await page.waitForTimeout(1000);
  await page.screenshot({path: '/Users/leonel/.gemini/antigravity/brain/29cf8244-a7b2-409c-af4a-ea6da3052ada/mobile.png', fullPage: true});
  
  // Tablet
  await page.setViewport({width: 800, height: 900});
  await page.waitForTimeout(1000);
  await page.screenshot({path: '/Users/leonel/.gemini/antigravity/brain/29cf8244-a7b2-409c-af4a-ea6da3052ada/tablet.png', fullPage: true});
  
  await browser.close();
})();
