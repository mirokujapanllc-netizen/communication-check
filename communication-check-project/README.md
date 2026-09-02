# 伝え方診断（BtoE式）

15の質問にチェックするだけで「伝達効率」がわかり、心理学の理論に基づいた
NGワード→OK変換表が表示されるセルフ診断アプリです。
これまでの4本と同じBtoEブランドのデザインで統一しています。

- React + TypeScript + Tailwind CSS
- ログイン不要・データ保存不要・外部API不要（ブラウザだけで完結）
- スマホファースト・レスポンシブ対応
- 「結果を画像として保存」機能は外部ライブラリを使わず、ブラウザ標準のCanvas APIのみで実装

すべてのロジック・UIは `src/App.tsx` の1ファイルにまとまっています。

## ローカルで動かす

```bash
npm install
npm run dev
```

## Vercelへデプロイする

これまでと同じ手順です。

1. このフォルダをGitHubに新しいリポジトリとしてアップロード
2. [vercel.com](https://vercel.com) で「Add New → Project」→ このリポジトリを選択
3. Framework Presetが自動で **Vite** になっていることを確認
4. **Root Directory** を、フォルダをアップロードした場所に合わせて設定
5. 「Deploy」をクリック

## ビルド確認

```bash
npm run build
```

型エラーなし・ビルド成功を確認済みです。
