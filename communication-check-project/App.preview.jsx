import { useMemo, useState } from "react";
const btoeLogo = "data:image/png;base64,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";
import { Sparkles, RefreshCw, Wand2, Share2, ListChecks, Info, MessageSquareWarning, HeartCrack, Scale, ArrowRight, Download, Loader2, Lightbulb, BookOpen, ExternalLink, Coffee, Dumbbell, Moon, PartyPopper, Heart, Users } from "lucide-react";

/* ============================================================
   型定義
   ============================================================ */

/* ============================================================
   定数：診断項目（3カテゴリ・計15問／NGワード→OK変換データ）
   ============================================================ */

const CATEGORIES = [{
  key: "logic",
  label: "詰め方",
  icon: <MessageSquareWarning size={16} />,
  quote: "正しさは、伝え方次第で凶器にもなる。"
}, {
  key: "emotion",
  label: "感情への苦手意識",
  icon: <HeartCrack size={16} />,
  quote: "沈黙は反抗じゃない。脳の防御反応。"
}, {
  key: "expectation",
  label: "期待値のズレ",
  icon: <Scale size={16} />,
  quote: "期待は、時に重荷になる。"
}];
const QUESTIONS = [
// 第1章：詰め方（論理で殴るタイプ）
{
  id: "p1",
  category: "logic",
  text: "「なんでそんなこともわからないの？」と言ってしまう",
  cause: "能力否定＝人格攻撃と受け取られやすく、信頼関係を損ないます",
  okAlternative: "「ここまでは合ってる。ここから先を一緒に確認しよう」"
}, {
  id: "p2",
  category: "logic",
  text: "「普通に考えたらわかるよね？」が口癖",
  cause: "「普通」は自分の基準。相手にとっての当たり前とは限りません",
  okAlternative: "「私の中では当たり前になってたかも。一から説明するね」"
}, {
  id: "p3",
  category: "logic",
  text: "「よくそんなこと社長に言えるな」と言ったことがある",
  cause: "発言を封じる＝以後、報告・相談が来なくなる（経営リスクに直結）",
  okAlternative: "「言ってくれてありがとう。まず整理しよう」"
}, {
  id: "p4",
  category: "logic",
  text: "「なんで自分で調べないの？」と思ってしまう",
  cause: "調べ方を教わっていないだけかもしれません。能力ではなく状況の問題です",
  okAlternative: "「調べ方、一緒に確認しておこうか」"
}, {
  id: "p5",
  category: "logic",
  text: "一度説明したことをまた聞かれると、イライラしてしまう",
  cause: "一度で覚えられるとは限りません。反復して伝えることも大切です",
  okAlternative: "「もう一回いくね。メモ取っておくと安心だよ」"
},
// 第2章：感情への苦手意識（無自覚な圧）
{
  id: "d1",
  category: "emotion",
  text: "ため息をついてしまう",
  cause: "無言のサインが「話しかけづらい」空気を作ってしまいます",
  okAlternative: "深呼吸してから「一旦状況を整理しよう」と言葉にする"
}, {
  id: "d2",
  category: "emotion",
  text: "語尾がきつくなっている自覚がない",
  cause: "本人が思う以上に、相手には強い圧として伝わっていることがあります",
  okAlternative: "語尾を「〜だよね」「〜かな」に置き換える"
}, {
  id: "d3",
  category: "emotion",
  text: "スタッフが感情的になると、対応に困る",
  cause: "感情的な反応は防御反応であることが多く、責めても逆効果です",
  okAlternative: "「一旦落ち着こう。5分後にまた話そう」と間を置く"
}, {
  id: "d4",
  category: "emotion",
  text: "「感情論だな」と思うと、話を聞く気が失せる",
  cause: "話を聞いてもらえない経験が続くと、相談自体をしなくなります",
  okAlternative: "感情の部分は受け止め、事実の部分だけ確認する"
}, {
  id: "d5",
  category: "emotion",
  text: "相手が黙ると、さらに問い詰めてしまう",
  cause: "沈黙は反抗ではなく戸惑いのサイン。追及すると余計に固まってしまいます",
  okAlternative: "「今じゃなくていいよ。落ち着いたら聞かせて」"
},
// 第3章：期待値のズレ・比較
{
  id: "h1",
  category: "expectation",
  text: "平凡なスタッフにも、優秀な人と同じ成長意欲を求めてしまう",
  cause: "人によってモチベーションの源は異なります。同じ熱量を求めすぎると負担になります",
  okAlternative: "「今のペースで大丈夫。困ったら聞いてね」で線を引く"
}, {
  id: "h2",
  category: "expectation",
  text: "「期待してるよ」と伝えることは、相手のためになると思っている",
  cause: "期待はプレッシャーにもなり得ます。応えられないと自己評価が下がります",
  okAlternative: "期待を言葉にせず、「できたこと」を具体的に伝える"
}, {
  id: "h3",
  category: "expectation",
  text: "指示を待っているだけのスタッフに、苛立ちを感じる",
  cause: "指示待ちは「安心」を求めるタイプの特性であり、欠陥ではありません",
  okAlternative: "「指示があれば動ける」という強みとして役割を設計する"
}, {
  id: "h4",
  category: "expectation",
  text: "できるスタッフとできないスタッフを、無意識に比較してしまう",
  cause: "比較されている空気は、本人のパフォーマンスを実際に下げてしまいます",
  okAlternative: "個人の過去の状態と比較する（他者比較をしない）"
}, {
  id: "h5",
  category: "expectation",
  text: "優秀なスタッフがいる同業者を見て、羨ましいと感じることがある",
  cause: "優秀な人材ほど自立志向が強く、独立で巣立っていく傾向があります",
  okAlternative: "「今いるスタッフに合った期待値」に目線を切り替える"
}];

