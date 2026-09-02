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
  HeartCrack,
  Scale,
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
} from "lucide-react";

/* ============================================================
   型定義
   ============================================================ */

type CategoryKey = "logic" | "emotion" | "expectation";
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
  label: string;
  icon: React.ReactNode;
  quote: string; // アリー社長風の一言
}

/* ============================================================
   定数：診断項目（3カテゴリ・計15問／NGワード→OK変換データ）
   ============================================================ */

const CATEGORIES: CategoryInfo[] = [
  {
    key: "logic",
    label: "詰め方",
    icon: <MessageSquareWarning size={16} />,
    quote: "正しさは、伝え方次第で凶器にもなる。",
  },
  {
    key: "emotion",
    label: "感情への苦手意識",
    icon: <HeartCrack size={16} />,
    quote: "沈黙は反抗じゃない。脳の防御反応。",
  },
  {
    key: "expectation",
    label: "期待値のズレ",
    icon: <Scale size={16} />,
    quote: "期待は、時に重荷になる。",
  },
];

const QUESTIONS: Question[] = [
  // 第1章：詰め方（論理で殴るタイプ）
  {
    id: "p1",
    category: "logic",
    text: "「なんでそんなこともわからないの？」と言ってしまう",
    cause: "能力否定＝人格攻撃と受け取られやすく、信頼関係を損ないます",
    okAlternative: "「ここまでは合ってる。ここから先を一緒に確認しよう」",
  },
  {
    id: "p2",
    category: "logic",
    text: "「普通に考えたらわかるよね？」が口癖",
    cause: "「普通」は自分の基準。相手にとっての当たり前とは限りません",
    okAlternative: "「私の中では当たり前になってたかも。一から説明するね」",
  },
  {
    id: "p3",
    category: "logic",
    text: "「よくそんなこと社長に言えるな」と言ったことがある",
    cause: "発言を封じる＝以後、報告・相談が来なくなる（経営リスクに直結）",
    okAlternative: "「言ってくれてありがとう。まず整理しよう」",
  },
  {
    id: "p4",
    category: "logic",
    text: "「なんで自分で調べないの？」と思ってしまう",
    cause: "調べ方を教わっていないだけかもしれません。能力ではなく状況の問題です",
    okAlternative: "「調べ方、一緒に確認しておこうか」",
  },
  {
    id: "p5",
    category: "logic",
    text: "一度説明したことをまた聞かれると、イライラしてしまう",
    cause: "一度で覚えられるとは限りません。反復して伝えることも大切です",
    okAlternative: "「まとめた資料を渡すから、一緒に確認しよう」",
  },
  {
    id: "p6",
    category: "logic",
    text: "「プライベートな話をしていないで、掃除くらいやれよ」と思ってしまう",
    cause: "怠けているように見えても、空いた時間にやることが仕組み化・マニュアル化されていないだけかもしれません",
    okAlternative: "空いた時間になにをやるかを、あらかじめチェックリストに書いておく",
  },
  {
    id: "p7",
    category: "logic",
    text: "「空いた時間にロープレやれって言ったよね？」と問い詰めてしまう",
    cause: "「言った」だけでは行動は定着しません。いつ・何をするかまでマニュアルに落とし込む必要があります",
    okAlternative: "「今日はこの時間とこの時間、もし巻きで終わって時間が空いたらロープレしてみてね」と具体的に伝えておく",
  },
  // 第2章：感情への苦手意識（無自覚な圧）
  {
    id: "d1",
    category: "emotion",
    text: "ため息をついてしまう",
    cause: "無言のサインが「話しかけづらい」空気を作ってしまいます",
    okAlternative: "深呼吸してから「一旦状況を整理しよう」と言葉にする",
  },
  {
    id: "d2",
    category: "emotion",
    text: "語尾がきつくなっている自覚がない",
    cause: "本人が思う以上に、相手には強い圧として伝わっていることがあります",
    okAlternative: "語尾を「〜だよね」「〜かな」に置き換える",
  },
  {
    id: "d3",
    category: "emotion",
    text: "スタッフが感情的になると、対応に困る",
    cause: "感情的な反応は防御反応であることが多く、責めても逆効果です",
    okAlternative: "「一旦落ち着こう。5分後にまた話そう」と間を置く",
  },
  {
    id: "d4",
    category: "emotion",
    text: "「感情論だな」と思うと、話を聞く気が失せる",
    cause: "話を聞いてもらえない経験が続くと、相談自体をしなくなります",
    okAlternative: "感情の部分は受け止め、事実の部分だけ確認する",
  },
  {
    id: "d5",
    category: "emotion",
    text: "相手が黙ると、さらに問い詰めてしまう",
    cause: "沈黙は反抗ではなく戸惑いのサイン。追及すると余計に固まってしまいます",
    okAlternative: "「今じゃなくていいよ。落ち着いたら聞かせて」",
  },
  // 第3章：期待値のズレ・比較
  {
    id: "h1",
    category: "expectation",
    text: "平凡なスタッフにも、優秀な人と同じ成長意欲を求めてしまう",
    cause: "人によってモチベーションの源は異なります。同じ熱量を求めすぎると負担になります",
    okAlternative: "「今のペースで大丈夫。困ったら聞いてね」で線を引く",
  },
  {
    id: "h2",
    category: "expectation",
    text: "「期待してるよ」と伝えることは、相手のためになると思っている",
    cause: "期待はプレッシャーにもなり得ます。応えられないと自己評価が下がります",
    okAlternative: "期待を言葉にせず、「できたこと」を具体的に伝える",
  },
  {
    id: "h3",
    category: "expectation",
    text: "指示を待っているだけのスタッフに、苛立ちを感じる",
    cause: "指示待ちは「安心」を求めるタイプの特性であり、欠陥ではありません",
    okAlternative: "「指示があれば動ける」という強みとして役割を設計する",
  },
  {
    id: "h4",
    category: "expectation",
    text: "できるスタッフとできないスタッフを、無意識に比較してしまう",
    cause: "比較されている空気は、本人のパフォーマンスを実際に下げてしまいます",
    okAlternative: "個人の過去の状態と比較する（他者比較をしない）",
  },
  {
    id: "h5",
    category: "expectation",
    text: "優秀なスタッフがいる同業者を見て、羨ましいと感じることがある",
    cause: "優秀な人材ほど自立志向が強く、独立で巣立っていく傾向があります",
    okAlternative: "「今いるスタッフに合った期待値」に目線を切り替える",
  },
  {
    id: "h6",
    category: "expectation",
    text: "「早くデビューできるように、少しでも練習しようという気持ちはないのかな」と感じてしまう",
    cause: "成長意欲の熱量は人それぞれ。同じ熱意を前提にすると、噛み合わなさに苛立ちやすくなります",
    okAlternative: "「デビューに向けて、今できることを一緒に確認しよう」と歩幅を合わせる",
  },
  {
    id: "h7",
    category: "expectation",
    text: "「給料を上げてあげたいのに、なぜもっと売上を上げようと思わないんだろう」と感じてしまう",
    cause: "給料と売上のつながりが、スタッフ側にはまだ見えていないだけかもしれません",
    okAlternative: "「売上が上がると、こう還元できる」と、つながりを具体的に伝える",
  },
];

