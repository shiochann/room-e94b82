# SNS投稿コレクター 配布ページ

Chrome拡張「SNS投稿コレクター」を、**購入者に配布するための1枚ページ**。GitHub Pagesで公開する。

- 販売の窓口は有料note。このページのURLをnoteの有料部分に書いて、購入者だけを案内する
- ページにはダウンロード・インストール手順・使い方・トラブル対応・更新手順を全部入れてある
- noteにファイルを添付しないので、**修正版はこのページを更新するだけで全員に届く**

## 構成

```
index.html              ダウンロード・導入・使い方
qa/index.html           Q&A（質問部屋に来た内容を貯める単体ページ）
assets/css/style.css    配色は #FBF4E4 地 + ミント/ピンク/ブルー
assets/js/main.js       ローディングとスクロール表示（外部ライブラリなし）
download/sns-post-collector.zip  配布する拡張本体（バージョンを含まない固定名）
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

`update.sh` がやること: 新ZIPのコピー / バージョン表記・ファイルサイズの書き換え / ZIPの中身の確認（直下に `manifest.json` があるか、`manifest.json` のバージョンが指定と一致しているか）。

**配布ファイル名にバージョンを入れないこと。**
以前 `sns-post-collector-1.0.8.zip` のようにバージョン付きで配布していたが、
更新で旧ファイルが消えると、ページをキャッシュしているブラウザが消えたURLを叩いて
「サイトでファイルを取得できませんでした」になる。固定名なら常に最新が落ちる。
バージョンはページの表記と、ZIP内の `manifest.json` で分かる。
そのため `update.sh` はダウンロードリンクを書き換えない。

そのあと `index.html` の「更新履歴」に1行足して push する。

```html
<li><span>ver 1.0.5</span>〇〇を修正</li>
```

## 画面写真の入れ方

SETUPとUSAGEに画面写真の枠を用意してある。**決まったファイル名で `assets/img/` に置くだけ**で表示される。HTMLを触る必要はない。

まだ用意していない画像の枠は**自動で消える**ので、撮れたものから順に足していけばよい。欠けたまま公開しても崩れない。

```bash
bash check-images.sh   # どれが未用意かを一覧する
```

| ファイル名 | 撮るもの | 優先度 |
|---|---|---|
| `setup-1-extensions.png` | `chrome://extensions` を開いた画面 | 低 |
| `setup-2-devmode.png` | 右上のデベロッパーモードのスイッチ | 中 |
| `setup-3-load.png` | 「パッケージ化されていない拡張機能を読み込む」ボタン | **高** |
| `setup-4-pin.png` | パズルピース🧩を開いてピン留めするところ | **高** |
| `usage-2-panel.png` | Threadsの右上にパネルが出ている状態 | **高** |
| `usage-3-sample.png` | 「試し取得」の結果が出ている状態 | **高** |
| `usage-5-filter.png` | 分布と絞り込みが出ている状態 | 中 |
| `usage-7-ai.png` | AIが分析を返してきた画面 | **高** |

優先度「高」の5枚があれば十分に伝わる。

### 撮り方（Mac）

`Cmd + Shift + 4` で範囲選択。撮った画像はデスクトップに保存されるので、名前を変えて `assets/img/` に移動する。

- 横幅は**1200px前後**が目安。大きすぎるとページが重くなる
- パネルを撮るときは、**周りのThreadsの画面も少し入れる**と位置関係が伝わる
- 個人情報やDMの通知が写り込んでいないか確認する

画像はクリックすると拡大表示される（ライトボックス）。細かい文字が読めるようにしてある。

## 質問が来たときの追加のしかた

Q&Aは **`qa/index.html` という単体ページ** にしてある（`index.html` の `07 Q&A` からはリンクしているだけ）。
質問が増えてもトップページが長くならないようにするため。

追加するときは `qa/index.html` の `<div class="qa">` の中に、この形をコピーして足すだけ。

```html
<details>
  <summary>ここに質問</summary>
  <div class="qa__body">
    <p>ここに答え。</p>
    <p>段落を増やしたいときは &lt;p&gt; を足す。</p>
  </div>
</details>
```

- **新しい質問は上に足す**と、常連の人が見つけやすい
- 1人から来た質問は、たいてい他の10人も同じところで詰まっている。迷ったら載せる
- 答えるときは「できません」で止めず、**代わりにできること**を書くと問い合わせが減る
  （例: スマホでは使えない → ただし分析結果を読むのはスマホでできる）

`04 HELP` との使い分け:

| | 内容 |
|---|---|
| `04 HELP` | 動かない・エラーが出た（トラブル対応） |
| `07 Q&A` | 買う前後の疑問、仕様の確認、不安の解消 |

## リンクプレビュー（OGP）

LINEなどでURLを送ったときに出るカードの画像。**指定しないとページ内の最初の画像が勝手に使われる**ので、専用画像を用意してある。

```bash
bash make-ogp.sh
```

`assets/ogp-source.html` を編集してから実行すると `assets/img/ogp.png`（1200×630）が作り直される。文言や色を変えたいときはそのHTMLを触る。

仕組みはQuickLook（`qlmanage`）でHTMLを画像化している。**QuickLookは正方形でしか書き出せない**ので、1200×1200で作って中央の630pxを切り出す形にしてある。中央の帯からはみ出す位置に文字を置かないこと。

Chromeのヘッドレスは環境によってハングするため使っていない。

### robots.txt をあえて Allow にしている理由

検索避けは `<meta name="robots" content="noindex, nofollow, noarchive">` で行い、robots.txt では**クロールを許可している**。`Disallow: /` にすると逆効果になるため:

- クロールを禁止すると、HTML内の `noindex` を読んでもらえない（＝検索避けが伝わらない）
- リンクプレビューの画像も出なくなる

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
| 購入者からの質問 | `index.html` の `07 Q&A`（下記参照） |
| 更新履歴 | `index.html` の `.log` |
| 連絡先 | `index.html` のフッター |
| 配色 | `assets/css/style.css` の `:root` |
