from datetime import datetime, timezone, timedelta
import os

JST = timezone(timedelta(hours=9))
now = datetime.now(JST)
date_str = now.strftime("%Y-%m-%d")
time_str = now.strftime("%H:%M:%S")
affirmation = "今日も一歩前へ進もう"

os.makedirs("logs", exist_ok=True)
with open(f"logs/{date_str}.html", "w", encoding="utf-8") as f:
    f.write(f"""
    <html><body>
    <h1>{date_str} {time_str}</h1>
    <p>{affirmation}</p>
    </body></html>
    """)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(f"""
    <html><body>
    <h1>{date_str} {time_str}</h1>
    <p>{affirmation}</p>
    <p><a href="logs/{date_str}.html">この日の記録を見る</a></p>
    </body></html>
    """)
