/**
 * テキスト整形ユーティリティのテスト
 * Feature-Sliced Design: features/ai/utils
 */

import { describe, it, expect } from 'vitest';
import { formatMessageText, calculateComplexity } from './textFormatter';

describe('formatMessageText', () => {
  it('句読点の後に改行を挿入', () => {
    const result = formatMessageText('今日も頑張っていらっしゃいますね。本当に素晴らしいです。');
    expect(result.text).toContain('\n');
    expect(result.lineCount).toBeGreaterThan(1);
  });

  it('短いメッセージには大きなフォントサイズ', () => {
    const result = formatMessageText('ありがとう！');
    expect(result.fontSize).toBeGreaterThan(1.0);
  });

  it('長いメッセージには小さなフォントサイズ', () => {
    const longMessage = 'AIには決して真似できない、あなただけの視点があります。その経験はAIには生み出せません。';
    const result = formatMessageText(longMessage);
    expect(result.fontSize).toBeLessThanOrEqual(1.0);
  });

  it('接続詞の前で改行を挿入', () => {
    const result = formatMessageText('一歩ずつで大丈夫です。でも無理はしないでくださいね。');
    expect(result.text).toMatch(/。\nでも/);
  });

  it('長すぎる行を強制的に分割', () => {
    const veryLongLine = 'これは非常に長い一文で、改行ポイントがないため強制的に分割されるべきテキストです。';
    const result = formatMessageText(veryLongLine);
    const lines = result.text.split('\n');
    expect(lines.every(line => line.length <= 25)).toBe(true);
  });

  it('既存の改行を保持', () => {
    const result = formatMessageText('一行目。\n二行目。');
    expect(result.text).toContain('一行目');
    expect(result.text).toContain('二行目');
    expect(result.lineCount).toBeGreaterThanOrEqual(2);
  });
});

describe('calculateComplexity', () => {
  it('短いメッセージは複雑度が低い', () => {
    const formatted = formatMessageText('こんにちは');
    const complexity = calculateComplexity(formatted);
    expect(complexity).toBeLessThan(0.5);
  });

  it('長くて行数が多いメッセージは複雑度が高い', () => {
    const longMessage = 'AIには決して真似できない、あなただけの視点があります。その経験はAIには生み出せません。あなただけの大切なものです。';
    const formatted = formatMessageText(longMessage);
    const complexity = calculateComplexity(formatted);
    expect(complexity).toBeGreaterThan(0.3);
  });

  it('複雑度は0-1の範囲', () => {
    const messages = [
      '短い',
      '中くらいの長さのメッセージです。',
      'とても長いメッセージで、複数の文を含んでいて、改行も多く挿入される可能性があるテキストです。',
    ];

    messages.forEach(msg => {
      const formatted = formatMessageText(msg);
      const complexity = calculateComplexity(formatted);
      expect(complexity).toBeGreaterThanOrEqual(0);
      expect(complexity).toBeLessThanOrEqual(1);
    });
  });
});
