import { useMemo, useState } from "react";
import btoeLogo from "./assets/btoe-logo.png";
import {
  Sparkles,
  RefreshCw,
  Wand2,
  Share2,
  ListChecks,
  Info,
  MessageSquareWarning,
  ArrowRight,
  Download,
  Loader2,
  Lightbulb,
  BookOpen,
  ExternalLink,
  Coffee,
  Dumbbell,
  Moon,
  Heart,
  Users,
  Swords,
  Brain,
  Megaphone,
  HeartHandshake,
  Hourglass,
} from "lucide-react";

/* ============================================================
   型定義
   ============================================================ */

type CategoryKey = "shogun" | "hakase" | "coach" | "chowa" | "idea" | "mypace";
type FlagColor = "green" | "yellow" | "red";
type RankLetter = "S" | "A" | "B" | "C" | "D";

interface Question {
  id: string;
  category: CategoryKey;
  text: string; // NGワード（診断項目）
  cause: string; // 何が問題か
  okAlternative: string; // OK変換
}

interface CategoryInfo {
  key: CategoryKey;
  order: string; // "01"〜"06"
  label: string; // タイプ名
  catch: string; // サブキャッチ（例：正しさで突き進む）
  voice: string; // キャラのセリフ（吹き出し用）
  description: string; // 診断結果に表示する説明文
  icon: React.ReactNode;
  colorClass: string; // Tailwindのカラー名（brick/ocean/gold/sage/rose/purple）
  colorHex: string;
  bgHex: string; // キャラカードの背景色に合わせたパステルトーン
  quote: string; // アリー社長風の一言（優先順位カードで使用）
}

type Gender = "male" | "female";

/** 性別ごとのキャラクター画像パスを算出（/characters/male|female/xxx.png） */
function characterImagePath(type: CategoryInfo, gender: Gender): string {
  return `/characters/${gender}/${type.key}.jpg`;
}

/* ============================================================
   定数：6タイプの定義（「あなたの伝え方のクセ社長図鑑」準拠）
   ============================================================ */

const CATEGORIES: CategoryInfo[] = [
  {
    key: "shogun",
    order: "01",
    label: "正論武将タイプ",
    catch: "正しさで突き進む",
    voice: "いや、それ間違ってないよね!?",
    description:
      "正しいことを、正しく主張できる人です。ただ、正しさが強すぎると、スタッフは「反論できない空気」を感じてしまうことがあります。",
    icon: <Swords size={16} />,
    colorClass: "brick",
    colorHex: "#C94F4F",
    bgHex: "#F7D9DC",
    quote: "正しさは、伝え方次第で凶器にもなる。",
  },
  {
    key: "hakase",
    order: "02",
    label: "ロジカル博士タイプ",
    catch: "結論から話したい",
    voice: "で？結論は？",
    description:
      "論理的に物事を整理するのが得意な人です。ただ、結論を急ぐあまり、スタッフのプロセスや気持ちを置き去りにしてしまうことがあります。",
    icon: <Brain size={16} />,
    colorClass: "ocean",
    colorHex: "#44C1BE",
    bgHex: "#D6ECEC",
    quote: "結論を急ぐ前に、まず聞く。",
  },
  {
    key: "coach",
    order: "03",
    label: "期待の鬼コーチタイプ",
    catch: "もっとできるはず！",
    voice: "もっといけるだろ!!",
    description:
      "スタッフの可能性を信じて、成長を後押しできる人です。ただ、期待の熱量が強すぎると、スタッフには終わりのないプレッシャーとして伝わることがあります。",
    icon: <Megaphone size={16} />,
    colorClass: "gold",
    colorHex: "#C9A66B",
    bgHex: "#FBEACD",
    quote: "期待は、時に重荷になる。",
  },
  {
    key: "chowa",
    order: "04",
    label: "優しすぎる調整役タイプ",
    catch: "波風立てたくない",
    voice: "みんな大丈夫かな…",
    description:
      "チームの空気や人間関係に、誰よりも気を配れる人です。ただ、気を遣いすぎて、伝えるべきことまで飲み込んでしまうことがあります。",
    icon: <HeartHandshake size={16} />,
    colorClass: "sage",
    colorHex: "#4C9A6A",
    bgHex: "#DCEEE0",
    quote: "伝えないことも、選択の結果。",
  },
  {
    key: "idea",
    order: "05",
    label: "自由なアイデアマンタイプ",
    catch: "考える前に動いちゃう",
    voice: "いいじゃん！やってみよう！",
    description:
      "アイデアと行動力にあふれた人です。ただ、勢いで動くぶん、スタッフには「どこに向かっているのか分からない」と映ってしまうことがあります。",
    icon: <Lightbulb size={16} />,
    colorClass: "rose",
    colorHex: "#FF8DA1",
    bgHex: "#FCE1EA",
    quote: "勢いの前に、ゴールを一言。",
  },
  {
    key: "mypace",
    order: "06",
    label: "マイペース探求者タイプ",
    catch: "じっくり考えたい",
    voice: "わかる…それ、もう少し考えたい…",
    description:
      "物事をじっくり考え、納得してから動ける人です。ただ、そのペースが、スタッフを待たせる時間になっていることがあります。",
    icon: <Hourglass size={16} />,
    colorClass: "purple",
    colorHex: "#B48BC7",
    bgHex: "#E9E0F2",
    quote: "待たせる時間も、共有すれば安心に変わる。",
  },
];

/* ============================================================
   定数：診断項目（6タイプ × 各4問、計24問／NGワード→OK変換データ）
   ============================================================ */

