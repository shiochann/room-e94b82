#!/bin/bash
# 配布ファイルを新しいバージョンに差し替える。
#
#   使い方:  bash update.sh 1.0.5
#
# やること:
#   1. 拡張のdistから該当バージョンのZIPをコピー
#   2. 古いZIPを削除
#   3. index.html のダウンロードリンク・バージョン表記・サイズを書き換え
#
# このあと index.html の「更新履歴」に1行足して、git push すれば公開される。
set -e
cd "$(dirname "$0")"

VERSION="$1"
if [ -z "$VERSION" ]; then
  echo "バージョンを指定してください  例) bash update.sh 1.0.5" >&2
  exit 1
fi

SRC="$HOME/Projects/sns-post-collector/dist/sns-post-collector-${VERSION}.zip"
if [ ! -f "$SRC" ]; then
  echo "ZIPが見つかりません: $SRC" >&2
  echo "先に拡張側で  bash make-dist.sh  を実行してください。" >&2
  exit 1
fi

rm -f download/*.zip
cp "$SRC" download/

SIZE_KB=$(( ($(stat -f%z "download/sns-post-collector-${VERSION}.zip") + 512) / 1024 ))

# ダウンロードリンク / バージョン表記 / サイズ を差し替え
python3 - "$VERSION" "$SIZE_KB" <<'PY'
import re, sys
version, size = sys.argv[1], sys.argv[2]
p = "index.html"
html = open(p, encoding="utf-8").read()

html = re.sub(r'href="download/sns-post-collector-[^"]+\.zip"',
              f'href="download/sns-post-collector-{version}.zip"', html)
html = re.sub(r'(<span class="tag" id="verTag">)ver [^<]+(</span>)',
              rf'\g<1>ver {version}\g<2>', html)
html = re.sub(r'(<span class="tag tag--soft">)約\d+KB(</span>)',
              rf'\g<1>約{size}KB\g<2>', html)

open(p, "w", encoding="utf-8").write(html)
print(f"  index.html を ver {version} / 約{size}KB に更新しました")
PY

echo
echo "差し替え完了: ver ${VERSION}"
echo
echo "残りの手順:"
echo "  1. index.html の「更新履歴」に1行足す"
echo "     例)  <li><span>ver ${VERSION}</span>〇〇を修正</li>"
echo "  2. git add -A && git commit -m \"update: ver ${VERSION}\" && git push"
