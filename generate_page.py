from datetime import datetime, timezone, timedelta
import os

JST = timezone(timedelta(hours=9))
now = datetime.now(JST)
date_str = now.strftime("%Y-%m-%d")
# 0=月曜, …, 6=日曜
weekday_index = now.weekday()

# 日本語の曜日リストを用意
weekday_list = ["月", "火", "水", "木", "金", "土", "日"]

# 最終的に「金曜日」などの文字列に
weekday_str = weekday_list[weekday_index]
affirmation = "今日も一歩前へ進もう"

os.makedirs("logs", exist_ok=True)
with open(f"logs/{date_str}.html", "w", encoding="utf-8") as f:
    f.write(f"""
    <html><body>
    <h1>{date_str} {weekday_str}</h1>
    <p>{affirmation}</p>
    </body></html>
    """)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(f"""
    <html><body>
    <h1>{date_str}  {weekday_str}</h1>
    <p>{affirmation}</p>
    <p><a href="logs/{date_str}.html">この日の記録を見る</a></p>
    </body></html>
    """)