const QUESTIONS: Question[] = [
  // 01 正論武将タイプ
  {
    id: "sg1",
    category: "shogun",
    text: "「いや、それ違うでしょ」とすぐに否定してしまう",
    cause: "否定から入ると、相手は次から意見を言わなくなってしまいます",
    okAlternative: "「なるほど、それでこう考えたんだね」と一度受け止めてから伝える",
  },
  {
    id: "sg2",
    category: "shogun",
    text: "自分が正しいと思うと、意見を曲げられない",
    cause: "正しさを譲らない姿勢は、相手にとって「話しても無駄」という空気になりがちです",
    okAlternative: "「私はこう思うけど、どう思う？」と問いかけの形にする",
  },
  {
    id: "sg3",
    category: "shogun",
    text: "会議で反対意見が出ると、つい論破しにいってしまう",
    cause: "論破された経験は、次の発言を怖くさせてしまいます",
    okAlternative: "「面白い視点だね、もう少し聞かせて」とまず広げる",
  },
  {
    id: "sg4",
    category: "shogun",
    text: "「なんでそんなこともわからないの？」と言ってしまう",
    cause: "能力否定と受け取られやすく、信頼関係を損ないます",
    okAlternative: "「ここまでは合ってる。ここから一緒に確認しよう」",
  },
  // 02 ロジカル博士タイプ
  {
    id: "hk1",
    category: "hakase",
    text: "「で？結論は？」と話を遮ってしまう",
    cause: "話の途中で遮られると、それ以上何も話したくなくなってしまいます",
    okAlternative: "「まず最後まで聞くね」と一呼吸置いてから確認する",
  },
  {
    id: "hk2",
    category: "hakase",
    text: "スタッフの説明が長いと、イライラしてしまう",
    cause: "話し方の癖は人それぞれ。結論から話せない人も一定数います",
    okAlternative: "「大事なところだけ先に教えて」とフォーマットを示してあげる",
  },
  {
    id: "hk3",
    category: "hakase",
    text: "根拠やデータがないと、納得できない",
    cause: "感覚や経験則も、立派な判断材料であることがあります",
    okAlternative: "「感覚でいいから、まず聞かせて」と間口を広げる",
  },
  {
    id: "hk4",
    category: "hakase",
    text: "感覚的な意見に「で、根拠は？」と聞き返してしまう",
    cause: "詰問のように感じられ、発言そのものを控えるようになってしまいます",
    okAlternative: "「そう感じた理由、一緒に言語化してみようか」",
  },
  // 03 期待の鬼コーチタイプ
  {
    id: "co1",
    category: "coach",
    text: "「もっとできるはず」と、成果を出しても満足できない",
    cause: "期待に終わりがないと、相手はどれだけやっても報われないと感じます",
    okAlternative: "「ここまでできたね」とまず今の到達点を認める",
  },
  {
    id: "co2",
    category: "coach",
    text: "「もっといけるだろ！」とハッパをかけてしまう",
    cause: "追い込む言葉は、モチベーションよりプレッシャーとして残りやすいです",
    okAlternative: "「次はここを一緒に伸ばそう」と次の一歩を具体的に示す",
  },
  {
    id: "co3",
    category: "coach",
    text: "「期待してるよ」と伝えることが多い",
    cause: "期待は励みにもなりますが、応えられないと自己評価を下げる重荷にもなります",
    okAlternative: "期待を言葉にせず、「できたこと」を具体的に伝える",
  },
  {
    id: "co4",
    category: "coach",
    text: "できて当たり前だと思ってしまう",
    cause: "「当たり前」の基準は、社長と同じ経験値がなければ揃いません",
    okAlternative: "「これができるようになったんだね」と成長そのものを言葉にする",
  },
  // 04 優しすぎる調整役タイプ
  {
    id: "ch1",
    category: "chowa",
    text: "「みんな大丈夫かな」と気を遣いすぎてしまう",
    cause: "気遣いが強すぎると、必要な指摘やお願いまで飲み込んでしまいます",
    okAlternative: "気遣いはそのままに、伝えるべきことは分けて伝える",
  },
  {
    id: "ch2",
    category: "chowa",
    text: "言いたいことがあっても、飲み込んでしまう",
    cause: "伝えないままでいると、後で大きな不満として溜まってしまいます",
    okAlternative: "「言いにくいんだけど」と前置きしてから伝えてみる",
  },
  {
    id: "ch3",
    category: "chowa",
    text: "注意すべき場面で、つい話をぼかしてしまう",
    cause: "ぼかした指摘は伝わらず、同じことが繰り返される原因になります",
    okAlternative: "事実だけは具体的に、伝え方はやわらかくする",
  },
  {
    id: "ch4",
    category: "chowa",
    text: "スタッフに嫌われるのが怖くて、強く言えない",
    cause: "嫌われたくない気持ちは自然ですが、言わないことも一つの選択の結果です",
    okAlternative: "「あなたのために伝えるね」と目的を先に伝える",
  },
  // 05 自由なアイデアマンタイプ
  {
    id: "id1",
    category: "idea",
    text: "「いいじゃん、やってみよう」とすぐ動いてしまう",
    cause: "勢いだけで進めると、スタッフは何を求められているか分からなくなります",
    okAlternative: "「まずゴールだけ共有するね」と一言添えてから動く",
  },
  {
    id: "id2",
    category: "idea",
    text: "説明が思いつきベースで、後から内容が変わることがある",
    cause: "指示がころころ変わると、スタッフは動くこと自体に慎重になってしまいます",
    okAlternative: "変更した理由も一緒に伝えると、混乱が減ります",
  },
  {
    id: "id3",
    category: "idea",
    text: "指示が感覚的で、具体性に欠けることがある",
    cause: "「いい感じに」は人によって基準がまったく異なります",
    okAlternative: "「例えばこんなイメージ」と具体例を1つ添える",
  },
  {
    id: "id4",
    category: "idea",
    text: "決めたことを、すぐに変えてしまう",
    cause: "決定がすぐ覆ると、スタッフは本気で取り組む意味を見失ってしまいます",
    okAlternative: "変更は「なぜ変えるか」とセットで伝える",
  },
  // 06 マイペース探求者タイプ
  {
    id: "mp1",
    category: "mypace",
    text: "「もう少し考えたい」と、即答を避けてしまう",
    cause: "返事が遅いと、スタッフは判断を仰げず仕事が止まってしまいます",
    okAlternative: "「いつまでに返事するね」と期限だけ先に伝える",
  },
  {
    id: "mp2",
    category: "mypace",
    text: "自分のペースを崩されると、ストレスを感じる",
    cause: "急かされることへの苦手意識は自然ですが、相手にも締切があります",
    okAlternative: "「巻きで一度考えるね」と自分なりのペースで区切りをつける",
  },
  {
    id: "mp3",
    category: "mypace",
    text: "決断に時間がかかり、スタッフを待たせてしまう",
    cause: "待たされる時間は、スタッフにとって不安の時間にもなります",
    okAlternative: "「今検討中、〇日には返すね」と経過を共有する",
  },
  {
    id: "mp4",
    category: "mypace",
    text: "急かされると、本来のパフォーマンスが出ない",
    cause: "急かす側にも事情がありますが、それを伝えないと単なるすれ違いになります",
    okAlternative: "「急いでるのは分かる、少しだけ時間をもらえる？」と伝える",
  },
];