/** 各カテゴリの設問数（章によって数が異なる場合にも対応できるよう動的に算出） */
const CATEGORY_MAX: Record<CategoryKey, number> = {
  logic: QUESTIONS.filter((q) => q.category === "logic").length,
  emotion: QUESTIONS.filter((q) => q.category === "emotion").length,
  expectation: QUESTIONS.filter((q) => q.category === "expectation").length,
};

/** 「あなたは〇〇タイプ」診断用のタイプ定義（カテゴリ別＋伝達ロスが少ない場合の特別タイプ） */
const GOOD_TYPE = {
  name: "伝達職人タイプ",
  description: "言葉選びに大きな課題は見られません。今のスタイルを大切にしましょう。",
};
const TYPE_INFO: Record<CategoryKey, { name: string; description: string }> = {
  logic: {
    name: "詰めすぎロジック社長タイプ",
    description:
      "正しさで詰めてしまう傾向があります。同じ内容でも、伝え方次第でスタッフの受け取り方が大きく変わります。",
  },
  emotion: {
    name: "無自覚プレッシャー社長タイプ",
    description: "本人に悪気はなくても、態度や語調が無言のプレッシャーになっている可能性があります。",
  },
  expectation: {
    name: "期待暴走社長タイプ",
    description: "期待や比較が、知らず知らずのうちにスタッフの負担になっているかもしれません。",
  },
};

/** デモ回答（初めての人向けサンプル） */
const SAMPLE_CHECKED: Record<string, boolean> = {
  p1: true,
  p4: true,
  d2: true,
  d5: true,
  h2: true,
  h5: true,
};

/** 有料note（根本改善コンテンツ）のURL。実際のリンクに差し替えてください */
const NOTE_URL = "https://note.com/your_note_url_here";

/** 社長同士の交流コミュニティ・LINEなどのURL。実際のリンクに差し替えてください */
const COMMUNITY_URL = "https://line.me/your_community_url_here";

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

