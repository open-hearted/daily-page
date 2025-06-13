# generate_pages.py

from datetime import datetime, timezone, timedelta
import os

# --- 日付・曜日・アファメーションの設定 ---
JST = timezone(timedelta(hours=9))
now = datetime.now(JST)
date_str = now.strftime("%Y-%m-%d")
weekday_list = ["月", "火", "水", "木", "金", "土", "日"]
weekday_str = weekday_list[now.weekday()]
affirmation = "今日も一歩前へ進もう"

# --- ログ用ディレクトリを作成 ---
os.makedirs("logs", exist_ok=True)

# --- 当日ページを生成（logs/YYYY-MM-DD.html） ---
daily_page = f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>{date_str} ({weekday_str})</title>
  <style>
    /* 必要に応じてスタイルを追加 */
  </style>
</head>
<body>
  <h1>{date_str} ({weekday_str})</h1>
  <p>{affirmation}</p>

  <!-- 動画埋め込み -->
  <iframe
    width="360" height="640"
    src="https://www.youtube.com/embed/BUYUN3gXtd8?mute=1&loop=1&playlist=BUYUN3gXtd8"
    frameborder="0"
    allow="encrypted-media; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>

  <!-- レコード管理スクリプト -->
  <script src="../daily-record.js"></script>
</body>
</html>
"""
with open(f"logs/{date_str}.html", "w", encoding="utf-8") as f:
    f.write(daily_page)

# --- index.html を更新 ---
# logs フォルダ内の .html ファイルを収集
files = sorted(fn for fn in os.listdir("logs") if fn.endswith(".html"))
links = "\n".join(
    f'    <li><a href="logs/{fn}">{fn[:-5]}</a></li>'
    for fn in files
)

index_page = f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Daily Pages</title>
  <style>
    body {{ font-family:sans-serif; }}
    ul {{ list-style:none; padding:0; }}
    li {{ margin-bottom:4px; }}
  </style>
</head>
<body>
  <h1>Daily Pages</h1>
  <ul>
{links}
  </ul>
</body>
</html>
"""
with open("index.html", "w", encoding="utf-8") as f:
    f.write(index_page)

print(f"Generated logs/{date_str}.html and index.html with {len(files)} links.")