/** 各カテゴリの設問数（動的に算出） */
const CATEGORY_MAX: Record<CategoryKey, number> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.key]: QUESTIONS.filter((q) => q.category === c.key).length }),
  {} as Record<CategoryKey, number>
);

/** デモ回答（初めての人向けサンプル） */
const SAMPLE_CHECKED: Record<string, boolean> = {
  sg1: true,
  sg4: true,
  co2: true,
  co3: true,
  id3: true,
};

/** 有料note（根本改善コンテンツ）のURL。実際のリンクに差し替えてください */
const NOTE_URL = "https://note.com/your_note_url_here";

/** 社長同士の交流コミュニティ・LINEなどのURL。実際のリンクに差し替えてください */
const COMMUNITY_URL = "https://lin.ee/ueMTmdz";

/** おすすめのストレス解消法 */
interface StressTip {
  icon: React.ReactNode;
  text: string;
}
const STRESS_TIPS: StressTip[] = [
  { icon: <Coffee size={18} />, text: "週1回、経営から完全に離れる時間をつくる" },
  { icon: <Dumbbell size={18} />, text: "体を動かす（ジム・散歩・ストレッチなど）" },
  { icon: <Moon size={18} />, text: "睡眠時間を削らない" },
  { icon: <Heart size={18} />, text: "同業者や仲間と、本音で話せる場をもつ" },
];

const COLOR_HEX: Record<FlagColor, string> = {
  green: "#4C9A6A",
  yellow: "#C9A66B",
  red: "#C94F4F",
};

const RANK_STYLE: Record<RankLetter, { bg: string; text: string; hex: string }> = {
  S: { bg: "bg-gradient-to-br from-rose to-rose-deep", text: "text-white", hex: "#FF8DA1" },
  A: { bg: "bg-rose/90", text: "text-white", hex: "#FF8DA1" },
  B: { bg: "bg-gold", text: "text-white", hex: "#C9A66B" },
  C: { bg: "bg-sand", text: "text-ink", hex: "#E6DCC3" },
  D: { bg: "bg-brick", text: "text-white", hex: "#C94F4F" },
};

/* ============================================================
   ユーティリティ
   ============================================================ */

