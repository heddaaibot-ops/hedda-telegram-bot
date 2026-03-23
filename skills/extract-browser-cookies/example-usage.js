#!/usr/bin/env node

/**
 * 使用提取的 cookies 在 Playwright 中訪問 Twitter
 *
 * 前提：先運行 python3 extract-cookies.py twitter
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function twitterWithCookies() {
  console.log('🚀 使用提取的 cookies 訪問 Twitter\n');

  // 讀取 cookies
  const cookiePath = path.join(process.env.HOME, '.config/twitter-cookies.json');

  if (!fs.existsSync(cookiePath)) {
    console.error('❌ Cookies 文件不存在');
    console.log('💡 請先運行: python3 extract-cookies.py twitter\n');
    process.exit(1);
  }

  const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf-8'));
  console.log(`✓ 載入 ${cookies.length} 個 cookies\n`);

  // 啟動瀏覽器
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  // 添加 cookies
  await context.addCookies(cookies);
  console.log('✓ Cookies 已添加到瀏覽器\n');

  const page = await context.newPage();

  try {
    // 訪問 Twitter
    console.log('訪問 Twitter...');
    await page.goto('https://twitter.com/home');
    await page.waitForTimeout(3000);

    // 檢查是否登錄
    const url = page.url();
    if (url.includes('/home')) {
      console.log('✅ 已登錄！現在在首頁\n');

      // 示例：獲取用戶資訊
      try {
        await page.waitForSelector('[data-testid="SideNav_AccountSwitcher_Button"]', { timeout: 5000 });
        console.log('✓ 檢測到用戶帳號選單\n');
      } catch (e) {
        console.log('⚠️  未檢測到帳號選單（可能頁面結構變化）\n');
      }

      // 截圖
      await page.screenshot({ path: '/tmp/twitter-logged-in.png' });
      console.log('📸 截圖保存到: /tmp/twitter-logged-in.png\n');

    } else {
      console.log('⚠️  似乎未登錄，當前在:', url);
    }

    console.log('等待 5 秒後關閉...');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ 錯誤:', error.message);
  } finally {
    await browser.close();
    console.log('✅ 完成！');
  }
}

// 執行
twitterWithCookies();
