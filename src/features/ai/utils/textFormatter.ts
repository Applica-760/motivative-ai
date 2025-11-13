/**
 * テキスト整形ユーティリティ
 * Feature-Sliced Design: features/ai/utils
 * 
 * 吹き出しメッセージの見栄えを良くするための
 * 改行挿入とフォントサイズ調整のロジック
 */

/**
 * テキスト整形の結果
 */
export interface FormattedText {
  /** 改行が挿入されたテキスト */
  text: string;
  /** 推奨フォントサイズ (rem単位) */
  fontSize: number;
  /** 行数 */
  lineCount: number;
}

/**
 * 改行を挿入する優先順位の高い区切り文字
 */
const HIGH_PRIORITY_BREAKS = ['。', '！', '？', '♪'];

/**
 * 改行を挿入する優先順位が中程度の区切り文字
 */
const MEDIUM_PRIORITY_BREAKS = ['、', '…'];

/**
 * 適切な改行位置の候補（接続詞や助詞の前）
 */
const BREAK_BEFORE_PATTERNS = [
  'でも', 'しかし', 'それでも', 'だから', 'そして',
  'けれど', 'けれども', 'ただ', 'また', 'そこで',
  'ですが', 'なので', 'ですから',
];

/**
 * 理想的な1行あたりの文字数
 */
const IDEAL_LINE_LENGTH = 18;

/**
 * 最小の1行あたりの文字数
 */
const MIN_LINE_LENGTH = 12;

/**
 * 最大の1行あたりの文字数
 */
const MAX_LINE_LENGTH = 24;

/**
 * 文字数に応じた推奨フォントサイズマップ
 */
const FONT_SIZE_MAP = [
  { maxLength: 15, size: 1.125 },  // 短い: 18px (1.125rem)
  { maxLength: 30, size: 1.0 },    // 普通: 16px (1rem)
  { maxLength: 50, size: 0.9375 }, // やや長い: 15px (0.9375rem)
  { maxLength: Infinity, size: 0.875 }, // 長い: 14px (0.875rem)
];

/**
 * テキストに適切な改行を挿入する
 * 
 * アルゴリズム:
 * 1. 句読点や記号の後で改行
 * 2. 接続詞の前で改行
 * 3. 長すぎる行を検出して強制改行
 * 
 * @param text 元のテキスト
 * @returns 改行が挿入されたテキスト
 */
function insertLineBreaks(text: string): string {
  let result = text;

  // Step 1: 高優先度の区切り文字の後に改行を挿入
  HIGH_PRIORITY_BREAKS.forEach(char => {
    // 既に改行がある場合はスキップ
    const pattern = new RegExp(`${char}(?!\n)`, 'g');
    result = result.replace(pattern, `${char}\n`);
  });

  // Step 2: 中優先度の区切り文字の後に改行（長い行のみ）
  const lines = result.split('\n');
  result = lines.map(line => {
    if (line.length > MAX_LINE_LENGTH) {
      MEDIUM_PRIORITY_BREAKS.forEach(char => {
        const parts = line.split(char);
        if (parts.length > 1) {
          // 各パートが短すぎない場合のみ改行
          const validSplit = parts.every(part => part.length >= MIN_LINE_LENGTH / 2);
          if (validSplit) {
            line = parts.join(`${char}\n`);
          }
        }
      });
    }
    return line;
  }).join('\n');

  // Step 3: 接続詞の前で改行
  BREAK_BEFORE_PATTERNS.forEach(pattern => {
    const regex = new RegExp(`([^\n]{${MIN_LINE_LENGTH},})${pattern}`, 'g');
    result = result.replace(regex, `$1\n${pattern}`);
  });

  // Step 4: 長すぎる行を強制的に分割
  const finalLines = result.split('\n').flatMap(line => {
    if (line.length <= MAX_LINE_LENGTH) {
      return [line];
    }

    // 長い行を適切な位置で分割
    const segments: string[] = [];
    let remaining = line;

    while (remaining.length > MAX_LINE_LENGTH) {
      // 理想的な分割位置を探す（句読点や空白）
      let splitIndex = IDEAL_LINE_LENGTH;
      
      // 前方に句読点を探す
      for (let i = IDEAL_LINE_LENGTH; i < MAX_LINE_LENGTH && i < remaining.length; i++) {
        const char = remaining[i];
        if ([...HIGH_PRIORITY_BREAKS, ...MEDIUM_PRIORITY_BREAKS].includes(char)) {
          splitIndex = i + 1;
          break;
        }
      }

      segments.push(remaining.slice(0, splitIndex));
      remaining = remaining.slice(splitIndex);
    }

    if (remaining.length > 0) {
      segments.push(remaining);
    }

    return segments;
  });

  return finalLines.join('\n');
}

/**
 * 文字数に基づいて最適なフォントサイズを決定
 * 
 * @param textLength テキストの文字数
 * @returns フォントサイズ (rem単位)
 */
function calculateFontSize(textLength: number): number {
  const entry = FONT_SIZE_MAP.find(({ maxLength }) => textLength <= maxLength);
  return entry?.size ?? 0.875;
}

/**
 * テキストを整形して見栄えを改善
 * 
 * @param text 元のテキスト
 * @returns 整形されたテキスト情報
 * 
 * @example
 * ```typescript
 * const result = formatMessageText('今日も頑張っていらっしゃいますね。本当に素晴らしいです。');
 * // result.text: "今日も頑張っていらっしゃいますね。\n本当に素晴らしいです。"
 * // result.fontSize: 1.0
 * // result.lineCount: 2
 * ```
 */
export function formatMessageText(text: string): FormattedText {
  // 改行を挿入
  const formattedText = insertLineBreaks(text);
  
  // 行数をカウント
  const lineCount = formattedText.split('\n').length;
  
  // フォントサイズを決定
  const fontSize = calculateFontSize(text.length);

  return {
    text: formattedText,
    fontSize,
    lineCount,
  };
}

/**
 * テキストの見た目の複雑さを評価
 * 行数とフォントサイズのバランスから判定
 * 
 * @param formatted 整形済みテキスト情報
 * @returns 複雑さスコア (0-1, 高いほど複雑)
 */
export function calculateComplexity(formatted: FormattedText): number {
  const lineComplexity = Math.min(formatted.lineCount / 4, 1);
  const sizeComplexity = 1 - (formatted.fontSize - 0.875) / (1.125 - 0.875);
  
  return (lineComplexity + sizeComplexity) / 2;
}