/** カテゴリ別チェック数から「あなたは〇〇タイプ」を判定する */
function determineType(
  total: number,
  totalMax: number,
  categoryCounts: Record<CategoryKey, number>
): { name: string; description: string } {
  if (totalMax === 0 || total / totalMax <= 0.15) return GOOD_TYPE;
  // 最もチェックが多いカテゴリを採用（同数の場合は 詰め方 > 感情 > 期待値 の順を優先）
  const priorityOrder: CategoryKey[] = ["logic", "emotion", "expectation"];
  let topKey: CategoryKey = "logic";
  let topCount = -1;
  for (const key of priorityOrder) {
    if (categoryCounts[key] > topCount) {
      topCount = categoryCounts[key];
      topKey = key;
    }
  }
  return TYPE_INFO[topKey];
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
    return `${category.label}は理想的な状態です。この調子を維持しましょう。`;
  }
  if (ratio < 0.4) {
    return `${category.label}に、少し気になる項目があります。「${category.quote}」を意識して見直してみましょう。`;
  }
  return `${category.label}は伝達ロスのサインが多く出ています。「${category.quote}」からまず着手しましょう。`;
}

/* ============================================================
   結果を画像として書き出す（外部ライブラリ不使用・Canvas APIのみ）
   ============================================================ */