function scoreToRank(score: number): RankLetter {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

function categoryColor(count: number, max: number): FlagColor {
  if (max <= 0) return "green";
  const ratio = count / max;
  if (ratio >= 0.5) return "red";
  if (ratio > 0) return "yellow";
  return "green";
}

/** カテゴリ別チェック数から「あなたは〇〇タイプ」を判定する（同数の場合は01〜06の掲載順を優先） */
function determineType(categoryCounts: Record<CategoryKey, number>): CategoryInfo {
  let top: CategoryInfo = CATEGORIES[0];
  let topCount = -1;
  for (const c of CATEGORIES) {
    if (categoryCounts[c.key] > topCount) {
      topCount = categoryCounts[c.key];
      top = c;
    }
  }
  return top;
}

/** 総合診断：「モラハラ」ではなく「伝達効率」という理系的な切り口で提示する（設問数が変わっても機能するよう割合ベースで判定） */
function overallDiagnosis(total: number, totalMax: number): { label: string; message: string; color: FlagColor } {
  const ratio = totalMax > 0 ? total / totalMax : 0;
  if (ratio <= 0.15) {
    return {
      label: "伝達効率が高い状態です",
      message: "言いたいことが、リスクなくきちんと伝わっている状態です。この調子をキープしましょう。",
      color: "green",
    };
  }
  if (ratio <= 0.35) {
    return {
      label: "少し伝達ロスが出ています",
      message: "内容は正しくても、伝わり方で少しロスが出ている状態です。下のNGワード変換から見直してみましょう。",
      color: "yellow",
    };
  }
  if (ratio <= 0.6) {
    return {
      label: "伝達ロスが目立つ状態です",
      message: "言っていることは正しいのに、伝え方によって受け取ってもらえていない可能性があります。",
      color: "yellow",
    };
  }
  return {
    label: "伝達ロスにより離職が起きているパターンです",
    message: "正しさは伝わっていても、伝え方が原因で離職リスクが高まっている状態です。優先順位をつけて見直しましょう。",
    color: "red",
  };
}

function categoryAdvice(count: number, max: number, category: CategoryInfo): string {
  const ratio = max > 0 ? count / max : 0;
  if (count === 0) {
    return `${category.label}の傾向は理想的な状態です。この調子を維持しましょう。`;
  }
  if (ratio < 0.4) {
    return `${category.label}に、少し気になる項目があります。「${category.quote}」を意識して見直してみましょう。`;
  }
  return `${category.label}の傾向が強く出ています。「${category.quote}」からまず着手しましょう。`;
}

/* ============================================================
   結果を画像として書き出す（外部ライブラリ不使用・Canvas APIのみ）
   ============================================================ */

async function exportResultImage(params: {
  score: number;
  rank: RankLetter;
  type: CategoryInfo;
  gender: Gender;
  total: number;
  totalMax: number;
  diagLabel: string;
  logoSrc: string;
}) {
  const { score, type, gender, total, totalMax, diagLabel, logoSrc } = params;

  if ("fonts" in document) {
    await (document as Document & { fonts: FontFaceSet }).fonts.ready;
  }

  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#F5F0E4";
  ctx.fillRect(0, 0, W, H);

  const logo = new Image();
  logo.src = logoSrc;
  await new Promise<void>((resolve) => {
    logo.onload = () => resolve();
    logo.onerror = () => resolve();
  });
  const logoW = 300;
  const logoH = (logo.height / logo.width) * logoW || 120;
  if (logo.width) ctx.drawImage(logo, (W - logoW) / 2, 100, logoW, logoH);

  const centerText = (text: string, y: number, font: string, color: string) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, W / 2, y);
  };

  let y = 100 + logoH + 55;
  centerText("B t o E 式", y, "bold 26px 'Zen Kaku Gothic New', sans-serif", "#FF8DA1");
  y += 55;
  centerText("社長の伝達ロス診断", y, "bold 40px 'Shippori Mincho', serif", "#111111");
  y += 90;

  // キャラクター画像を先に読み込み、実寸から縦幅を算出してからカードの高さを決める
  const charImg = new Image();
  let charLoaded = false;
  await new Promise<void>((resolve) => {
    charImg.onload = () => {
      charLoaded = true;
      resolve();
    };
    charImg.onerror = () => resolve();
    charImg.src = characterImagePath(type, gender);
  });

  const imgTargetW = 460;
  const imgTargetH = charLoaded
    ? Math.round((charImg.naturalHeight / charImg.naturalWidth) * imgTargetW)
    : 260;

  const topPad = 70;
  const gapAfterImg = 36;
  const labelBlockH = charLoaded ? 0 : 172;
  const gapAfterLabel = charLoaded ? 30 : 18;
  const statsBlockH = 300;
  const bottomPad = 70;
  const cardH = topPad + imgTargetH + gapAfterImg + labelBlockH + gapAfterLabel + statsBlockH + bottomPad;

  const cardY = y;
  const cardX = 80;
  const cardW = W - cardX * 2;
  const radius = 32;
  const cardGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  cardGradient.addColorStop(0, "#111111");
  cardGradient.addColorStop(0.55, "#2E2038");
  cardGradient.addColorStop(1, type.colorHex);
  ctx.fillStyle = cardGradient;
  ctx.beginPath();
  ctx.moveTo(cardX + radius, cardY);
  ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, radius);
  ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, radius);
  ctx.arcTo(cardX, cardY + cardH, cardX, cardY, radius);
  ctx.arcTo(cardX, cardY, cardX + cardW, cardY, radius);
  ctx.closePath();
  ctx.fill();

  let cy = cardY + topPad;

  if (charLoaded) {
    // 角丸の実寸カード画像をそのまま描画
    const imgX = W / 2 - imgTargetW / 2;
    const imgRadius = 20;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(imgX + imgRadius, cy);
    ctx.arcTo(imgX + imgTargetW, cy, imgX + imgTargetW, cy + imgTargetH, imgRadius);
    ctx.arcTo(imgX + imgTargetW, cy + imgTargetH, imgX, cy + imgTargetH, imgRadius);
    ctx.arcTo(imgX, cy + imgTargetH, imgX, cy, imgRadius);
    ctx.arcTo(imgX, cy, imgX + imgTargetW, cy, imgRadius);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(charImg, imgX, cy, imgTargetW, imgTargetH);
    ctx.restore();
    cy += imgTargetH + gapAfterImg;
  } else {
    // 画像未準備時は丸バッジ＋テキストで代替表示
    const r = 90;
    const circleCy = cy + r;
    ctx.beginPath();
    ctx.arc(W / 2, circleCy, r, 0, Math.PI * 2);
    ctx.fillStyle = type.colorHex;
    ctx.fill();
    centerText(type.order, circleCy + 30, "bold 80px 'Shippori Mincho', serif", "#FFFFFF");
    cy += imgTargetH + gapAfterImg;

    centerText("あなたは", cy + 24, "24px 'Zen Kaku Gothic New', sans-serif", "#FFFFFFAA");
    const typeFontSize = type.label.length > 10 ? 42 : 50;
    centerText(type.label, cy + 82, `bold ${typeFontSize}px 'Shippori Mincho', serif`, "#FFFFFF");
    centerText(`「${type.voice}」`, cy + 130, "24px 'Zen Kaku Gothic New', sans-serif", type.colorHex);
    cy += labelBlockH;
  }

  cy += gapAfterLabel;

  centerText(`${total} / ${totalMax}`, cy + 90, "bold 90px 'Shippori Mincho', serif", "#FFFFFF");
  centerText("該当した項目数", cy + 135, "22px 'Zen Kaku Gothic New', sans-serif", "#FFFFFFAA");
  centerText(diagLabel, cy + 210, "bold 26px 'Zen Kaku Gothic New', sans-serif", "#FFFFFF");
  centerText(`経営スコア ${score} / 100`, cy + 270, "22px 'Zen Kaku Gothic New', sans-serif", "#FFFFFFAA");

  centerText(
    "#BtoE式 #社長の伝達ロス診断",
    cardY + cardH + 65,
    "22px 'Zen Kaku Gothic New', sans-serif",
    "#111111AA"
  );

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "社長の伝達ロス診断_結果.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ============================================================
   小さな見た目パーツ
   ============================================================ */

