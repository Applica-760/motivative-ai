/**
 * AI Feature
 * Feature-Sliced Design
 * 
 * AIキャラクターとチャット機能を提供するfeature。
 * 
 * 構成:
 * - ui/: キャラクター表示コンポーネント
 * - hooks/: アニメーションロジック
 * - config/: キャラクター設定
 * 
 * 将来の拡張:
 * - api/: AIチャットAPI連携
 * - model/: チャット状態管理
 */
export { AiCharacter } from './ui/AiCharacter';
export { CharacterEyes } from './ui/CharacterEyes';
export { ParallaxBackground } from './ui/ParallaxBackground';
export { SpeechBubble } from './ui/SpeechBubble';
export { SpeechBubbleList } from './ui/SpeechBubbleList';
export { useEyeTracking, useParallax, useEncouragement } from './hooks';
export { PARALLAX_LAYERS, EYE_CONFIG, SAMPLE_MESSAGES, ENCOURAGEMENT_MESSAGES, getRandomEncouragement } from './config';
export type { SpeechBubbleMessage, EncouragementMessage } from './config';