/** 「あなたは〇〇タイプ」診断用のタイプ定義（カテゴリ別＋伝達ロスが少ない場合の特別タイプ） */
const GOOD_TYPE = {
  name: "伝達職人タイプ",
  description: "言葉選びに大きな課題は見られません。今のスタイルを大切にしましょう。"
};
const TYPE_INFO = {
  logic: {
    name: "詰めすぎロジック社長タイプ",
    description: "正しさで詰めてしまう傾向があります。同じ内容でも、伝え方次第でスタッフの受け取り方が大きく変わります。"
  },
  emotion: {
    name: "無自覚プレッシャー社長タイプ",
    description: "本人に悪気はなくても、態度や語調が無言のプレッシャーになっている可能性があります。"
  },
  expectation: {
    name: "期待暴走社長タイプ",
    description: "期待や比較が、知らず知らずのうちにスタッフの負担になっているかもしれません。"
  }
};

/** デモ回答（初めての人向けサンプル） */
const SAMPLE_CHECKED = {
  p1: true,
  p4: true,
  d2: true,
  d5: true,
  h2: true,
  h5: true
};

/** 有料note（根本改善コンテンツ）のURL。実際のリンクに差し替えてください */
const NOTE_URL = "https://note.com/your_note_url_here";

/** 社長同士の交流コミュニティ・LINEなどのURL。実際のリンクに差し替えてください */
const COMMUNITY_URL = "https://line.me/your_community_url_here";

/** おすすめのストレス解消法 */

const STRESS_TIPS = [{
  icon: <Coffee size={18} />,
  text: "週1回、経営から完全に離れる時間をつくる"
}, {
  icon: <Dumbbell size={18} />,
  text: "体を動かす（ジム・散歩・ストレッチなど）"
}, {
  icon: <Moon size={18} />,
  text: "睡眠時間を削らない"
}, {
  icon: <Heart size={18} />,
  text: "同業者や仲間と、本音で話せる場をもつ"
}];
const COLOR_HEX = {
  green: "#4C9A6A",
  yellow: "#D9A441",
  red: "#C94F4F"
};
const RANK_STYLE = {
  S: {
    bg: "bg-gradient-to-br from-rose to-rose-deep",
    text: "text-white",
    hex: "#E96A8D"
  },
  A: {
    bg: "bg-rose/90",
    text: "text-white",
    hex: "#E96A8D"
  },
  B: {
    bg: "bg-gold",
    text: "text-white",
    hex: "#D9A441"
  },
  C: {
    bg: "bg-sand",
    text: "text-ink",
    hex: "#EAE3DD"
  },
  D: {
    bg: "bg-brick",
    text: "text-white",
    hex: "#C94F4F"
  }
};

/* ============================================================
   ユーティリティ
   ============================================================ */

function scoreToRank(score) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}
function categoryColor(count) {
  if (count >= 3) return "red";
  if (count >= 1) return "yellow";
  return "green";
}

/** カテゴリ別チェック数から「あなたは〇〇タイプ」を判定する */
function determineType(total, categoryCounts) {
  if (total <= 2) return GOOD_TYPE;
  // 最もチェックが多いカテゴリを採用（同数の場合は 詰め方 > 感情 > 期待値 の順を優先）
  const priorityOrder = ["logic", "emotion", "expectation"];
  let topKey = "logic";
  let topCount = -1;
  for (const key of priorityOrder) {
    if (categoryCounts[key] > topCount) {
      topCount = categoryCounts[key];
      topKey = key;
    }
  }
  return TYPE_INFO[topKey];
}

