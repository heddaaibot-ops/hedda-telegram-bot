#!/usr/bin/env node

/**
 * Twitter Smart Router 批量抓取範例
 *
 * 示範如何批量抓取多個 Twitter URL
 */

// 引入 Smart Router（需要調整路徑）
const { fetchTwitterUrl } = require('../../pimi-reports/twitter-smart-router');

// 要抓取的 Twitter URLs
const urls = [
  'https://x.com/elonmusk/status/2026942204170940504',
  'https://twitter.com/VitalikButerin',
  'https://x.com/cz_binance/status/123456789',
  'https://x.com/search?q=bitcoin'
];

/**
 * 批量抓取函數
 */
async function batchFetch() {
  console.log(`🚀 開始批量抓取 ${urls.length} 個 URL...\n`);

  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`[${i + 1}/${urls.length}] 抓取: ${url}`);

    try {
      const result = await fetchTwitterUrl(url, { verbose: false });

      if (result.success) {
        console.log(`✅ 成功 (${result.method})`);
        results.push({
          url,
          success: true,
          method: result.method,
          content: result.content
        });
      } else {
        console.log(`❌ 失敗: ${result.error}`);
        results.push({
          url,
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      console.log(`❌ 異常: ${error.message}`);
      results.push({
        url,
        success: false,
        error: error.message
      });
    }

    console.log(''); // 空行

    // 加延遲避免被限流（除了最後一個）
    if (i < urls.length - 1) {
      console.log('⏳ 等待 2 秒...\n');
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // 輸出總結
  console.log('\n' + '='.repeat(60));
  console.log('📊 批量抓取總結');
  console.log('='.repeat(60));

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log(`✅ 成功: ${successCount}`);
  console.log(`❌ 失敗: ${failCount}`);
  console.log(`📈 成功率: ${(successCount / results.length * 100).toFixed(1)}%`);

  // 統計各方案使用次數
  const methodCount = {};
  results.filter(r => r.success).forEach(r => {
    methodCount[r.method] = (methodCount[r.method] || 0) + 1;
  });

  console.log('\n🔧 使用方案統計:');
  Object.entries(methodCount).forEach(([method, count]) => {
    console.log(`  ${method}: ${count} 次`);
  });

  console.log('\n' + '='.repeat(60));

  // 輸出詳細結果
  console.log('\n📝 詳細結果:\n');

  results.forEach((result, i) => {
    console.log(`[${i + 1}] ${result.url}`);
    if (result.success) {
      console.log(`    ✅ ${result.method}`);
      console.log(`    內容長度: ${result.content.length} 字元`);
    } else {
      console.log(`    ❌ ${result.error}`);
    }
    console.log('');
  });

  return results;
}

// 執行
if (require.main === module) {
  batchFetch()
    .then(() => {
      console.log('🎉 批量抓取完成！');
      process.exit(0);
    })
    .catch(err => {
      console.error('💥 執行錯誤:', err.message);
      process.exit(1);
    });
}

module.exports = { batchFetch };
