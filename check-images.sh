#!/bin/bash
# ページが必要としている画面写真のうち、どれが未用意かを一覧する。
#   使い方: bash check-images.sh
set -e
cd "$(dirname "$0")"

python3 - <<'PY'
import os, re

html = open("index.html", encoding="utf-8").read()

# 図のsrcとキャプションを対にして取り出す
figs = re.findall(
    r'<figure class="shot"><img src="([^"]+)"[^>]*>\s*<figcaption>([^<]*)</figcaption>',
    html,
)

ready, missing = [], []
for src, cap in figs:
    (ready if os.path.exists(src) else missing).append((src, cap))

print(f"必要な画像: {len(figs)}枚   用意済み: {len(ready)}枚   未用意: {len(missing)}枚")

if ready:
    print("\n--- 用意済み ---")
    for src, cap in ready:
        kb = os.path.getsize(src) // 1024
        print(f"  OK  {os.path.basename(src):<26} {kb:>5}KB   {cap}")

if missing:
    print("\n--- まだ無い（枠は自動で非表示になります） ---")
    for src, cap in missing:
        print(f"  --  {os.path.basename(src):<26}        {cap}")
    print("\n上のファイル名のとおりに assets/img/ へ保存すれば、そのまま表示されます。")
else:
    print("\nすべて揃っています。")
PY