/** 総合診断：「モラハラ」ではなく「伝達効率」という理系的な切り口で提示する */
function overallDiagnosis(total) {
  if (total <= 2) {
    return {
      label: "伝達効率が高い状態です",
      message: "言いたいことが、リスクなくきちんと伝わっている状態です。この調子をキープしましょう。",
      color: "green"
    };
  }
  if (total <= 5) {
    return {
      label: "少し伝達ロスが出ています",
      message: "内容は正しくても、伝わり方で少しロスが出ている状態です。下のNGワード変換から見直してみましょう。",
      color: "yellow"
    };
  }
  if (total <= 9) {
    return {
      label: "伝達ロスが目立つ状態です",
      message: "言っていることは正しいのに、伝え方によって受け取ってもらえていない可能性があります。",
      color: "yellow"
    };
  }
  return {
    label: "伝達ロスにより離職が起きているパターンです",
    message: "正しさは伝わっていても、伝え方が原因で離職リスクが高まっている状態です。優先順位をつけて見直しましょう。",
    color: "red"
  };
}
function categoryAdvice(count, category) {
  if (count === 0) {
    return `${category.label}は理想的な状態です。この調子を維持しましょう。`;
  }
  if (count <= 2) {
    return `${category.label}に、少し気になる項目があります。「${category.quote}」を意識して見直してみましょう。`;
  }
  return `${category.label}は伝達ロスのサインが多く出ています。「${category.quote}」からまず着手しましょう。`;
}

/* ============================================================
   結果を画像として書き出す（外部ライブラリ不使用・Canvas APIのみ）
   ============================================================ */

async function exportResultImage(params) {
  const {
    score,
    rank,
    total,
    typeName,
    diagLabel,
    logoSrc
  } = params;
  if ("fonts" in document) {
    await document.fonts.ready;
  }
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#F8F5F2";
  ctx.fillRect(0, 0, W, H);
  const logo = new Image();
  logo.src = logoSrc;
  await new Promise(resolve => {
    logo.onload = () => resolve();
    logo.onerror = () => resolve();
  });
  const logoW = 340;
  const logoH = logo.height / logo.width * logoW || 140;
  if (logo.width) ctx.drawImage(logo, (W - logoW) / 2, 130, logoW, logoH);
  const centerText = (text, y, font, color) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, W / 2, y);
  };
  let y = 130 + logoH + 70;
  centerText("B t o E 式", y, "bold 30px 'Zen Kaku Gothic New', sans-serif", "#E96A8D");
  y += 70;
  centerText("社長の伝達ロス診断", y, "bold 52px 'Shippori Mincho', serif", "#222222");
  y += 110;
  const cardY = y;
  const cardH = 820;
  const cardX = 80;
  const cardW = W - cardX * 2;
  const radius = 32;
  ctx.fillStyle = "#2b2320";
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
  centerText(typeName, cardY + 330, `bold ${typeFontSize}px 'Shippori Mincho', serif`, "#E96A8D");
  centerText(`${total} / 15`, cardY + 470, "bold 110px 'Shippori Mincho', serif", "#FFFFFF");
  centerText("該当した項目数", cardY + 520, "24px 'Zen Kaku Gothic New', sans-serif", "#FFFFFFAA");
  centerText(diagLabel, cardY + 610, "bold 30px 'Zen Kaku Gothic New', sans-serif", "#FFFFFF");
  centerText(`経営スコア ${score} / 100`, cardY + 700, "24px 'Zen Kaku Gothic New', sans-serif", "#FFFFFFAA");
  centerText("#BtoE式 #社長の伝達ロス診断", cardY + cardH + 70, "24px 'Zen Kaku Gothic New', sans-serif", "#22222299");
  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
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

function RankBadge({
  rank,
  size = "md"
}) {
  const style = RANK_STYLE[rank];
  const dims = size === "lg" ? "w-20 h-20 text-4xl" : "w-12 h-12 text-xl";
  return <div className={`${dims} ${style.bg} ${style.text} rounded-full flex items-center justify-center font-display font-bold shadow-salon shrink-0`}>
      {rank}
    </div>;
}
function CategoryBar({
  label,
  count,
  color
}) {
  return <div>
      <div className="flex items-center justify-between text-sm font-body mb-1">
        <span className="text-ink/70">{label}</span>
        <span className="font-semibold text-ink">{count} / 5</span>
      </div>
      <div className="h-2.5 rounded-full bg-sand overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500 ease-out" style={{
        width: `${count / 5 * 100}%`,
        backgroundColor: COLOR_HEX[color]
      }} />
      </div>
    </div>;
}