async function exportResultImage(params: {
  score: number;
  rank: RankLetter;
  total: number;
  totalMax: number;
  typeName: string;
  diagLabel: string;
  logoSrc: string;
}) {
  const { score, rank, total, totalMax, typeName, diagLabel, logoSrc } = params;

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
  const logoW = 340;
  const logoH = (logo.height / logo.width) * logoW || 140;
  if (logo.width) ctx.drawImage(logo, (W - logoW) / 2, 130, logoW, logoH);

  const centerText = (text: string, y: number, font: string, color: string) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, W / 2, y);
  };

  let y = 130 + logoH + 70;
  centerText("B t o E 式", y, "bold 30px 'Zen Kaku Gothic New', sans-serif", "#FF8DA1");
  y += 70;
  centerText("社長の伝達ロス診断", y, "bold 52px 'Shippori Mincho', serif", "#111111");
  y += 110;

  const cardY = y;
  const cardH = 820;
  const cardX = 80;
  const cardW = W - cardX * 2;
  const radius = 32;
  // 深い黒からハワイアンパープルへ沈む、クラシックハワイの夕景をイメージしたグラデーション
  const cardGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  cardGradient.addColorStop(0, "#111111");
  cardGradient.addColorStop(0.55, "#2E2038");
  cardGradient.addColorStop(1, "#B48BC7");
  ctx.fillStyle = cardGradient;
  ctx.beginPath();
  ctx.moveTo(cardX + radius, cardY);
  ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, radius);
  ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, radius);
  ctx.arcTo(cardX, cardY + cardH, cardX, cardY, radius);
  ctx.arcTo(cardX, cardY, cardX + cardW, cardY, radius);
  ctx.closePath();
  ctx.fill();

  const rankHex = RANK_STYLE[rank].hex;
  const badgeCx = W / 2;
  const badgeCy = cardY + 130;
  ctx.beginPath();
  ctx.arc(badgeCx, badgeCy, 72, 0, Math.PI * 2);
  ctx.fillStyle = rankHex;
  ctx.fill();
  centerText(rank, badgeCy + 26, "bold 70px 'Shippori Mincho', serif", "#FFFFFF");

  centerText("あなたは", cardY + 260, "26px 'Zen Kaku Gothic New', sans-serif", "#FFFFFFAA");
  // タイプ名は長さに応じてフォントサイズを調整
  const typeFontSize = typeName.length > 10 ? 44 : 52;
  centerText(typeName, cardY + 330, `bold ${typeFontSize}px 'Shippori Mincho', serif`, "#FF8DA1");

  centerText(`${total} / ${totalMax}`, cardY + 470, "bold 110px 'Shippori Mincho', serif", "#FFFFFF");
  centerText("該当した項目数", cardY + 520, "24px 'Zen Kaku Gothic New', sans-serif", "#FFFFFFAA");

  centerText(diagLabel, cardY + 610, "bold 30px 'Zen Kaku Gothic New', sans-serif", "#FFFFFF");

  centerText(`経営スコア ${score} / 100`, cardY + 700, "24px 'Zen Kaku Gothic New', sans-serif", "#FFFFFFAA");

  centerText(
    "#BtoE式 #社長の伝達ロス診断",
    cardY + cardH + 70,
    "24px 'Zen Kaku Gothic New', sans-serif",
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

/* ============================================================
   メインアプリケーション
   ============================================================ */

export default function App() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isExporting, setIsExporting] = useState(false);

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const loadSample = () => setChecked(SAMPLE_CHECKED);
  const resetAll = () => setChecked({});

  const result = useMemo(() => {
    const categoryCounts: Record<CategoryKey, number> = { logic: 0, emotion: 0, expectation: 0 };
    for (const q of QUESTIONS) {
      if (checked[q.id]) categoryCounts[q.category] += 1;
    }
    const total = categoryCounts.logic + categoryCounts.emotion + categoryCounts.expectation;
    const score = Math.round(100 - (total / QUESTIONS.length) * 100);
    const rank = scoreToRank(score);
    const diag = overallDiagnosis(total, QUESTIONS.length);
    const type = determineType(total, QUESTIONS.length, categoryCounts);

    const priorities = [...CATEGORIES]
      .sort((a, b) => categoryCounts[b.key] - categoryCounts[a.key])
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
  const hasInteracted = Object.keys(checked).length > 0;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportResultImage({
        score: result.score,
        rank: result.rank,
        total: result.total,
        totalMax: QUESTIONS.length,
        typeName: result.type.name,
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
            その一言、<span className="text-rose">パワハラ</span>になっていませんか？
          </p>
          <p className="text-sm text-ink/60 leading-relaxed text-center">
            言っていることは、間違っていないはずなのに。当てはまる項目にチェックを入れると、
            <span className="text-rose font-medium">あなたのタイプ</span>と
            <span className="text-rose font-medium">NGワード→OK変換</span>が一瞬でわかります。
          </p>
        </div>

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
            <div key={cat.key} className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-ink/50 tracking-wide">
                <span className="text-rose">{cat.icon}</span>
                {cat.label}
              </div>
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
        </section>

        {/* 結果 */}
        {!hasInteracted ? (
          <section className="bg-white/60 border border-dashed border-sand rounded-salon p-10 text-center animate-fade-in-up">
            <Info size={28} className="mx-auto text-rose/60 mb-3" />
            <p className="text-sm text-ink/50 leading-relaxed">
              チェックを入れると、診断結果とNGワード変換表がここに表示されます。
              <br />
              まずは正直に、当てはまるものから始めましょう。
            </p>
          </section>
        ) : (
          <>
            {/* あなたは〇〇タイプ（診断のメイン結果） */}
            <section className="bg-white rounded-salon shadow-salon p-6 md:p-8 animate-fade-in-up text-center">
              <p className="text-xs text-rose font-medium tracking-widest mb-2">診断結果</p>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
                あなたは
                <span className="text-rose">{result.type.name}</span>
              </h2>
              <p className="text-sm text-ink/70 max-w-md mx-auto leading-relaxed mb-6">
                {result.type.description}
              </p>

              <div className="border-t border-sand pt-5">
                <div className="font-display text-4xl font-bold">{result.total} / {QUESTIONS.length}</div>
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
                カテゴリ別の内訳
              </h2>
              <div className="space-y-3">
                {CATEGORIES.map((cat) => (
                  <CategoryBar
                    key={cat.key}
                    label={cat.label}
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
                改善優先順位
              </h2>
              <p className="text-xs text-ink/40 mb-4">該当が多いカテゴリから、優先的に見直しましょう</p>
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
                        {p.category.icon}
                        {p.category.label}
                        <span className="text-xs text-ink/40 font-normal">（{p.count}/{p.max}）</span>
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
              <p className="text-xs text-ink/40 mb-4">
                同じ指摘を、同じ強度で、リスクなく伝えるための変換です
              </p>
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
              <div
                className="relative rounded-salon border border-sand p-8 md:p-10"
                style={{ backgroundColor: "#FFFDF9" }}
              >
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
                  <p className="text-xs text-ink/40 mb-5">
                    いつか、同じ立場の社長同士で、飲み会でもしましょう。
                  </p>
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
              <div className="relative overflow-hidden rounded-salon shadow-salon-lg bg-gradient-to-br from-ink via-[#2E2038] to-purple text-white p-7">
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

                  <div className="mb-6">
                    <div className="text-xs text-white/60 mb-1">あなたは</div>
                    <div className="font-display text-3xl font-bold leading-tight text-rose">
                      {result.type.name}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-xs text-white/60 mb-1">該当項目数</div>
                    <div className="font-display text-5xl font-bold leading-none">{result.total} / {QUESTIONS.length}</div>
                    <div className="text-sm font-medium mt-3">{result.diag.label}</div>
                  </div>

                  <div className="mt-6 text-[10px] text-white/40 tracking-wide">
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
