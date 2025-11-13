#!/usr/bin/env node

/**
 * ローカルストレージクリーンアップスクリプト
 * 
 * ブラウザのローカルストレージを直接操作することはできないため、
 * このスクリプトはユーザーに手順を表示します。
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function header(text) {
  console.log('\n' + '='.repeat(60));
  log(text, colors.bright + colors.cyan);
  console.log('='.repeat(60) + '\n');
}

function success(text) {
  log(`✅ ${text}`, colors.green);
}

function warning(text) {
  log(`⚠️  ${text}`, colors.yellow);
}

function info(text) {
  log(`ℹ️  ${text}`, colors.blue);
}

function step(number, text) {
  log(`${number}. ${text}`, colors.bright);
}

// メイン処理
header('🧹 Motivative AI - ローカルストレージクリーンアップ');

log('このスクリプトは、ローカルストレージをクリアする手順を案内します。', colors.cyan);
log('デフォルトデータを再読み込みするために必要な操作です。\n');

warning('注意: すべてのローカルデータ（記録・アクティビティ）が削除されます！');
log('      ログインしている場合、Firestoreのデータは保持されます。\n');

header('📋 クリーンアップ手順');

step(1, '開発サーバーが起動していることを確認');
info('   http://localhost:5174 または http://localhost:5173\n');

step(2, 'ブラウザで開発者ツールを開く');
info('   Mac: Cmd + Option + I');
info('   Windows: F12\n');

step(3, 'Consoleタブを選択\n');

step(4, '以下のコードをコピー&ペーストして Enter を押す:');
console.log('\n' + '-'.repeat(60));
log(`
// ローカルストレージをクリア
const keys = [
  'motivative-ai-activities',
  'motivative-ai-records',
  'motivative-ai-grid-layout',
  'motivative-ai-grid-items-order'
];

console.log('🧹 クリーンアップ開始...');
keys.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(\`✓ 削除: \${key}\`);
  } else {
    console.log(\`- スキップ: \${key} (存在しません)\`);
  }
});

// その他のmotivative-ai関連キーも削除
Object.keys(localStorage)
  .filter(k => k.startsWith('motivative-ai'))
  .forEach(key => {
    if (!keys.includes(key)) {
      localStorage.removeItem(key);
      console.log(\`✓ 削除: \${key} (追加キー)\`);
    }
  });

console.log('✅ クリーンアップ完了！');
console.log('📌 次: ページをリロード (Cmd+R / F5)');
`, colors.yellow);
console.log('-'.repeat(60) + '\n');

step(5, 'ページをリロード');
info('   Mac: Cmd + R');
info('   Windows: F5\n');

step(6, 'デフォルトデータが自動生成されます！');
success('   - 🏃 ランニング (グラフ)');
success('   - 📚 読書 (グラフ)');
success('   - ⏰ 6時までに起きれた (カレンダー)');
success('   - 📓 頑張った日記 (テキストログ)');

header('🚀 便利な方法');
log('HTMLクリーンアップツールを使うこともできます:\n');
info('   open scripts/clear-local-storage.html');
log('\nまたは、ブラウザのアドレスバーに直接入力:\n');
info('   file://' + process.cwd() + '/scripts/clear-local-storage.html');

console.log('\n' + '='.repeat(60) + '\n');