/* ============================================================
   メインアプリケーション
   ============================================================ */

export default function App() {
  const [checked, setChecked] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const toggle = id => setChecked(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
  const loadSample = () => setChecked(SAMPLE_CHECKED);
  const resetAll = () => setChecked({});
  const result = useMemo(() => {
    const categoryCounts = {
      logic: 0,
      emotion: 0,
      expectation: 0
    };
    for (const q of QUESTIONS) {
      if (checked[q.id]) categoryCounts[q.category] += 1;
    }
    const total = categoryCounts.logic + categoryCounts.emotion + categoryCounts.expectation;
    const score = Math.round(100 - total / QUESTIONS.length * 100);
    const rank = scoreToRank(score);
    const diag = overallDiagnosis(total);
    const type = determineType(total, categoryCounts);
    const priorities = [...CATEGORIES].sort((a, b) => categoryCounts[b.key] - categoryCounts[a.key]).map((c, i) => ({
      order: i + 1,
      category: c,
      count: categoryCounts[c.key],
      color: categoryColor(categoryCounts[c.key]),
      advice: categoryAdvice(categoryCounts[c.key], c)
    }));
    const checkedQuestions = QUESTIONS.filter(q => checked[q.id]);
    return {
      categoryCounts,
      total,
      score,
      rank,
      diag,
      type,
      priorities,
      checkedQuestions
    };
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
        typeName: result.type.name,
        diagLabel: result.diag.label,
        logoSrc: btoeLogo
      });
    } finally {
      setIsExporting(false);
    }
  };
  return <div className="min-h-screen bg-cream font-body text-ink pb-16">
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

      <main className="max-w-3xl mx-auto px-5 pt-6 space-y-6">
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
              <button onClick={loadSample} className="flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-full border border-rose/30 text-rose hover:bg-rose/10 transition">
                <Wand2 size={14} />
                デモ回答を見る
              </button>
              <button onClick={resetAll} className="flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-full border border-sand text-ink/50 hover:bg-sand/50 transition">
                <RefreshCw size={14} />
                リセット
              </button>
            </div>
          </div>

          {CATEGORIES.map(cat => <div key={cat.key} className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-ink/50 tracking-wide">
                <span className="text-rose">{cat.icon}</span>
                {cat.label}
              </div>
              <div className="space-y-2">
                {QUESTIONS.filter(q => q.category === cat.key).map(q => <label key={q.id} className={`flex items-start gap-3 rounded-salon border p-3.5 cursor-pointer transition ${checked[q.id] ? "border-rose bg-rose/5" : "border-sand hover:border-rose/30 hover:bg-rose/[0.02]"}`}>
                    <input type="checkbox" checked={!!checked[q.id]} onChange={() => toggle(q.id)} className="mt-0.5 w-5 h-5 shrink-0 accent-rose" />
                    <span className="text-sm leading-relaxed">{q.text}</span>
                  </label>)}
              </div>
            </div>)}

          <div className="text-center text-xs text-ink/40 pt-1">
            現在 {answeredCount} / {QUESTIONS.length} 項目にチェック中
          </div>
        </section>

        {/* 結果 */}
        {!hasInteracted ? <section className="bg-white/60 border border-dashed border-sand rounded-salon p-10 text-center animate-fade-in-up">
            <Info size={28} className="mx-auto text-rose/60 mb-3" />
            <p className="text-sm text-ink/50 leading-relaxed">
              チェックを入れると、診断結果とNGワード変換表がここに表示されます。
              <br />
              まずは正直に、当てはまるものから始めましょう。
            </p>
          </section> : <>
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
                <div className="font-display text-4xl font-bold">{result.total} / 15</div>
                <div className="text-xs text-ink/40 mb-2">該当した項目数</div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2" style={{
              backgroundColor: `${COLOR_HEX[result.diag.color]}1A`,
              color: COLOR_HEX[result.diag.color]
            }}>
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
                {CATEGORIES.map(cat => <CategoryBar key={cat.key} label={cat.label} count={result.categoryCounts[cat.key]} color={categoryColor(result.categoryCounts[cat.key])} />)}
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
                {result.priorities.map(p => <div key={p.category.key} className="flex gap-3 items-start rounded-salon border border-sand p-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 text-white" style={{
                backgroundColor: COLOR_HEX[p.color]
              }}>
                      {p.order}
                    </div>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-1.5">
                        {p.category.icon}
                        {p.category.label}
                        <span className="text-xs text-ink/40 font-normal">（{p.count}/5）</span>
                      </div>
                      <div className="text-xs text-ink/60 mt-0.5 leading-relaxed">{p.advice}</div>
                    </div>
                  </div>)}
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
              {result.checkedQuestions.length === 0 ? <p className="text-sm text-ink/50">該当する項目はありませんでした。</p> : <div className="space-y-4">
                  {result.checkedQuestions.map(q => <div key={q.id} className="rounded-salon border border-sand p-4 space-y-3">
                      <div className="text-sm font-semibold text-brick">「{q.text}」</div>
                      <div className="flex items-start gap-2 text-xs text-ink/60 bg-cream rounded-lg p-3">
                        <Lightbulb size={14} className="text-gold shrink-0 mt-0.5" />
                        <div>{q.cause}</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight size={16} className="text-sage shrink-0" />
                        <span className="text-sage font-medium">{q.okAlternative}</span>
                      </div>
                    </div>)}
                </div>}
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

            {/* 共感メッセージ・ストレス解消法（一番刺さるポイント） */}
            <section className="bg-white rounded-salon shadow-salon p-6 md:p-7 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-full bg-rose/10 flex items-center justify-center shrink-0">
                  <Heart size={16} className="text-rose" />
                </div>
                <h2 className="font-display font-bold text-base">アリー社長より</h2>
              </div>

              <p className="text-sm text-ink/70 leading-relaxed mb-5">
                とは言っても、感情を抑えてのスタッフ対応。ストレス、すごい溜まりますよね。私もです。
                <br />
                <br />
                たくさんのストレスと責任感を、たった1人で抱えるしんどさ。社長、毎日本当にお疲れ様です。
                <br />
                <br />
                とは言っても、社長の健康が一番。おすすめのストレス解消法を、いくつかご紹介します。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {STRESS_TIPS.map(tip => <div key={tip.text} className="flex items-center gap-2.5 rounded-salon bg-cream px-3.5 py-3 text-xs text-ink/70">
                    <span className="text-rose shrink-0">{tip.icon}</span>
                    {tip.text}
                  </div>)}
              </div>

              <div className="rounded-salon bg-gradient-to-br from-rose/10 to-gold/10 border border-rose/20 p-5 text-center">
                <PartyPopper size={22} className="mx-auto text-rose mb-2" />
                <p className="text-sm font-medium text-ink/80 mb-1">
                  1人で抱えなくて、大丈夫。
                </p>
                <p className="text-xs text-ink/50 mb-4">
                  いつか、同じ立場の社長同士で、飲み会でもしましょう！
                </p>
                <a href={COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2.5 rounded-full bg-white border border-rose/30 text-rose hover:bg-rose/10 transition">
                  <Users size={14} />
                  社長同士がつながる場はこちら
                </a>
              </div>
            </section>

            {/* シェアカード */}
            <section className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3 text-ink/50 text-xs font-medium">
                <Share2 size={14} />
                この結果をシェアしよう
              </div>
              <div className="relative overflow-hidden rounded-salon shadow-salon-lg bg-gradient-to-br from-[#2b2320] via-[#3a2a30] to-rose-deep text-white p-7">
                <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "radial-gradient(circle at 20% 20%, #ffffff55 0, transparent 40%), radial-gradient(circle at 80% 80%, #ffffff33 0, transparent 45%)"
            }} />
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
                    <div className="font-display text-5xl font-bold leading-none">{result.total} / 15</div>
                    <div className="text-sm font-medium mt-3">{result.diag.label}</div>
                  </div>

                  <div className="mt-6 text-[10px] text-white/40 tracking-wide">
                    #BtoE式社長の伝達ロス診断 #美容サロン経営
                  </div>
                </div>
              </div>

              <button onClick={handleExport} disabled={isExporting} className="w-full mt-4 flex items-center justify-center gap-2 rounded-salon bg-ink text-white font-medium py-3.5 hover:bg-ink/90 transition disabled:opacity-60">
                {isExporting ? <>
                    <Loader2 size={16} className="animate-spin" />
                    画像を作成中…
                  </> : <>
                    <Download size={16} />
                    結果を画像として保存
                  </>}
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
              <a href={NOTE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-rose text-white font-medium px-6 py-3 hover:bg-rose-deep transition">
                <BookOpen size={16} />
                根本改善の有料noteを見る
                <ExternalLink size={14} />
              </a>
            </section>
          </>}

        <footer className="text-center text-[11px] text-ink/30 pt-4 leading-relaxed">
          本診断は簡易セルフチェックです。改善のヒントとしてご活用ください。
        </footer>
      </main>
    </div>;
}