function RankBadge({ rank, size = "md" }: { rank: RankLetter; size?: "md" | "lg" }) {
  const style = RANK_STYLE[rank];
  const dims = size === "lg" ? "w-20 h-20 text-4xl" : "w-12 h-12 text-xl";
  return (
    <div
      className={`${dims} ${style.bg} ${style.text} rounded-full flex items-center justify-center font-display font-bold shadow-salon shrink-0`}
    >
      {rank}
    </div>
  );
}

function CategoryBar({
  label,
  count,
  max,
  color,
}: {
  label: string;
  count: number;
  max: number;
  color: FlagColor;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-body mb-1">
        <span className="text-ink/70">{label}</span>
        <span className="font-semibold text-ink">
          {count} / {max}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-sand overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${max > 0 ? (count / max) * 100 : 0}%`, backgroundColor: COLOR_HEX[color] }}
        />
      </div>
    </div>
  );
}

/** キャラクターカード。アップロード前は自動的にアイコン＋番号のプレースホルダーで代替表示される */
function CharacterAvatar({
  type,
  gender,
  width = 220,
  onStatus,
}: {
  type: CategoryInfo;
  gender: Gender;
  width?: number;
  onStatus?: (loaded: boolean) => void;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  return (
    <div
      key={`${type.key}-${gender}`}
      className="rounded-2xl overflow-hidden shadow-salon shrink-0"
      style={{ width, backgroundColor: type.bgHex }}
    >
      {status !== "failed" ? (
        <img
          src={characterImagePath(type, gender)}
          alt={type.label}
          onLoad={() => {
            setStatus("loaded");
            onStatus?.(true);
          }}
          onError={() => {
            setStatus("failed");
            onStatus?.(false);
          }}
          className="w-full h-auto block"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-14" style={{ color: type.colorHex }}>
          {type.icon}
          <span className="font-display font-bold text-3xl">{type.order}</span>
          <span className="text-[10px] text-ink/40">画像準備中</span>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   メインアプリケーション
   ============================================================ */

export default function App() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [gender, setGender] = useState<Gender | null>(null);

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const loadSample = () => {
    setChecked(SAMPLE_CHECKED);
    if (!gender) setGender("female");
    setSubmitted(true);
  };
  const resetAll = () => {
    setChecked({});
    setSubmitted(false);
    setGender(null);
  };
  const canDiagnose = gender !== null && Object.values(checked).some(Boolean);
  const handleDiagnose = () => {
    if (canDiagnose) setSubmitted(true);
  };

  const result = useMemo(() => {
    const categoryCounts = CATEGORIES.reduce(
      (acc, c) => ({ ...acc, [c.key]: 0 }),
      {} as Record<CategoryKey, number>
    );
    for (const q of QUESTIONS) {
      if (checked[q.id]) categoryCounts[q.category] += 1;
    }
    const total = Object.values(categoryCounts).reduce((sum, n) => sum + n, 0);
    const score = Math.round(100 - (total / QUESTIONS.length) * 100);
    const rank = scoreToRank(score);
    const diag = overallDiagnosis(total, QUESTIONS.length);
    const type = determineType(categoryCounts);

    const priorities = [...CATEGORIES]
      .sort((a, b) => categoryCounts[b.key] - categoryCounts[a.key])
      .slice(0, 3)
      .map((c, i) => ({
        order: i + 1,
        category: c,
        count: categoryCounts[c.key],
        max: CATEGORY_MAX[c.key],
        color: categoryColor(categoryCounts[c.key], CATEGORY_MAX[c.key]),
        advice: categoryAdvice(categoryCounts[c.key], CATEGORY_MAX[c.key], c),
      }));

    const checkedQuestions = QUESTIONS.filter((q) => checked[q.id]);

    return { categoryCounts, total, score, rank, diag, type, priorities, checkedQuestions };
  }, [checked]);

  const answeredCount = Object.values(checked).filter(Boolean).length;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportResultImage({
        score: result.score,
        rank: result.rank,
        type: result.type,
        gender: gender ?? "female",
        total: result.total,
        totalMax: QUESTIONS.length,
        diagLabel: result.diag.label,
        logoSrc: btoeLogo,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-body text-ink pb-16">
      {/* ヘッダー */}
      <header className="sticky top-0 z-20 bg-cream/90 backdrop-blur border-b border-sand">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={btoeLogo} alt="BtoE（Build to Exit）" className="h-8 w-auto shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-rose font-medium tracking-widest leading-tight">BtoE式</p>
              <h1 className="font-display font-bold text-sm sm:text-base leading-tight truncate">社長の伝達ロス診断</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 animate-fade-in-up">
            <div className="text-right">
              <div className="text-[10px] text-ink/50 leading-tight">伝達効率スコア</div>
              <div className="font-display font-bold text-lg leading-tight">
                {result.score}
                <span className="text-xs text-ink/40">/100</span>
              </div>
            </div>
            <RankBadge rank={result.rank} />
          </div>
        </div>
      </header>

      {/* 波モチーフの飾り罫（ブランドのOcean Blue／Hawaiian Purpleをさりげなく） */}
      <div className="max-w-3xl mx-auto px-5 pt-3" aria-hidden="true">
        <svg viewBox="0 0 600 16" className="w-full h-3 opacity-70">
          <path
            d="M0 8 Q 25 0, 50 8 T 100 8 T 150 8 T 200 8 T 250 8 T 300 8 T 350 8 T 400 8 T 450 8 T 500 8 T 550 8 T 600 8"
            fill="none"
            stroke="#44C1BE"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <main className="max-w-3xl mx-auto px-5 pt-4 space-y-6">
        {/* イントロ */}
        <div className="space-y-2">
          <p className="font-display text-xl font-bold text-center">
            AIに聞いてもわからない。あなたの<span className="text-rose">伝え方のクセ</span>
          </p>
          <p className="text-sm text-ink/60 leading-relaxed text-center">
            全6タイプ｜当てはまる項目にチェックを入れると、
            <span className="text-rose font-medium">あなたが社長図鑑のどのタイプか</span>
            と、<span className="text-rose font-medium">NGワード→OK変換</span>が一瞬でわかります。
          </p>
        </div>

        {/* 性別選択（結果イラストの出し分けに使用） */}
        <section className="bg-white rounded-salon shadow-salon p-5 md:p-6">
          <p className="text-sm font-medium mb-1">あなたの性別を教えてください</p>
          <p className="text-xs text-ink/40 mb-4">診断結果のイラストの出し分けに使用します</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGender("male")}
              style={gender === "male" ? { backgroundColor: "#111111" } : undefined}
              className={`rounded-salon py-4 text-sm font-medium transition border ${
                gender === "male"
                  ? "text-white border-transparent"
                  : "border-sand text-ink/60 hover:border-rose/40"
              }`}
            >
              男性
            </button>
            <button
              onClick={() => setGender("female")}
              style={gender === "female" ? { backgroundColor: "#111111" } : undefined}
              className={`rounded-salon py-4 text-sm font-medium transition border ${
                gender === "female"
                  ? "text-white border-transparent"
                  : "border-sand text-ink/60 hover:border-rose/40"
              }`}
            >
              女性
            </button>
          </div>
        </section>

        {/* 診断フォーム */}
        <section className="bg-white rounded-salon shadow-salon p-5 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg flex items-center gap-2">
              <ListChecks size={18} className="text-rose" />
              当てはまるものにチェック
            </h2>
            <div className="flex gap-2">
              <button
                onClick={loadSample}
                className="flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-full border border-rose/30 text-rose hover:bg-rose/10 transition"
              >
                <Wand2 size={14} />
                デモ回答を見る
              </button>
              <button
                onClick={resetAll}
                className="flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-full border border-sand text-ink/50 hover:bg-sand/50 transition"
              >
                <RefreshCw size={14} />
                リセット
              </button>
            </div>
          </div>

          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="space-y-2 pt-4 first:pt-0 border-t border-sand/60 first:border-t-0">
              <div className="space-y-2">
                {QUESTIONS.filter((q) => q.category === cat.key).map((q) => (
                  <label
                    key={q.id}
                    className={`flex items-start gap-3 rounded-salon border p-3.5 cursor-pointer transition ${
                      checked[q.id]
                        ? "border-rose bg-rose/5"
                        : "border-sand hover:border-rose/30 hover:bg-rose/[0.02]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[q.id]}
                      onChange={() => toggle(q.id)}
                      className="mt-0.5 w-5 h-5 shrink-0 accent-rose"
                    />
                    <span className="text-sm leading-relaxed">{q.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center text-xs text-ink/40 pt-1">
            現在 {answeredCount} / {QUESTIONS.length} 項目にチェック中
          </div>

          <button
            onClick={handleDiagnose}
            disabled={!canDiagnose}
            style={canDiagnose ? { backgroundColor: "#111111" } : undefined}
            className={`w-full flex items-center justify-center gap-2 rounded-salon font-medium py-4 transition ${
              canDiagnose
                ? "text-white hover:opacity-90 cursor-pointer"
                : "bg-sand/40 text-ink/30 cursor-not-allowed"
            }`}
          >
            あなたのタイプを診断する
            <ArrowRight size={16} />
          </button>
          {!canDiagnose && (
            <p className="text-center text-xs text-ink/40 -mt-3">
              {gender === null ? "性別を選んで、1つ以上チェックすると診断できます" : "1つ以上チェックすると診断できます"}
            </p>
          )}
        </section>

        {/* 結果 */}
        {!submitted ? (
          <section className="bg-white/60 border border-dashed border-sand rounded-salon p-10 text-center animate-fade-in-up">
            <Info size={28} className="mx-auto text-rose/60 mb-3" />
            <p className="text-sm text-ink/50 leading-relaxed">
              当てはまる項目にチェックを入れて、「あなたのタイプを診断する」を押すと、
              <br />
              診断結果とNGワード変換表がここに表示されます。
            </p>
          </section>
        ) : (
          <>
            {/* あなたは〇〇タイプ（診断のメイン結果／キャラクター付き） */}
            <section
              className="rounded-salon shadow-salon p-6 md:p-8 animate-fade-in-up text-center"
              style={{ backgroundColor: heroImageLoaded ? result.type.bgHex : "#FFFFFF" }}
            >
              {!heroImageLoaded && (
                <p className="text-xs text-rose font-medium tracking-widest mb-4">診断結果　{result.type.order}</p>
              )}

              <div className="flex justify-center mb-5">
                <CharacterAvatar type={result.type} gender={gender ?? "female"} width={240} onStatus={setHeroImageLoaded} />
              </div>

              {!heroImageLoaded && (
                <>
                  <div
                    className="inline-block px-4 py-2 rounded-2xl mb-3 relative"
                    style={{ backgroundColor: `${result.type.colorHex}14` }}
                  >
                    <p className="text-sm font-medium" style={{ color: result.type.colorHex }}>
                      「{result.type.voice}」
                    </p>
                  </div>

                  <h2 className="font-display font-bold text-2xl md:text-3xl mb-1">{result.type.label}</h2>
                  <p className="text-xs text-ink/40 mb-5">{result.type.catch}</p>
                </>
              )}

              <p
                className="text-sm max-w-md mx-auto leading-relaxed mb-6"
                style={{ color: heroImageLoaded ? "#111111CC" : undefined }}
              >
                {result.type.description}
              </p>

              <div
                className="border-t pt-5"
                style={{ borderColor: heroImageLoaded ? `${result.type.colorHex}55` : undefined }}
              >
                <div className="font-display text-4xl font-bold">
                  {result.total} / {QUESTIONS.length}
                </div>
                <div className="text-xs text-ink/40 mb-2">該当した項目数</div>
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                  style={{
                    backgroundColor: `${COLOR_HEX[result.diag.color]}1A`,
                    color: COLOR_HEX[result.diag.color],
                  }}
                >
                  {result.diag.label}
                </div>
                <p className="text-sm text-ink/70 max-w-md mx-auto">{result.diag.message}</p>
              </div>
            </section>

            {/* カテゴリ別内訳 */}
            <section className="bg-white rounded-salon shadow-salon p-5 md:p-6 animate-fade-in-up space-y-4">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <ListChecks size={18} className="text-rose" />
                6タイプ別の内訳
              </h2>
              <div className="space-y-3">
                {CATEGORIES.map((cat) => (
                  <CategoryBar
                    key={cat.key}
                    label={`${cat.order} ${cat.label}`}
                    count={result.categoryCounts[cat.key]}
                    max={CATEGORY_MAX[cat.key]}
                    color={categoryColor(result.categoryCounts[cat.key], CATEGORY_MAX[cat.key])}
                  />
                ))}
              </div>
            </section>

            {/* 改善優先順位 */}
            <section className="bg-white rounded-salon shadow-salon p-5 md:p-6 animate-fade-in-up">
              <h2 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
                <ListChecks size={18} className="text-rose" />
                改善優先順位トップ3
              </h2>
              <p className="text-xs text-ink/40 mb-4">該当が多いタイプ傾向から、優先的に見直しましょう</p>
              <div className="space-y-3">
                {result.priorities.map((p) => (
                  <div key={p.category.key} className="flex gap-3 items-start rounded-salon border border-sand p-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 text-white"
                      style={{ backgroundColor: COLOR_HEX[p.color] }}
                    >
                      {p.order}
                    </div>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-1.5">
                        <span style={{ color: p.category.colorHex }}>{p.category.icon}</span>
                        {p.category.order} {p.category.label}
                        <span className="text-xs text-ink/40 font-normal">
                          （{p.count}/{p.max}）
                        </span>
                      </div>
                      <div className="text-xs text-ink/60 mt-0.5 leading-relaxed">{p.advice}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* NGワード → OK変換表（該当項目のみパーソナライズ表示） */}
            <section className="bg-white rounded-salon shadow-salon p-5 md:p-6 animate-fade-in-up">
              <h2 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
                <MessageSquareWarning size={18} className="text-rose" />
                NGワード → OK変換
              </h2>
              <p className="text-xs text-ink/40 mb-4">同じ指摘を、同じ強度で、リスクなく伝えるための変換です</p>
              {result.checkedQuestions.length === 0 ? (
                <p className="text-sm text-ink/50">該当する項目はありませんでした。</p>
              ) : (
                <div className="space-y-4">
                  {result.checkedQuestions.map((q) => (
                    <div key={q.id} className="rounded-salon border border-sand p-4 space-y-3">
                      <div className="text-sm font-semibold text-brick">「{q.text}」</div>
                      <div className="flex items-start gap-2 text-xs text-ink/60 bg-cream rounded-lg p-3">
                        <Lightbulb size={14} className="text-gold shrink-0 mt-0.5" />
                        <div>{q.cause}</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight size={16} className="text-sage shrink-0" />
                        <span className="text-sage font-medium">{q.okAlternative}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 気づきメッセージ（固定） */}
            <section className="bg-gradient-to-br from-rose/10 to-gold/10 border border-rose/20 rounded-salon p-6 animate-fade-in-up">
              <h2 className="font-display font-bold text-base mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-rose" />
                アリー社長からの気づき
              </h2>
              <p className="text-sm text-ink/70 leading-relaxed">
                優秀な人材は、放っておいても自立し、やがて独立やキャリアアップで巣立っていきます。目の前で長く働いてくれているスタッフは、「指示があれば力を発揮できるタイプ」であることがほとんどです。それは能力の差であって、伝え方の失敗ではありません。
                <br />
                <br />
                大切なのは「伝わるように話す」ことだけでなく、
                <span className="font-semibold text-rose-deep">「期待をかける相手・かけない相手の線を引く」</span>
                こと。期待は、あなたにとっては善意でも、相手にとっては重荷になることがあります。
              </p>
            </section>

            {/* 共感メッセージ・ストレス解消法（上品な便箋デザイン） */}
            <section className="animate-fade-in-up">
              <div className="relative rounded-salon border border-sand p-8 md:p-10" style={{ backgroundColor: "#FFFDF9" }}>
                <p className="text-[11px] tracking-[0.3em] text-rose/70 mb-1">FROM ALLY</p>
                <h2 className="font-display text-lg font-bold mb-6">社長へ</h2>

                <div className="w-10 h-px bg-sand mb-6" />

                <p className="font-hand text-[19px] leading-[2.1] text-ink/80 mb-8">
                  とは言っても、感情を抑えてのスタッフ対応。ストレス、すごい溜まりますよね。私もです。
                  <br />
                  <br />
                  たくさんのストレスと責任感を、たった1人で抱えるしんどさ。社長、毎日本当にお疲れ様です。
                  <br />
                  <br />
                  だからこそ、社長の健康が一番。おすすめのストレス解消法を、いくつかご紹介しますね。
                </p>

                <div className="space-y-0 mb-8">
                  {STRESS_TIPS.map((tip, i) => (
                    <div
                      key={tip.text}
                      className={`flex items-center gap-3 py-3 text-sm text-ink/70 ${
                        i !== STRESS_TIPS.length - 1 ? "border-b border-sand/70" : ""
                      }`}
                    >
                      <span className="text-rose/70 shrink-0">{tip.icon}</span>
                      {tip.text}
                    </div>
                  ))}
                </div>

                <div className="border-t border-sand pt-7 mb-8 text-center">
                  <p className="text-sm text-ink/70 mb-1">1人で抱えなくて、大丈夫。</p>
                  <p className="text-xs text-ink/40 mb-5">いつか、同じ立場の社長同士で、飲み会でもしましょう。</p>
                  <a
                    href={COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-5 py-2.5 rounded-full border border-rose/40 text-rose-deep hover:bg-rose/5 transition"
                  >
                    <Users size={13} />
                    社長同士がつながる場はこちら
                  </a>
                </div>

                <p className="font-display text-base text-ink/50 text-right">－　アリー</p>
              </div>
            </section>

            {/* シェアカード */}
            <section className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3 text-ink/50 text-xs font-medium">
                <Share2 size={14} />
                この結果をシェアしよう
              </div>
              <div className="relative overflow-hidden rounded-salon shadow-salon-lg bg-gradient-to-br from-ink via-[#2E2038] text-white p-7" style={{ backgroundImage: `linear-gradient(135deg, #111111, #2E2038, ${result.type.colorHex})` }}>
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 20%, #ffffff55 0, transparent 40%), radial-gradient(circle at 80% 80%, #ffffff33 0, transparent 45%)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-white rounded-md px-2 py-1 flex items-center">
                        <img src={btoeLogo} alt="BtoE" className="h-3.5 w-auto" />
                      </div>
                      <span className="text-[10px] tracking-widest uppercase text-white/70 leading-tight">
                        BtoE式 社長の伝達ロス診断
                      </span>
                    </div>
                    <RankBadge rank={result.rank} size="lg" />
                  </div>

                  <div className="flex justify-center mb-5">
                    <CharacterAvatar type={result.type} gender={gender ?? "female"} width={160} onStatus={setHeroImageLoaded} />
                  </div>

                  {!heroImageLoaded && (
                    <div className="mb-6 text-center">
                      <div className="text-xs text-white/60 mb-1">あなたは</div>
                      <div
                        className="font-display text-2xl font-bold leading-tight"
                        style={{ color: result.type.colorHex }}
                      >
                        {result.type.label}
                      </div>
                      <div className="text-xs text-white/50 mt-1">「{result.type.voice}」</div>
                    </div>
                  )}

                  <div className="mb-6 text-center">
                    <div className="text-xs text-white/60 mb-1">該当項目数</div>
                    <div className="font-display text-5xl font-bold leading-none">
                      {result.total} / {QUESTIONS.length}
                    </div>
                    <div className="text-sm font-medium mt-3">{result.diag.label}</div>
                  </div>

                  <div className="mt-6 text-[10px] text-white/40 tracking-wide text-center">
                    #BtoE式社長の伝達ロス診断 #美容サロン経営
                  </div>
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-salon bg-ink text-white font-medium py-3.5 hover:bg-ink/90 transition disabled:opacity-60"
              >
                {isExporting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    画像を作成中…
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    結果を画像として保存
                  </>
                )}
              </button>
            </section>

            {/* 有料noteへの導線（新しい疑問を投げかけて根本改善へ誘導） */}
            <section className="bg-ink rounded-salon p-6 md:p-7 text-center animate-fade-in-up">
              <p className="text-xs text-white/50 tracking-wide mb-2">診断はここまで。でも、これで終わりじゃない。</p>
              <h2 className="font-display font-bold text-lg text-white mb-3 leading-relaxed">
                じゃあ、実際の経営では
                <br />
                どう伝える？
              </h2>
              <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-sm mx-auto">
                NGワードの言い換えだけでは、現場の一場面しか解決できません。あなたの状況に合わせた根本的な伝え方の設計は、有料noteで詳しく解説しています。
              </p>
              <a
                href={NOTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-rose text-white font-medium px-6 py-3 hover:bg-rose-deep transition"
              >
                <BookOpen size={16} />
                根本改善の有料noteを見る
                <ExternalLink size={14} />
              </a>
            </section>
          </>
        )}

        <footer className="text-center text-[11px] text-ink/30 pt-4 leading-relaxed">
          本診断は簡易セルフチェックです。改善のヒントとしてご活用ください。
        </footer>
      </main>
    </div>
  );
}
