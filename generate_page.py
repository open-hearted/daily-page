from datetime import datetime, timezone, timedelta
import os

# --- JST を使う設定 ---
JST = timezone(timedelta(hours=9))
now = datetime.now(JST)
date_str = now.strftime("%Y-%m-%d")
weekday_list = ["月","火","水","木","金","土","日"]
weekday_str = weekday_list[now.weekday()]
affirmation = "今日も一歩前へ進もう"

# --- ログページ生成 ---
os.makedirs("logs", exist_ok=True)
daily_html = f"""<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>{date_str} ({weekday_str})</title></head>
<body>
  <h1>{date_str} ({weekday_str})</h1>
  <p>{affirmation}</p>
  <!-- ここに localStorage 管理用のスクリプトを入れる -->
  <script src="../daily-logger.js"></script>
</body>
</html>
"""
with open(f"logs/{date_str}.html", "w", encoding="utf-8") as f:
    f.write(daily_html)

# --- index.html 更新 ---
# logs フォルダ内の .html ファイルを収集
files = sorted(os.listdir("logs"))
links = "\n".join(
    f'    <li><a href="logs/{fn}">{fn[:-5]}</a></li>' for fn in files if fn.endswith(".html")
)

index_html = f"""<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>Daily Pages</title></head>
<body>
  <h1>Daily Pages</h1>
  <ul>
{links}
  </ul>
</body>
</html>
"""
with open("index.html", "w", encoding="utf-8") as f:
    f.write(index_html)
