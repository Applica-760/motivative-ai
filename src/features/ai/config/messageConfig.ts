/**
 * AIキャラクターのメッセージ設定
 */

/**
 * 吹き出しメッセージの型定義
 */
export interface SpeechBubbleMessage {
  /** メッセージのID */
  id: string;
  /** 表示するテキスト */
  text: string;
  /** 作成日時（オプション） */
  createdAt?: Date;
}

/**
 * サンプルメッセージ（デモ用）
 */
export const SAMPLE_MESSAGES: SpeechBubbleMessage[] = [
  {
    id: '1',
    text: 'こんにちは！今日も頑張りましょう！',
  },
  {
    id: '2',
    text: 'アクティビティを記録して、振り返ってみましょう',
  },
];
