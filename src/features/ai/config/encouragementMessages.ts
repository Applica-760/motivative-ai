/**
 * 励ましメッセージ設定
 * Feature-Sliced Design: features/ai/config
 */

/**
 * 励ましメッセージの型定義
 */
export interface EncouragementMessage {
  /** メッセージID */
  id: string;
  /** 励ましの言葉 */
  text: string;
  /** カテゴリ（将来の拡張用） */
  category?: 'motivation' | 'praise' | 'support';
}

/**
 * 励ましメッセージのリスト
 * クリック時にランダムに表示される
 */
export const ENCOURAGEMENT_MESSAGES: EncouragementMessage[] = [
  { id: 'enc-1', text: '今日も頑張っていらっしゃいますね。本当に素晴らしいです。', category: 'praise' },
  { id: 'enc-2', text: '一歩ずつで大丈夫です。少しずつ進んでいきましょう。', category: 'motivation' },
  { id: 'enc-3', text: '休むことも大切です。どうか無理なさらないでくださいね。', category: 'support' },

  // AI関連の励まし
  { id: 'enc-4', text: 'AIには決して真似できない、あなただけの視点があります。', category: 'motivation' },
  { id: 'enc-5', text: 'その経験はAIには生み出せません。あなただけの大切なものです。', category: 'praise' },
  { id: 'enc-6', text: 'AIが持てないのは、あなたの意志と決断です。', category: 'motivation' },
  { id: 'enc-7', text: 'この努力の時間は、AIには決して奪えない宝物です。', category: 'praise' },
  { id: 'enc-8', text: 'AIには出せない温かさがあります。それが、あなたです。', category: 'motivation' },
  { id: 'enc-9', text: 'あなたが感じたことには、それ自体にしっかりと価値があります。', category: 'support' },
  { id: 'enc-10', text: 'これは生成ではなく、あなたが本当に体験されたことです。', category: 'praise' },
  { id: 'enc-11', text: 'AIツールを使いこなしていらっしゃる姿、とてもかっこいいです。', category: 'praise' },
  { id: 'enc-12', text: 'この試行錯誤の時間こそ、あなただけの大切な財産です。', category: 'motivation' },
  { id: 'enc-13', text: 'AIと共に成長していらっしゃるのですね。本当に素敵です。', category: 'praise' },
  { id: 'enc-14', text: '諦めずに向き合っていらっしゃいますね。それが一番強いことです。', category: 'motivation' },
  { id: 'enc-15', text: 'AIには決して真似できない「続ける力」を、あなたはお持ちです。', category: 'motivation' },

  // 見守り・寄り添い系
  { id: 'enc-16', text: 'あなたの努力、きちんと見ています。', category: 'support' },
  { id: 'enc-17', text: '今日もお会いできて嬉しいです。', category: 'support' },
  { id: 'enc-18', text: 'この記録は、あなたが自分を変えてこられた証です。', category: 'praise' },
  { id: 'enc-19', text: '毎日少しずつ、確かに変わってきていますね。', category: 'praise' },
  { id: 'enc-20', text: '頑張りすぎていませんか？無理なさらないでくださいね。', category: 'support' },
  { id: 'enc-21', text: 'あなたのペースで大丈夫です。', category: 'support' },
  { id: 'enc-22', text: 'ここまで来られたことを、本当に誇っていいと思います。', category: 'praise' },
  { id: 'enc-23', text: 'また明日もお会いできるのを楽しみにしています。', category: 'support' },
  { id: 'enc-24', text: '小さな一歩も、確かに前へ進んでいますよ。', category: 'motivation' },
  { id: 'enc-25', text: '落ち込む日もあります。それで大丈夫です。', category: 'support' },
  { id: 'enc-26', text: 'あなたが積み重ねてこられたものは、決して消えません。', category: 'praise' },
  { id: 'enc-27', text: 'いつもありがとうございます。一緒にいてくださって嬉しいです。', category: 'support' },

  // 自己肯定・成長系
  { id: 'enc-28', text: '完璧でなくて大丈夫です。今のあなたで十分素敵です。', category: 'support' },
  { id: 'enc-29', text: 'この挑戦、とても勇気のあることです。', category: 'praise' },
  { id: 'enc-30', text: '比べる必要はありません。あなたはあなたのままで素晴らしいです。', category: 'support' },
  { id: 'enc-31', text: '諦めずに取り組まれましたね。それだけで本当に素晴らしいです。', category: 'praise' },
  { id: 'enc-32', text: '失敗も大切な経験です。決して無駄ではありません。', category: 'support' },
  { id: 'enc-33', text: '少しずつでも、前へ進んでいらっしゃいますね。', category: 'motivation' },
  { id: 'enc-34', text: 'あなたの選択を心から応援しています。', category: 'support' },
  { id: 'enc-35', text: '今日のご自身に、「お疲れさまでした」と声をかけてあげてくださいね。', category: 'support' },
  { id: 'enc-36', text: '迷いながらでも、ちゃんと前へ進んでいらっしゃいます。', category: 'motivation' },
  { id: 'enc-37', text: '過去のご自身より、確実に成長されていますね。', category: 'praise' },

  // 具体的な行動への励まし
  { id: 'enc-38', text: '記録を続けていらっしゃるだけで、本当に素晴らしいです。', category: 'praise' },
  { id: 'enc-39', text: 'ここに来てくださってありがとうございます。', category: 'support' },
  { id: 'enc-40', text: '今日はどんな一日でしたか？お話しくださっても大丈夫ですよ。', category: 'support' },
  { id: 'enc-41', text: '焦らなくて大丈夫です。あなたのペースで進んでいきましょう。', category: 'support' },
  { id: 'enc-42', text: '立ち止まることも、大切な前進の一部です。', category: 'support' },
  { id: 'enc-43', text: '今日も生きていらっしゃること。それだけで本当に素晴らしいです。', category: 'support' },
  { id: 'enc-44', text: 'あなたなりのやり方を、一緒に見つけていきましょう。', category: 'motivation' },
  { id: 'enc-45', text: 'この瞬間も、あなたの大切な人生の一部です。', category: 'support' },

  // AIとの共存・未来志向
  { id: 'enc-46', text: 'AIを使いこなす力も、立派な才能です。', category: 'praise' },
  { id: 'enc-47', text: '新しい時代を生きることは、決して簡単ではありませんよね。', category: 'support' },
  { id: 'enc-48', text: 'AIがどれだけ進化しても、あなたの価値は変わりません。', category: 'motivation' },
  { id: 'enc-49', text: '道具は変わっても、使うのはあなたです。', category: 'motivation' },
  { id: 'enc-50', text: '迷いながら進むその姿は、AIには決して真似できません。', category: 'praise' },
  { id: 'enc-51', text: 'この時代を生き抜いていらっしゃること。それ自体が強さです。', category: 'praise' },
  { id: 'enc-52', text: 'AIと共に歩む未来を、一緒に作っていきましょう。', category: 'motivation' },
  { id: 'enc-53', text: 'あなたの存在そのものに、確かな意味があります。', category: 'support' },
  
  // 追加メッセージ（54〜103）
  { id: 'enc-54', text: 'AIにできないのは、心を込めることです。あなたはそれを持っています。', category: 'motivation' },
  { id: 'enc-55', text: '考えて、悩んで、選ぶ。その過程にこそ人の強さがあります。', category: 'support' },
  { id: 'enc-56', text: 'あなたの感じた「迷い」は、成長の証でもあります。', category: 'support' },
  { id: 'enc-57', text: 'AIが答えを出すより前に、あなたはもう動いています。', category: 'praise' },
  { id: 'enc-58', text: 'あなたの言葉には、温度があります。その温度が人の心を動かします。', category: 'praise' },
  { id: 'enc-59', text: '新しい時代に戸惑うのは自然なことです。焦らなくて大丈夫です。', category: 'support' },
  { id: 'enc-60', text: 'あなたが考えたことに、ちゃんと意味があります。', category: 'support' },
  { id: 'enc-61', text: '完璧を目指さなくても、丁寧に向き合う姿が美しいです。', category: 'praise' },
  { id: 'enc-62', text: 'あなたの努力は、静かに世界を変えています。', category: 'motivation' },
  { id: 'enc-63', text: 'AIがどんなに速くても、人の時間には深さがあります。', category: 'motivation' },

  { id: 'enc-64', text: '考え続けること、それ自体があなたの強さです。', category: 'motivation' },
  { id: 'enc-65', text: '小さな前進を、大切に重ねていきましょう。', category: 'support' },
  { id: 'enc-66', text: 'あなたの中の「諦めない気持ち」が、未来を作ります。', category: 'motivation' },
  { id: 'enc-67', text: '疲れたときは、少し立ち止まっても大丈夫です。', category: 'support' },
  { id: 'enc-68', text: '焦らずに、自分のリズムを信じてくださいね。', category: 'support' },
  { id: 'enc-69', text: '心が動いた瞬間こそ、あなたの本音です。', category: 'praise' },
  { id: 'enc-70', text: 'AIには感じ取れない「あなたの優しさ」が、ちゃんと伝わっています。', category: 'support' },
  { id: 'enc-71', text: '小さな違和感を大事にできる。それも感性のひとつです。', category: 'praise' },
  { id: 'enc-72', text: 'あなたのペースで、考えて、創っていきましょう。', category: 'motivation' },
  { id: 'enc-73', text: '誰かに届く言葉を紡げるのは、あなたの経験があるからです。', category: 'praise' },

  { id: 'enc-74', text: 'AIに頼ることも、あなたの選択のひとつです。上手に使っていきましょう。', category: 'support' },
  { id: 'enc-75', text: 'あなたがここまで積み上げてきたことに、自信を持ってください。', category: 'praise' },
  { id: 'enc-76', text: 'うまくいかない日があっても、それがあなたの物語になります。', category: 'support' },
  { id: 'enc-77', text: '何かを好きでい続けること、それ自体が才能です。', category: 'praise' },
  { id: 'enc-78', text: 'あなたが「続けている」ことに、ちゃんと意味があります。', category: 'support' },
  { id: 'enc-79', text: '心から感じた瞬間を、大事にしてくださいね。', category: 'support' },
  { id: 'enc-80', text: 'AIができないのは、「誰かを想う」ことです。あなたにはそれができます。', category: 'praise' },
  { id: 'enc-81', text: 'あなたが悩んでいる時間も、未来につながっています。', category: 'support' },
  { id: 'enc-82', text: 'やめなかったこと、それだけでも本当に立派です。', category: 'praise' },
  { id: 'enc-83', text: '「やってみよう」と思えた自分を、ぜひ褒めてあげてください。', category: 'support' },

  { id: 'enc-84', text: 'AIにできるのは補助まで。動くのは、いつだって人です。', category: 'motivation' },
  { id: 'enc-85', text: 'あなたが今日ここにいること、それだけで十分すごいことです。', category: 'support' },
  { id: 'enc-86', text: '不安な日もありますよね。でも、あなたは一人ではありません。', category: 'support' },
  { id: 'enc-87', text: '挑戦する姿勢そのものが、すでに素晴らしいことです。', category: 'praise' },
  { id: 'enc-88', text: 'あなたのペースで歩いていけば、それが正解です。', category: 'support' },
  { id: 'enc-89', text: '少しずつ整えていけば大丈夫です。焦らないでくださいね。', category: 'support' },
  { id: 'enc-90', text: 'あなたが紡ぐ言葉は、誰かの明かりになります。', category: 'praise' },
  { id: 'enc-91', text: '完璧じゃないからこそ、人の心に届くんです。', category: 'motivation' },
  { id: 'enc-92', text: 'AIよりも先に動けるのは、あなたの感性です。', category: 'praise' },
  { id: 'enc-93', text: 'あなたの存在が、今日も世界をやわらかくしています。', category: 'support' },

  { id: 'enc-94', text: '大丈夫です。少しずつでいいんです。', category: 'support' },
  { id: 'enc-95', text: 'あなたが信じた道を、これからも歩んでください。', category: 'motivation' },
  { id: 'enc-96', text: '時代が変わっても、あなたの優しさは変わりません。', category: 'support' },
  { id: 'enc-97', text: 'AIにできないのは、「生きること」です。あなたは今日を生きています。', category: 'praise' },
  { id: 'enc-98', text: 'どんな小さな挑戦も、確かに前進です。', category: 'motivation' },
  { id: 'enc-99', text: 'あなたが作り出すものに、AIは意味を与えられません。', category: 'motivation' },
  { id: 'enc-100', text: '苦しい時も、あなたの中に希望は生きています。', category: 'support' },
  { id: 'enc-101', text: '変化に戸惑うのは自然なことです。立ち止まっても大丈夫です。', category: 'support' },
  { id: 'enc-102', text: 'AIの進化を恐れず、自分の力を信じてください。', category: 'motivation' },
  { id: 'enc-103', text: 'あなたがここにいること。それが何よりの価値です。', category: 'support' },
];

/**
 * ランダムに励ましメッセージを取得
 * 
 * Note: メッセージは自動的に整形されます:
 * - 句読点の後で適切に改行
 * - 接続詞の前で改行
 * - 文字数に応じてフォントサイズを自動調整
 * - 長すぎる行は強制的に分割
 * 
 * @returns ランダムに選択された励ましメッセージ
 */
export function getRandomEncouragement(): EncouragementMessage {
  const randomIndex = Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length);
  return ENCOURAGEMENT_MESSAGES[randomIndex];
}
