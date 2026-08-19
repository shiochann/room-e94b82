# SNS投稿コレクター 配布ページ

Chrome拡張「SNS投稿コレクター」を、**購入者に配布するための1枚ページ**。GitHub Pagesで公開する。

- 販売の窓口は有料note。このページのURLをnoteの有料部分に書いて、購入者だけを案内する
- ページにはダウンロード・インストール手順・使い方・トラブル対応・更新手順を全部入れてある
- noteにファイルを添付しないので、**修正版はこのページを更新するだけで全員に届く**

## 構成

```
index.html              1枚もの。文言を直すときはここ
assets/css/style.css    配色は #FBF4E4 地 + ミント/ピンク/ブルー
assets/js/main.js       ローディングとスクロール表示（外部ライブラリなし）
download/*.zip          配布する拡張本体
robots.txt              検索避け
update.sh               バージョン差し替えスクリプト
```

## 公開のしかた（初回だけ）

1. GitHubで新しいリポジトリを作る（例: `sns-collector-room`）
2. このフォルダをpushする

```bash
cd ~/Projects/sns-collector-room
git init
git add -A
git commit -m "init: 配布ページ"
git branch -M main
git remote add origin https://github.com/shiochann/sns-collector-room.git
git push -u origin main
```

3. GitHubのリポジトリ → Settings → Pages → Source を `main` / `root` にする
4. 数分後 `https://shiochann.github.io/sns-collector-room/` で公開される
5. **このURLをnoteの有料部分に書く**

## 修正版を出すとき

```bash
# 1. 拡張側で新しいZIPを作る
cd ~/Projects/sns-post-collector
# manifest.json の version を上げてから
bash make-dist.sh

# 2. 配布ページに反映
cd ~/Projects/sns-collector-room
bash update.sh 1.0.5
```

`update.sh` がやること: 新ZIPのコピー / 古いZIPの削除 / ダウンロードリンク・バージョン表記・ファイルサイズの書き換え。

そのあと `index.html` の「更新履歴」に1行足して push する。

```html
<li><span>ver 1.0.5</span>〇〇を修正</li>
```

## URLの扱いについて（重要）

**GitHub Pagesは誰でもアクセスできる。** このページは検索避け（`robots.txt` と `noindex`）を入れてあるので検索結果には出ないが、**URLを知っている人は誰でもダウンロードできる**。

つまりURLが流出すると無料で配られたのと同じことになる。守り方は以下の通り。

- URLはnoteの有料部分だけに書く
- ページ内に「URLの再配布・転売は禁止」と明記してある（06 NOTES）
- 流出が疑われる場合は、**リポジトリ名を変えるとURLが変わる**ので実質的に無効化できる（購入者にはnoteを更新して新URLを知らせる）

完全な保護はできない前提で、「善良な購入者が迷わず受け取れること」を優先した設計になっている。

## 文言を直すときの場所

| 直したいもの | 場所 |
|---|---|
| キャッチコピー・説明 | `index.html` のヒーロー部分 |
| インストール手順 | `index.html` の `02 SETUP` |
| 使い方 | `index.html` の `03 USAGE` |
| よくある質問 | `index.html` の `04 HELP`（`<details>` を足すだけ） |
| 更新履歴 | `index.html` の `.log` |
| 連絡先 | `index.html` のフッター |
| 配色 | `assets/css/style.css` の `:root` |
