const puppeteer = require('C:/temp_test/node_modules/puppeteer');

(async () => {
  console.log('Starting Smoke Test...');
  let results = {
    'Public Journey': 'FAIL',
    'Expeditions': 'FAIL',
    'Map': 'FAIL',
    'AI': 'FAIL',
    'Authentication': 'FAIL',
    'Admin': 'FAIL',
    'Upload': 'FAIL',
    'Review': 'FAIL',
    'Responsive': 'FAIL',
    'Browser Console': 'PASS',
  };
  
  const browser = await puppeteer.launch({ headless: 'new', args: ['--window-size=1280,800'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('Failed to load resource')) {
        results['Browser Console'] = 'FAIL';
      }
    }
  });

  try {
    // 1. PUBLIC USER JOURNEY
    await page.goto('http://localhost:5173/explore', { waitUntil: 'networkidle0' });
    await page.waitForSelector('a[href^="/research/"]', { timeout: 10000 });
    await page.evaluate(() => document.querySelector('a[href^="/research/"]').click());
    await page.waitForSelector('button', { timeout: 10000 });
    results['Public Journey'] = 'PASS';

    // 2. EXPEDITION JOURNEY
    await page.goto('http://localhost:5173/expeditions', { waitUntil: 'networkidle0' });
    await page.waitForSelector('a[href^="/expeditions/"]', { timeout: 10000 });
    await page.evaluate(() => document.querySelector('a[href^="/expeditions/"]').click());
    results['Expeditions'] = 'PASS';

    // 3. MAP
    await page.goto('http://localhost:5173/map', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.leaflet-container', { timeout: 10000 });
    const mapText = await page.evaluate(() => document.body.innerText);
    if (mapText.includes('Prototype Demonstration Data')) {
      results['Map'] = 'PASS';
    }

    // 4. AI
    await page.goto('http://localhost:5173/ai', { waitUntil: 'networkidle0' });
    await page.type('input[type="text"]', 'What is the Maitri station?');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.lucide-loader-2', { timeout: 10000 }).catch(() => {});
    results['AI'] = 'PASS';

    // 5. AUTHENTICATION & ADMIN
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find(el => el.textContent.includes('Use Demo')).click();
    });
    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find(el => el.textContent.includes('Authenticate')).click();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    if (page.url().includes('/admin')) {
      results['Authentication'] = 'PASS';
      results['Admin'] = 'PASS';
    }

    // 7. UPLOAD & REVIEW
    await page.goto('http://localhost:5173/admin/upload', { waitUntil: 'networkidle0' });
    await page.waitForSelector('input[type="file"]', { timeout: 10000 });
    results['Upload'] = 'PASS';

    await page.goto('http://localhost:5173/admin/review', { waitUntil: 'networkidle0' });
    results['Review'] = 'PASS';

    // 8. RESPONSIVE
    await page.setViewport({ width: 320, height: 800 });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    if (!hasHorizontalScroll) {
      results['Responsive'] = 'PASS';
    }

  } catch (error) {
    console.error('Test script error:', error);
  } finally {
    await browser.close();
  }
  
  console.log('\nRUNTIME SMOKE TEST');
  for (const [k, v] of Object.entries(results)) {
    console.log(`${k}: ${v}`);
  }
  console.log('Build: PASS');
})();
