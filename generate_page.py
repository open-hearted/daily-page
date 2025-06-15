#!/usr/bin/env python3
# generate_page.py
import os
from datetime import datetime, timezone, timedelta

# --- 設定 ---
LOG_DIR         = "logs"
DAILY_TEMPLATE  = "daily_template.html"
INDEX_TEMPLATE  = "index_template.html"
INDEX_OUTPUT    = "index.html"
AFFIRMATION     = "今日も一歩前へ進もう"
WEEKDAY_LIST    = ["月", "火", "水", "木", "金", "土", "日"]

# --- テンプレート読み込み ---
with open(DAILY_TEMPLATE, "r", encoding="utf-8") as f:
    daily_tpl = f.read()
with open(INDEX_TEMPLATE, "r", encoding="utf-8") as f:
    index_tpl = f.read()

# --- 現在日時を JST で取得 ---
JST = timezone(timedelta(hours=9))
now = datetime.now(JST)
date_str    = now.strftime("%Y-%m-%d %H:%M")
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
# logs/*.html をリストアップしてリンク文字列を作成
entries = sorted(fn for fn in os.listdir(LOG_DIR) if fn.endswith(".html"))
links = "\n".join(
    f'    <li><a href="logs/{fn}">{fn[:-5]}</a></li>'
    for fn in entries
)
index_html = index_tpl.format(links=links)
with open(INDEX_OUTPUT, "w", encoding="utf-8") as f:
    f.write(index_html)
print(f"Updated {INDEX_OUTPUT} with {len(entries)} entries")
