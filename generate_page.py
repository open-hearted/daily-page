#!/usr/bin/env python3
# generate_page.py
import os
from datetime import datetime, timezone, timedelta

# --- 設定 ---
LOG_DIR         = "logs"
DAILY_TEMPLATE  = "daily_template.html"
INDEX_TEMPLATE  = "index_template.html"
INDEX_OUTPUT    = "index.html"
AFFIRMATION     = '''懺悔誓願の文
懺悔いたします。
無明の闇におおわれて、身、口、意、の三業によっておかしてしまったあやまちがあります。
仏、法、僧、に対するあやまち、恩師に対するあやまち、生きとし生けるものに対するあやまち。
これ等いっさいのあやまちを懺悔いたします。
また、自分が受けた他の人々のあやまちも許します。
この様に雑事を離れ、独り静かに自己の心身を念をもって観つめるとき、瞬間、瞬間、変化生滅しつづける現象をヴィパッサナーによって洞察し、真の幸福を得て、解脱の道へ導かれますようにと、ここに誓願をいたします。\n

今日も一歩前へ進もう  片付けよう
6/10 導かれて、自分が書いた「〇ガチで自助努力する」を見つけた 
マーティンセリグマンAIでも、近い回答が出た。6/19にもこの文言に偶然辿り着いた。
Natalie Dawsonともシンクロしてる。9日間忘れてた。

「離散家族をさがします」KBS 6/20
'''
WEEKDAY_LIST    = ["月", "火", "水", "木", "金", "土", "日"]

# --- テンプレート読み込み ---
with open(DAILY_TEMPLATE, "r", encoding="utf-8") as f:
    daily_tpl = f.read()
with open(INDEX_TEMPLATE, "r", encoding="utf-8") as f:
    index_tpl = f.read()

# --- 現在日時を JST で取得 ---
JST = timezone(timedelta(hours=9))
now = datetime.now(JST)
date_str    = now.strftime("%Y-%m-%d-%H-%M")
weekday_str = WEEKDAY_LIST[now.weekday()]

# --- logs ディレクトリを作成 ---
os.makedirs(LOG_DIR, exist_ok=True)

# --- 日付ページを生成 ---
daily_html = daily_tpl.format(
    date=date_str,
    weekday=weekday_str,
    affirmation=AFFIRMATION
)
daily_path = os.path.join(LOG_DIR, f"{date_str}.html")
with open(daily_path, "w", encoding="utf-8") as f:
    f.write(daily_html)
print(f"Generated {daily_path}")

# --- index.html を生成／更新 ---
# logs/*.html をリストアップして月毎にグルーピングしてリンク文字列を作成
entries = sorted(fn for fn in os.listdir(LOG_DIR) if fn.endswith(".html"))

# 年と月をキーにしてファイルをグループ化（キー: 'YYYY-MM'）
from collections import defaultdict
grouped = defaultdict(list)
for fn in entries:
    base = fn[:-5]
    # 期待されるフォーマットは 'YYYY-MM' が先頭にあること
    key = base[:7]
    grouped[key].append((base, fn))

# 生成する HTML: 12カラム（1月..12月）。
links_lines = []
year = entries[0][:4] if entries else now.strftime('%Y')
for m in range(1, 13):
    month_key = f"{year}-{m:02d}"
    links_lines.append(f'    <div class="month-col">')
    # 月見出しは 'M月' のみ
    links_lines.append(f'      <h3>{m}月</h3>')
    links_lines.append(f'      <ul>')
    for base, fn in grouped.get(month_key, []):
        # リンクテキストは月日部分（MM-DD）のみ
        display_date = base[5:10]
        links_lines.append(f'        <li><a href="logs/{fn}">{display_date}</a></li>')
    links_lines.append(f'      </ul>')
    links_lines.append(f'    </div>')

links = "\n".join(links_lines)
# テンプレートの {links} と {year} を置換
index_html = index_tpl.replace('{links}', links).replace('{year}', year)
with open(INDEX_OUTPUT, "w", encoding="utf-8") as f:
    f.write(index_html)
print(f"Updated {INDEX_OUTPUT} with {len(entries)} entries for {year}")
