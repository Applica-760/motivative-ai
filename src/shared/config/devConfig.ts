/**
 * 開発環境用の設定
 * 
 * データのリセットや開発用の機能を制御する
 */

/**
 * デフォルトデータのバージョン
 * このバージョンが変更されると、既存データがリセットされてデフォルトデータが再生成される
 * 
 * 変更履歴:
 * - v1: 初期バージョン（ランニング、読書、瞑想）
 * - v2: 瞑想削除、早起き・日記追加、グリッド配置変更
 */
export const DEFAULT_DATA_VERSION = 'v2';

/**
 * 開発モードでの強制リセット
 * trueにすると、次回起動時にデータが完全にリセットされる
 * 
 * ⚠️ 本番環境では必ずfalseにすること
 */
export const FORCE_RESET_ON_NEXT_LOAD = false;

/**
 * バージョン管理されたデータかをチェック
 */
export function shouldResetData(currentVersion: string | null): boolean {
  // 強制リセットが有効な場合
  if (FORCE_RESET_ON_NEXT_LOAD) {
    console.log('[DevConfig] 🔄 Force reset is enabled');
    return true;
  }
  
  // バージョンが存在しない場合（初回起動）
  if (!currentVersion) {
    console.log('[DevConfig] 📦 No version found, using default data');
    return false; // 既存ロジックに任せる
  }
  
  // バージョンが異なる場合
  if (currentVersion !== DEFAULT_DATA_VERSION) {
    console.log(`[DevConfig] 🔄 Version mismatch (${currentVersion} → ${DEFAULT_DATA_VERSION}), resetting data`);
    return true;
  }
  
  return false;
}

/**
 * ストレージキー
 */
export const DATA_VERSION_KEY = 'motivative-ai-data-version';
